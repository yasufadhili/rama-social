import { Image } from "expo-image";

import { View } from "react-native";
import { RamaText } from "./Themed";

export default function HomeHeaderLeft(){
    return <View style={{
        alignItems: "center",
        alignContent: "center",
        gap: 12,
        flexDirection: "row",
    }}>
        <Image
            source={require("../assets/images/logo.png")}
            style={{ width: 22, height: 22,  }}
        />
        <RamaText style={{fontSize: 24}} variant={"h1"}>Rama</RamaText>
    </View>
}