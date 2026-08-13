import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Loader2 } from "lucide-react";
// ❌ Translateapi import removed — this component no longer knows about any API

/**
 * MultiLangInputBox
 *
 * Renders English / Gujarati / Hindi inputs side by side for a single field.
 * Typing in English triggers the parent-supplied `onTranslate(text)` callback
 * (debounced) to auto-fill Hindi & Gujarati — unless the user has manually
 * edited those fields, in which case auto-fill is skipped until cleared.
 *
 * value shape: { english: '', gujarati: '', hindi: '' }
 * onChange(name, updatedValue)
 * onTranslate(englishText) => Promise<{ hindi?: string, gujarati?: string } | null>
 *
 * multiline: boolean — renders a <textarea> instead of <input> in all three columns (e.g. notes/remarks)
 * rows: number — textarea row count when multiline is true (default 3)
 */

const LANGS = [
  { key: "english", label: "English", speechLang: "en-US" },
  { key: "gujarati", label: "ગુજરાતી", speechLang: "gu-IN" },
  { key: "hindi", label: "Hindi", speechLang: "hi-IN" },
];

const PRIMARY = "primary";


const MultiLangInputBox = ({
  label = "Name",
  name,
  value = { english: "", hindi: "", gujarati: "" },
  onChange,
  onTranslate, // <-- new: parent owns the actual API call
  required = false,
  disabled = false,
  debounceMs = 500,
  multiline = false,
  rows = 3,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [translating, setTranslating] = useState(false);
  const [listening, setListening] = useState(null);
  const recognitionRef = useRef(null);

  const manualEditRef = useRef({ hindi: false, gujarati: false });
  const latestValueRef = useRef(value.english);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
    latestValueRef.current = value.english;
  }, [value.english, value.gujarati, value.hindi]);

  const runTranslation = useCallback(
    async (englishText) => {
      if (!englishText || !englishText.trim()) return;
      if (typeof onTranslate !== "function") return; // no-op if parent didn't wire one up

      const needsHindi = !manualEditRef.current.hindi;
      const needsGujarati = !manualEditRef.current.gujarati;
      if (!needsHindi && !needsGujarati) return;

      setTranslating(true);
      try {
        const data = await onTranslate(englishText);

        // Ignore stale result if a newer keystroke has already superseded it
        if (latestValueRef.current !== englishText) return;

        setLocalValue((prev) => {
          const updated = { ...prev, english: englishText };
          if (needsHindi && data?.hindi) updated.hindi = data.hindi;
          if (needsGujarati && data?.gujarati) updated.gujarati = data.gujarati;
          onChange && onChange(name, updated);
          return updated;
        });
      } catch (err) {
        console.error("Translation failed:", err);
      } finally {
        setTranslating(false);
      }
    },
    [name, onChange, onTranslate]
  );

  const handleEnglishChange = (e) => {
  const text = e.target.value;
  latestValueRef.current = text;

  let updated;
  if (!text.trim()) {
    // English cleared → clear Hindi & Gujarati too, and unlock them for auto-fill again
    manualEditRef.current = { hindi: false, gujarati: false };
    updated = { english: text, hindi: "", gujarati: "" };
  } else {
    updated = { ...localValue, english: text };
  }

  setLocalValue(updated);
  onChange && onChange(name, updated);

  if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

  if (text.trim()) {
    debounceTimerRef.current = setTimeout(() => {
      runTranslation(text);
    }, debounceMs);
  }
};

  const handleManualChange = (lang) => (e) => {
    const text = e.target.value;
    manualEditRef.current[lang] = true;
    if (!text.trim()) manualEditRef.current[lang] = false;

    const updated = { ...localValue, [lang]: text };
    setLocalValue(updated);
    onChange && onChange(name, updated);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  const handleMicClick = (langKey, speechLang) => () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening === langKey) {
      recognitionRef.current?.stop();
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(langKey);
    recognition.onend = () => setListening(null);
    recognition.onerror = () => setListening(null);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      if (langKey === "english") {
        latestValueRef.current = transcript;
        setLocalValue((prev) => {
          const updated = { ...prev, english: transcript };
          onChange && onChange(name, updated);
          return updated;
        });
        runTranslation(transcript);
      } else {
        manualEditRef.current[langKey] = true;
        setLocalValue((prev) => {
          const updated = { ...prev, [langKey]: transcript };
          onChange && onChange(name, updated);
          return updated;
        });
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const fieldClassName =
    "w-full pl-4 pr-12 rounded-lg border border-gray-300 text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 text-sm" +
    (multiline ? " py-2.5 resize-none" : " py-2.5");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {LANGS.map(({ key, label: langLabel, speechLang }) => (
        <div key={key}>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-2">
            {label} ({langLabel})
            {key === "english" && required && (
              <span className="text-red-500"> *</span>
            )}
          </label>
          <div className="relative">
            {multiline ? (
              <textarea
                value={localValue[key] || ""}
                onChange={key === "english" ? handleEnglishChange : handleManualChange(key)}
                placeholder={`${label} (${langLabel})`}
                disabled={disabled}
                rows={rows}
                className={fieldClassName}
                style={{ "--tw-ring-color": PRIMARY }}
                onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            ) : (
              <input
                type="text"
                value={localValue[key] || ""}
                onChange={key === "english" ? handleEnglishChange : handleManualChange(key)}
                placeholder={`${label} (${langLabel})`}
                disabled={disabled}
                className={fieldClassName}
                style={{ "--tw-ring-color": PRIMARY }}
                onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            )}
            {key === "english" && translating && (
              <Loader2
                size={16}
                className={`animate-spin absolute right-4 text-gray-400 ${
                  multiline ? "top-4" : "top-1/2 -translate-y-1/2"
                }`}
              />
            )}
          </div>
          {key !== "english" && translating && !manualEditRef.current[key] && (
            <p className="text-xs text-gray-400 mt-1">Translating...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiLangInputBox;