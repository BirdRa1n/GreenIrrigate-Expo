import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Modalize } from 'react-native-modalize';
import { StatusBar } from 'expo-status-bar';
import { Text, Box, config, HStack, Heading, VStack, ButtonText, Button, Center, Link, LinkText } from '@gluestack-ui/themed';
import MyESPs from "../data/components/Dashboard.Screen/Gardens/MyESPs";


const Dashboard = (): JSX.Element => {
    const insets = useSafeAreaInsets();

    return (<GestureHandlerRootView style={{
        height: "100%", marginBottom: insets.top - 6, backgroundColor: "white"
    }
    }>

        <Box w={"100%"} h={"100%"} p={"$4"} >
            <HStack bottom={19} marginTop={insets.top}>
                <Heading color='green'>
                    Green
                </Heading>
                <Heading>Irrigate</Heading>
                <LottieView
                    style={{ width: "10%", bottom: 1.5 }}
                    source={require("../../assets/lottie-animations/animation_llpro7le.json")}
                    loop={true}
                    autoPlay
                    speed={2}
                />
            </HStack>

            <MyESPs />


        </Box></GestureHandlerRootView>)
}

export default Dashboard
