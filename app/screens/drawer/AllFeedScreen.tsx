import { RamaBackView, RamaText } from "@/components/Themed";


export default function AllFeedScreen({route}){
    return <RamaBackView>
        <RamaText>{route.name}</RamaText>
    </RamaBackView>
}