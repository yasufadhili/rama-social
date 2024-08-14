import { RamaBackView, RamaText } from "@/components/Themed";
import {Drawer} from "expo-router/drawer";

export default function CirclesScreen(){
    return <>
    <RamaBackView style={{
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        paddingHorizontal: 14,
        gap: 24
    }}>
        <RamaText variant={"h1"}>Coming Soon</RamaText>
        <RamaText style={{textAlign: "center"}}>The circles feature is currently in development. And only available to a select group of users</RamaText>
    </RamaBackView>
    </>
}