import { TColourThemeName, TThemeColours } from "@/types/Colours";

const colours: Record<TColourThemeName, TThemeColours> = {
    light: {
      primary: "#f40752", 
      secondary: "#717171", 
      accent: "#ff73e5",
      text: {
        default: "#3b3e4f",
        strong:"#333",
        soft: "#84889c"
      },
      background: {
        default: "#f2f2f2",
        strong: "#fff",
        soft: "#e2e3ef",
        inverted: "#fff", 
      },
    },
    dark: {
      primary: "#f40752",
      secondary: "#717171", 
      accent: "#ff73e5",
      text: {
        default: "#f2f2f2",
        strong:"#fff",
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
  