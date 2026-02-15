# Specification

## Summary
**Goal:** Improve voice-recognition counting during chanting so multiple mantra repetitions in a single finalized transcript increment the session count by the correct number of detected “beats,” and clarify the UI labeling.

**Planned changes:**
- Update the voice-recognition counting logic to count multiple occurrences of the selected mantra within each finalized speech-to-text transcript (case-insensitive, normalization-aware), and add that number to the session count.
- Ensure each finalized transcript segment is processed once to avoid double-counting.
- Update the Chanting UI voice recognition card to label voice-based counting as “beats” in English (e.g., “Voice beats”) alongside the live session count.
- Confirm manual increment (+) continues to update the same session count used by Mala Progress and Target Progress.

**User-visible outcome:** When chanting with voice recognition enabled, repeating the selected mantra multiple times in one recognized phrase increases the session count by multiple beats, and the UI clearly indicates these are “voice beats.”
