import { ActivityIndicator, Text, View } from "react-native";

export default function RamaSplashScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Rama</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }