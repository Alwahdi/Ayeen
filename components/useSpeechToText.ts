import * as Permissions from "expo-permissions";
import * as SpeechRecognizer from "expo-speech-recognizer";
import { useRef, useState } from "react";

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = async () => {
    setTranscript("");
    setIsListening(true);
    try {
      // Request permission if needed
      await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      recognitionRef.current = SpeechRecognizer.startAsync({
        onResult: (result: any) => {
          setTranscript(result.transcript || "");
        },
        onEnd: () => setIsListening(false),
        onError: () => setIsListening(false),
        language: "ar-SA",
      });
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    if (recognitionRef.current) {
      await SpeechRecognizer.stopAsync();
      recognitionRef.current = null;
    }
  };

  return { isListening, transcript, startListening, stopListening };
}
