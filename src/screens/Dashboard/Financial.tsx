import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Modalize } from 'react-native-modalize';
import { StatusBar } from 'expo-status-bar';
import { Text, Box, config, HStack, Heading, VStack, ButtonText, Button, Center, Link, LinkText } from '@gluestack-ui/themed';
import FooterVersion from "../../data/components/footer/FooterVersion";

const Financial = (): JSX.Element => {
    return (<>
        <Box w={"100%"} h={"100%"} sx={{ _light: { bg: "white" }, _dark: { bg: "$black" } }}>


            <Center h={"95%"} p={15}>
                <Box maxWidth={200}>

                    <LottieView
                        style={{ width: "100%", bottom: 1.5 }}
                        source={require("../../../assets/lottie-animations/aav2OGZ3vd (1).json")}
                        loop={true}
                        autoPlay
                        speed={2}
                    />

                </Box>
                <Heading size="md" textAlign="center">
                    Área de pagamentos? 🤩
                </Heading>

                <Text textAlign="center" maxWidth={500} marginTop={5}>
                    Estamos sempre trabalhando para tornar sua experiência no GreenIrrigate ainda mais incrível. E enquanto estamos aprimorando as coisas, você pode usar o aplicativo normalmente.              </Text>

            </Center>


        </Box>
    </>)
}

export default Financial 