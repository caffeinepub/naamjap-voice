import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat64 "mo:core/Nat64";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Mantra = {
    name : Text;
    description : Text;
    repetitions : Nat;
  };

  type UserProfile = {
    displayName : Text;
    selectedMantras : [Text];
    preferredSessionTimes : Text;
  };

  module UserProfile {
    public func compare(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      Text.compare(p1.displayName, p2.displayName);
    };
  };

  type DailyChantTotal = {
    date : Nat64;
    mantra : Text;
    count : Nat;
  };

  module DailyChantTotal {
    public func compare(d1 : DailyChantTotal, d2 : DailyChantTotal) : Order.Order {
      Nat64.compare(d1.date, d2.date);
    };

    public func compareByMantra(d1 : DailyChantTotal, d2 : DailyChantTotal) : Order.Order {
      Text.compare(d1.mantra, d2.mantra);
    };

    public func compareByCount(d1 : DailyChantTotal, d2 : DailyChantTotal) : Order.Order {
      Nat.compare(d1.count, d2.count);
    };
  };

  type ChantSession = {
    timestamp : Nat64;
    mantra : Text;
    count : Nat;
    durationMillis : ?Nat;
  };

  module ChantSession {
    public func compare(s1 : ChantSession, s2 : ChantSession) : Order.Order {
      Nat64.compare(s1.timestamp, s2.timestamp);
    };

    public func compareByMantra(s1 : ChantSession, s2 : ChantSession) : Order.Order {
      Text.compare(s1.mantra, s2.mantra);
    };

    public func compareByCount(s1 : ChantSession, s2 : ChantSession) : Order.Order {
      Nat.compare(s1.count, s2.count);
    };
  };

  type Streak = {
    startDate : Nat64;
    endDate : ?Nat64;
    lengthDays : Nat;
    isActive : Bool;
  };

  module Streak {
    public func compare(s1 : Streak, s2 : Streak) : Order.Order {
      Nat64.compare(s1.startDate, s2.startDate);
    };

    public func compareByLength(s1 : Streak, s2 : Streak) : Order.Order {
      Nat.compare(s1.lengthDays, s2.lengthDays);
    };

    public func compareByIsActive(s1 : Streak, s2 : Streak) : Order.Order {
      Bool.compare(s1.isActive, s2.isActive);
    };
  };

  type UserData = {
    profile : UserProfile;
    dailyTotals : [DailyChantTotal];
    sessions : [ChantSession];
    streaks : [Streak];
  };

  module UserData {
    public func compare(u1 : UserData, u2 : UserData) : Order.Order {
      UserProfile.compare(u1.profile, u2.profile);
    };
  };

  let userData = Map.empty<Principal, UserData>();

  type SyncState = { /* internal state */ };
  let userSyncStates = Map.empty<Principal, SyncState>();

  // Persistent storage for mantras (dummy data, can be extended)
  let mantras : [Mantra] = [
    {
      name = "Om Mani Padme Hum";
      description = "Buddhist mantra for compassion";
      repetitions = 108;
    },
    {
      name = "Gayatri Mantra";
      description = "Vedic mantra for enlightenment";
      repetitions = 108;
    },
  ];

  public query ({ caller }) func getMantras() : async [Mantra] {
    mantras;
  };

  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (userData.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?data) { data.profile };
    };
  };

  public query ({ caller }) func getUserProfile(principal : Principal) : async UserProfile {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userData.get(principal)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?data) { data.profile };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let existing = switch (userData.get(caller)) {
      case (null) {
        {
          profile;
          dailyTotals = [];
          sessions = [];
          streaks = [];
        };
      };
      case (?data) {
        {
          profile;
          dailyTotals = data.dailyTotals;
          sessions = data.sessions;
          streaks = data.streaks;
        };
      };
    };
    userData.add(caller, existing);
  };

  public shared ({ caller }) func syncDailyChantTotals(newTotals : [DailyChantTotal]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can sync chant totals");
    };
    switch (userData.get(caller)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?data) {
        var dailyTotalsVar : [DailyChantTotal] = data.dailyTotals;
        for (newTotal in newTotals.values()) {
          let existingIndex = dailyTotalsVar.findIndex(func(total) { total.date == newTotal.date and total.mantra == newTotal.mantra });
          switch (existingIndex) {
            case (?index) {
              dailyTotalsVar := dailyTotalsVar.concat([newTotal]);
            };
            case (null) {
              dailyTotalsVar := dailyTotalsVar.concat([newTotal]);
            };
          };
        };
        let updatedDailyTotals = dailyTotalsVar;
        let updatedUser = {
          profile = data.profile;
          dailyTotals = updatedDailyTotals;
          sessions = data.sessions;
          streaks = data.streaks;
        };
        userData.add(caller, updatedUser);
      };
    };
  };

  public shared ({ caller }) func addChantSession(session : ChantSession) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add chant sessions");
    };
    switch (userData.get(caller)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?data) {
        let sessionsArray = data.sessions;
        let combinedSessions = sessionsArray.concat([session]);
        let updatedUser = {
          profile = data.profile;
          dailyTotals = data.dailyTotals;
          sessions = combinedSessions;
          streaks = data.streaks;
        };
        userData.add(caller, updatedUser);
      };
    };
  };

  public query ({ caller }) func getSessionSummaries() : async [ChantSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access session summaries");
    };
    switch (userData.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?data) { data.sessions };
    };
  };

  public query ({ caller }) func getStreaks() : async [Streak] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access streaks");
    };
    switch (userData.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?data) { data.streaks };
    };
  };

  public query ({ caller }) func getSyncState() : async ?SyncState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access sync state");
    };
    userSyncStates.get(caller);
  };

  public shared ({ caller }) func updateSyncState(state : SyncState) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update sync state");
    };
    userSyncStates.add(caller, state);
  };
};
