import { RamaBackView, RamaCard, RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { Image } from "expo-image";
import { RectButton } from "react-native-gesture-handler";

export default function CirclesListScreen(){
    const CircleCard = () => (
        <RamaCard style={{}}>
            <RectButton style={{
                padding: 12,
                flexDirection: "row",

            }}>
                <RamaHStack>
                    <Image
                        source={{uri: "https://placehold.co/400"}}
                        style={{height: 60, width: 60, borderRadius: 18}}
                    />
                    <RamaVStack style={{gap: 8}}>
                        <RamaText variant={"h2"}>Family</RamaText>
                        <RamaText variant={"p4"}>
                            by : Yasu Fadhili
                        </RamaText>
                    </RamaVStack>
                </RamaHStack>
            </RectButton>
        </RamaCard>
    )
    return <RamaBackView>
        {/** A flatlist component with all the circles */}
        <CircleCard />
    </RamaBackView>
}