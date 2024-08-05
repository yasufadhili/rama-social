import RightFAB from "@/components/RightFAB";
import { RamaBackView, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "react-native";

export default function HomeScreen(){
  const {user, signOut} = useAuth();
  return <RamaBackView>
    <RamaText>{user?.uid}</RamaText>
    <Button
      title="Logout"
      onPress={signOut}
    />
    <RightFAB />
  </RamaBackView>
}