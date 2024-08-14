import { RamaBackView } from "@/components/Themed";
import { usePathname, useSegments } from "expo-router";
import { FAB } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAuth } from "@/context/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import SetupProfileScreen from "./setup-profile";
import AllPostsFeedList from "./(feed)/main-feed";

export default function FeedScreen(){
    const segments = useSegments();
    const pathname = usePathname();
    const {colourTheme, colours} = useTheme();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [fabState, setFabState] = useState({ open: false });
    const { user, userExistsInCollection } = useAuth();
    const onFabStateChange = ({ open }: {open: boolean}) => setFabState({ open });
    const { open } = fabState;

    useEffect(() => {
        if (userExistsInCollection === false) {
          bottomSheetModalRef.current?.present();
        }
      }, [userExistsInCollection]);
    
      if (userExistsInCollection === false) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={['100%']}
                enablePanDownToClose={false}
                handleStyle={{backgroundColor: colours.background.strong}}
              >
                <SetupProfileScreen />
              </BottomSheetModal>
            </SafeAreaView>
        );
      }

    return <>
        <RamaBackView>
            <AllPostsFeedList />
            <FAB.Group
                visible
                open={fabState.open}
                color="#ffffff"
                backdropColor={colourTheme === "dark" ? colours.background.soft : colours.background.soft}
                fabStyle={{
                    backgroundColor: colours.primary,
                    bottom: 8,
                }}
                icon={fabState.open ? "close" : "plus"}
                actions={[
                    { icon: "chevron-down", onPress: () => console.log("Pressed down") },
                    {
                        icon: "image-plus",
                        label: "Media Post",
                        color: colours.text.default,
                        size: "medium",
                        onPress: () => router.navigate("/create-media-post"),
                    },
                    {
                        icon: "sticker-text",
                        label: "Text Card",
                        color: colours.text.default,
                        size: "medium",
                        onPress: () => router.navigate("/create-text-post"),
                    },
                ]}
                onStateChange={onFabStateChange}
                onPress={() => {
                    if (fabState.open) {
                        // Do something if the speed dial is open
                    }
                }}
            />
        </RamaBackView>
    </>
}