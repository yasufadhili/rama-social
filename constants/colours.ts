const colours: Record<ColourThemeName, ThemeColours> = {
  light: {
    primary: "#28ABFA", 
    secondary: "#793BCC", 
    accent: "#FF6347",
    text: {
      default: "#3b3e4f",
      strong:"#333",
      soft: "#84889c"
    },
    background: {
      default: "#f2f2f2",
      strong: "#fff",
      soft: "#859295db",
      inverted: "#fff", 
    },
  },
  dark: {
    primary: "#28ABFA",
    secondary: "#793BCC", 
    accent: "#FF6347",
    text: {
      default: "#f2f2f2",
      strong:"fff",
      soft: "#ccc"
    },
    background: {
      default: "#161720",
      strong: "#070812",
      soft: "#252630",
      inverted: "#fff", 
    },
  },
};

export default colours;

export type ThemeColours = {
  primary: string;
  secondary: string;
  accent: string;
  text: {
    default: string,
    strong: string,
    soft: string
  },
  background: {
    default: string,
    strong: string,
    soft: string,
    inverted: string, 
  },
};

export type ColourThemeName = "light" | "dark";
