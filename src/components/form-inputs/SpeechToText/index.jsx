import React, { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

const SpeechToText = ({
  name,
  placeholder,
  value,
  onChange,
  type = "input", // 'input' | 'textarea'
  className = "",
  lang = "en-US",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = lang;

    recog.onstart = () => setIsListening(true);

    recog.onresult = (event) => {
      let finalText = "";
      let speakingNow = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalText += transcript;
        } else {
          speakingNow = true;
        }
      }

      if (finalText.trim()) {
        onChange({
          target: {
            name,
            value: (value + " " + finalText).trim(),
          },
        });
      }

      if (speakingNow) {
        setIsSpeaking(true);
        resetSilenceTimeout();
      }
    };

    recog.onend = () => {
      setIsListening(false);
      setIsSpeaking(false);
      clearTimeout(silenceTimeoutRef.current);
    };

    recognitionRef.current = recog;

    return () => {
      recog.abort();
      clearTimeout(silenceTimeoutRef.current);
    };
  }, [name, value, onChange]);

  const resetSilenceTimeout = () => {
    clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      recognitionRef.current?.stop();
    }, 3000);
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const renderField = () => {
    const commonProps = {
      className: `input pr-12 ${className}`, // Add padding for mic
      name,
      placeholder,
      value,
      onChange,
    };

    return type === "textarea" ? (
      <textarea rows={4}  {...commonProps} />
    ) : (
      <input type="text" {...commonProps} />
    );
  };

  return (
    <div className="relative w-full">
      {renderField()}

      {/* Mic inside field */}
      <button
        type="button"
        onClick={toggleMic}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow"
      >
        {isListening && isSpeaking && (
          <span className="absolute w-full h-full rounded-full bg-purple-400 opacity-30 animate-ping z-0"></span>
        )}
        {isListening ? (
          <Square size={22} className="text-red-500 z-10" />
        ) : (
          <Mic size={22} className="text-primary z-10" />
        )}
      </button>
    </div>
  );
};

export default SpeechToText;
