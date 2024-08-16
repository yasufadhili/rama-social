import { RamaBackView, RamaButton, RamaText } from "@/components/Themed";
import useAudio from "@/hooks/useAudio";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import * as FileSystem from "expo-file-system";


export default function CreateAudioPostScreen(){
    const { recording, levels, recordingTime, toggleRecording } = useAudio();
    const donload = async () => {
        
    }
    const play = async () => {

    }
    return (
      <RamaBackView style={{
        alignItems: "center",
        justifyContent: "center",
      }}>
        <AudioVisualiser levels={levels} width={SCREEN_WIDTH} height={50} />
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
        }}>
          <MaterialCommunityIcons
            name={recording ? "pause-circle-outline" : "microphone"}
            size={48}
            color={"#017BFE"}
            onPress={toggleRecording}
          />
          <RamaText style={{
            fontSize: 24,
            marginLeft: 20,
          }}>
            {Math.floor(recordingTime / 60)
              .toString()
              .padStart(2, "0")}
            :{(recordingTime % 60).toString().padStart(2, "0")}
          </RamaText>
        </View>
        <View style={{paddingVertical: 24}}>
            <RamaButton onPress={()=> {}} >Download</RamaButton>
        </View>
      </RamaBackView>
    )
}

import { Rect } from "react-native-svg";

interface AudioVisualiserProps {
  levels: number[];
  width: number;
  height: number;
}

const AudioVisualiser: React.FC<AudioVisualiserProps> = ({
  levels,
  width,
  height,
}) => {
  const bufferSize = 50;
  const barWidth = width / bufferSize;
  const minHeight = 4;
  const spacing = 2;

  return (
    <View style={{width: width, height:height, flexDirection: "row"}}>
      {levels.map((level, index) => {
        const barHeight = Math.max(minHeight, height * level);
        const x = (index + (bufferSize - levels.length)) * barWidth; // Adjust x position
        const y = (height - barHeight) / 2;

        return (
          <View
            style={{width:barWidth - spacing, height: barHeight, backgroundColor: "#017BFE", flexDirection: "row"}}
          />
        );
      })}
    </View>
  );
};