import { RamaBackView, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";

export default function HomeScreen(){
  const {user} = useAuth();
  return <RamaBackView>
    <RamaText>{user?.uid}</RamaText>
  </RamaBackView>
}