import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLang = await AsyncStorage.getItem("userLanguage");
      if (savedLang) {
        return callback(savedLang);
      }
      const deviceLang = Localization.locale.split("-")[0];
      callback(deviceLang);
    } catch (error) {
      console.error("Error detecting language:", error);
      callback("en");
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    try {
      await AsyncStorage.setItem("userLanguage", lang);
    } catch (error) {
      console.error("Error caching language:", error);
    }
  }
};