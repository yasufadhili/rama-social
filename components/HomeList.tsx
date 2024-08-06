import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import HomeHeader from "../components/HomeHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SCREEN_WIDTH } from "@/constants/window";
const MARGIN = 100;
const HomeList = () => {
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <HomeHeader scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          alignItems: "center",
          marginTop: 170,
        }}
      >
        {new Array(10).fill(0).map((_, index) => {
          return (
            <View key={index} style={styles.listItem}>
              <Image
                source={require("../assets/images/icon.png")}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default HomeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    width: SCREEN_WIDTH * 0.9,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
});