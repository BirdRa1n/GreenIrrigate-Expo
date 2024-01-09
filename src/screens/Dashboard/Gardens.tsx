import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Modalize } from 'react-native-modalize';
import { StatusBar } from 'expo-status-bar';
import { Text, Box, config, HStack, Heading, VStack, ButtonText, Button, Center, Link, LinkText } from '@gluestack-ui/themed';

import MyESPs from "../../data/components/Dashboard.Screen/Gardens/MyESPs";

type MyESPsProps = {
    navigation: any; // Tipo da prop "navigation" deve ser ajustado conforme necessário.
};
const Gardens: React.FC<MyESPsProps> = ({ navigation }): JSX.Element => {
    const insets = useSafeAreaInsets();

    return (<Box h={"100%"} sx={{ _light: { bg: "white" }, _dark: { bg: "$black" } }} >

        <SafeAreaProvider style={{ top: 10, bottom: insets.bottom }}>
            <Box w={"100%"} h={"100%"} >
                <MyESPs navigation={navigation} />
            </Box>
        </SafeAreaProvider >
    </Box >
    )
}

export default Gardens