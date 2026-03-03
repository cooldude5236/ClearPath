import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "ar" | "hi" | "es" | "fr" | "zh";
export type Units = "imperial" | "metric";

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "zh", label: "Mandarin", native: "中文" },
];

export function convertDistance(distanceStr: string, units: Units): string {
  if (units === "imperial") return distanceStr;
  if (!distanceStr || distanceStr === "Start" || distanceStr === "You've arrived" || distanceStr === "") {
    return distanceStr;
  }

  const rangeMatch = distanceStr.match(/^(~?)(\d+)\s*–\s*(\d+)\s*ft$/);
  if (rangeMatch) {
    const prefix = rangeMatch[1];
    const low = Math.round(parseInt(rangeMatch[2], 10) * 0.3048);
    const high = Math.round(parseInt(rangeMatch[3], 10) * 0.3048);
    return `${prefix}${low} – ${high} m`;
  }

  const singleMatch = distanceStr.match(/^(~?)(\d+)\s*ft(.*)$/);
  if (singleMatch) {
    const prefix = singleMatch[1];
    const feet = parseInt(singleMatch[2], 10);
    const suffix = singleMatch[3];
    const metres = Math.round(feet * 0.3048);
    return `${prefix}${metres} m${suffix}`;
  }

  return distanceStr;
}

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  units: Units;
  setUnits: (u: Units) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  language: "en",
  setLanguage: () => {},
  units: "imperial",
  setUnits: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [units, setUnitsState] = useState<Units>("imperial");

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
