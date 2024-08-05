import RightFAB from "@/components/RightFAB";
import { RamaBackView, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen(){
  const {user, signOut} = useAuth();
  return <SafeAreaView style={{
    flex: 1
  }}>
      <RamaBackView>
      <RamaText>{user?.uid}</RamaText>
      <Button
        title="Logout"
        onPress={signOut}
      />
      <RightFAB />
    </RamaBackView>
  </SafeAreaView>
}