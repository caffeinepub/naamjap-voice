import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const onTranscriptRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.addEventListener('result', (event: Event) => {
      const e = event as SpeechRecognitionEvent;
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const transcriptText = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += transcriptText + ' ';
          if (onTranscriptRef.current) {
            onTranscriptRef.current(transcriptText);
          }
        } else {
          interimTranscript += transcriptText;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    });

    recognition.addEventListener('error', (event: Event) => {
      const e = event as SpeechRecognitionErrorEvent;
      setError(`Speech recognition error: ${e.error}`);
      setIsListening(false);
    });

    recognition.addEventListener('end', () => {
      if (isListening) {
        // Restart if we're supposed to be listening
        try {
          recognition.start();
        } catch (err) {
          setIsListening(false);
        }
      }
    });

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isListening]);

  const start = useCallback((onTranscript?: (text: string) => void) => {
    if (!isSupported) {
      setError('Speech recognition is not supported');
      return;
    }

    onTranscriptRef.current = onTranscript || null;
    setError(null);
    setTranscript('');
    
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err: any) {
      if (err.message?.includes('already started')) {
        setIsListening(true);
      } else {
        setError(err.message || 'Failed to start speech recognition');
      }
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    setIsListening(false);
    recognitionRef.current?.stop();
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    start,
    stop,
  };
}
