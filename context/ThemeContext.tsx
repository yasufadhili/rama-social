import React, { 
    useCallback, 
    useContext, 
    useMemo, 
    ReactNode, 
    useEffect, 
    useState 
} from "react";
import { 
    ColorSchemeName as ColourSchemeName, 
    useColorScheme as useColourScheme 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import colours from "@/constants/colours";



const THEME_ASYNC_STORAGE_KEY = "THEME";


type Props = {
  children: ReactNode;
};


export type ThemeContextState = {
  theme: ColourSchemeName;
  setTheme: React.Dispatch<React.SetStateAction<ColourSchemeName>>;
  loading: boolean;
};

const ThemeContext = React.createContext<ThemeContextState | undefined>(
  undefined,
);
export default function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<ColourSchemeName>();
  const [loading, setLoading] = useState(true);

  void AsyncStorage.removeItem(THEME_ASYNC_STORAGE_KEY);

  useEffect(() => {
    const load = async () => {
      const storedTheme = (await AsyncStorage.getItem(
        THEME_ASYNC_STORAGE_KEY,
      )) as ColourSchemeName;

      setTheme(storedTheme);
      setLoading(false);
    };

    void load();
  }, []);

  useEffect(() => {
    if (theme) {
      void AsyncStorage.setItem(THEME_ASYNC_STORAGE_KEY, theme);
    } else {
      void AsyncStorage.removeItem(THEME_ASYNC_STORAGE_KEY);
    }
  }, [theme]);

  const contextState = useMemo(
    () => ({ loading, setTheme, theme }),
    [theme, loading],
  );

  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextState}>
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {
  const context = useContext(ThemeContext);
  const systemColourScheme = useColourScheme();

  if (context === undefined) {
    throw new Error("useTheme must be within ThemeProvider");
  }

  const { theme, loading, setTheme } = context;

  if (loading) {
    throw new Error("Tried to use ThemeContext before initialised");
  }

  const colourTheme: NonNullable<ColourSchemeName> =
    theme ?? systemColourScheme ?? "light";

  return {
    colours: useMemo(() => {
      return colours[colourTheme || "light"];
    }, [colourTheme]),
    colourTheme,
    isSystemTheme: !theme,
    isDark: theme === "dark",
    systemTheme: systemColourScheme,
    setColourTheme: useCallback(
      (themeName: ColourSchemeName) => setTheme(themeName),
      [setTheme],
    ),
  };
}


