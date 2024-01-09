import { Box, Center, HStack, Text } from "@gluestack-ui/themed";
import LottieView from "lottie-react-native";
import React from "react";
import * as SecureStore from 'expo-secure-store';
import api from "../../data/utils/api";

export default function Splash({ navigation }) {

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const REMEMBER = await SecureStore.getItemAsync("REMEMBER");


        if (REMEMBER) {
            api.post("/app/").then((res) => {
                navigation.navigate("Dashboard");
            }).catch((error) => {
                navigation.navigate("Auth");
            })

        } else {
            setTimeout(function () {
                navigation.navigate("Auth");
            }, 2000); // 2000 milissegundos (2 segundos)

        }
    }

    return (
        <Box w={"100%"} h={"100%"} bg="white" sx={{ _dark: { bg: "black" } }}>
            <Center h={"100%"}>
                <HStack space="sm" top={"10%"}>
                    <Center h={"50%"}>
                        <LottieView
                            style={{ width: 230, bottom: 1.5 }}
                            source={require("../../../assets/lottie-animations/plantsplash.json")}
                            loop={false}
                            autoPlay
                            speed={2}
                        />
                        <Text top={10} size="md">Carregando suas informações...</Text>
                    </Center>
                </HStack>
            </Center>
        </Box>
    );
}
