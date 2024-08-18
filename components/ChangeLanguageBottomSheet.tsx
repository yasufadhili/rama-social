import { useTheme } from "@/context/ThemeContext";
import { RamaBackView, RamaHStack, RamaText, RamaVStack } from "./Themed";
import { RectButton } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRamaBottomSheet } from "@/context/BottomSheetContext";

export default function ChangeLanguageBottomSheet(){
    const {colourTheme, colours} = useTheme();
    const {closeBottomSheet} = useRamaBottomSheet();
    const languages = [
        {
            id: 1,
            icon: "",
            name: "English",
            country: "United Kingdon",
            locale: "en"
        },
        {
            id: 2,
            icon: "",
            name: "Kiswahili",
            country: "East Africa",
            locale: "sw"
        },
        {
            id: 3,
            icon: "",
            name: "English",
            country: "Nigeria",
            locale: "en-ng"
        }
    ]
    return <RamaBackView
        style={{
            backgroundColor: colourTheme === "dark" ? colours.background.soft : colours.background.strong,
            paddingHorizontal: 12,
            paddingVertical: 18,
            paddingTop: 48,
            justifyContent: "space-between"
        }}
    >
        <RectButton
            onPress={()=> closeBottomSheet()}
          style={{
            padding: 8,
            position: "absolute",
            right: 12,
            borderRadius: 12
          }}
        >
            <MaterialCommunityIcons
              name={"close"}
              color={colours.text.soft}
              size={22}
               />
        </RectButton>
        <RamaText
          style={{
            position: "absolute",
            left: 12,
            top: 4,
          }}
          variant={"h1"}
        >
            Change Language
        </RamaText>
        <RamaVStack style={{paddingTop: 12, gap:12}}>
            {languages.map((language)=> (
                <RectButton key={language.id}
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    paddingVertical: 12,
                    borderRadius: 12
                  }}  
                >
                    <RamaText >{language.icon}</RamaText>
                    <RamaText variant={"h3"}>{language.name}</RamaText>
                    <RamaText>-</RamaText>
                    <RamaText variant={"h3"}>{language.country}</RamaText>
                </RectButton>
            ))}
        </RamaVStack>
        <RamaVStack style={{
            bottom: 24,
            right: 0,
            left: 0,
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            alignSelf: "flex-end",
            width: "100%",
        }}>
            <RamaText>
                More language to be added soon :)
            </RamaText>
        </RamaVStack>
    </RamaBackView>
}