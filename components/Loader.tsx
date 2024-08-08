import { useTheme } from "@/context/ThemeContext"
import { ActivityIndicator } from "react-native"

const RamaLoader:React.FC = () => {
    const {colourTheme, colours} = useTheme();
    return <ActivityIndicator color={colours.primary} size={"small"} />
}

export default RamaLoader;