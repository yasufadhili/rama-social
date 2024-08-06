import HomeList from "@/components/HomeList";
import RightFAB from "@/components/RightFAB";
import { RamaBackView, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen(){
  const {user, signOut} = useAuth();
  return <SafeAreaView style={{
    flex: 1
  }}>
      <RamaBackView>
        
      <RightFAB />
    </RamaBackView>
  </SafeAreaView>
}