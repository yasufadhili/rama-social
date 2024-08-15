
export type TThemeColours = {
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
  
  export type TColourThemeName = "light" | "dark";