import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "ar" | "hi" | "es" | "fr" | "zh";
export type Units = "mi" | "km";

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "zh", label: "Mandarin", native: "中文" },
];

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  units: Units;
  setUnits: (u: Units) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  language: "en",
  setLanguage: () => {},
  units: "mi",
  setUnits: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [units, setUnitsState] = useState<Units>("mi");

  useEffect(() => {
    (async () => {
      const [savedLang, savedUnits] = await Promise.all([
        AsyncStorage.getItem("settings_language"),
        AsyncStorage.getItem("settings_units"),
      ]);
      if (savedLang) setLanguageState(savedLang as Language);
      if (savedUnits) setUnitsState(savedUnits as Units);
    })();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem("settings_language", lang);
  };

  const setUnits = (u: Units) => {
    setUnitsState(u);
    AsyncStorage.setItem("settings_units", u);
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, units, setUnits }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
