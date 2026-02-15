import { useState, useCallback, useRef } from 'react';
import { normalizeText } from '../lib/textNormalize';

export function useMantraCounting(selectedMantra: string) {
  const [count, setCount] = useState(0);
  const [lastMatch, setLastMatch] = useState<string | null>(null);
  const lastProcessedTranscriptRef = useRef<string>('');

  const processTranscript = useCallback((transcript: string) => {
    const normalized = normalizeText(transcript);
    
    // Prevent processing the same finalized transcript segment twice
    if (normalized === lastProcessedTranscriptRef.current) {
      return;
    }
    lastProcessedTranscriptRef.current = normalized;

    const normalizedMantra = normalizeText(selectedMantra);
    
    if (!normalizedMantra) {
      return;
    }

    // Count non-overlapping occurrences of the mantra in the transcript
    let occurrences = 0;
    let searchIndex = 0;
    
    while (searchIndex <= normalized.length - normalizedMantra.length) {
      const foundIndex = normalized.indexOf(normalizedMantra, searchIndex);
      if (foundIndex === -1) {
        break;
      }
      occurrences++;
      // Move past this occurrence to find the next non-overlapping one
      searchIndex = foundIndex + normalizedMantra.length;
    }

    if (occurrences > 0) {
      setCount(prev => prev + occurrences);
      setLastMatch(`${transcript} (${occurrences} beat${occurrences > 1 ? 's' : ''})`);
    }
  }, [selectedMantra]);

  const manualIncrement = useCallback(() => {
    setCount(prev => prev + 1);
    setLastMatch('Manual increment');
  }, []);

  const reset = useCallback(() => {
    setCount(0);
    setLastMatch(null);
    lastProcessedTranscriptRef.current = '';
  }, []);

  return {
    count,
    lastMatch,
    processTranscript,
    manualIncrement,
    reset,
  };
}
