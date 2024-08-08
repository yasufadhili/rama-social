import { Redirect, router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function IndexLayout(){
    const [userExists, setUserExists] = useState<boolean>(false);
    const user = auth().currentUser;

    useEffect(() => {
        if (user) {
          const checkUserExists = async () => {
            const userDoc = await firestore().collection('users').doc(user.uid).get();
            if (!userDoc.exists) {
                router.navigate("../setup-profile")
              }
          };
          checkUserExists();
        }
      }, [user]);
      
      if (!userExists) {
        return <Redirect href={"/setup-profile"} />
      }
    return <Stack initialRouteName={"index"}>
        <Stack.Screen
            name={"index"}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name={"[id]"}
        />
        <Stack.Screen
            name={"setup-profile"}
        />
    </Stack>
}