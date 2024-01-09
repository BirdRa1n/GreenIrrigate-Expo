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

const DocsHeader = (): JSX.Element => {
    return (<>
        <HStack >
            <Heading color='black' sx={{
                "@base": {
                    fontSize: 20
                },
                "@md": {
                    fontSize: 20
                },
                "@lg": {
                },
                _dark: { color: "white" }, _light: { color: "black" }
            }}>
                Documentação
            </Heading>
            <Box sx={{
                "@base": {
                    maxWidth: 12,
                    maxHeight: 24,
                    bottom: 2
                },
                "@md": {
                    maxWidth: 15,
                    maxHeight: 30,
                    bottom: 2
                },
                "@lg": {
                },
            }}>
                <LottieView
                    source={require("../../../../../assets/lottie-animations/animation_llpro7le.json")}
                    loop={true}
                    autoPlay
                    style={{ width: "100%", height: "100%" }}
                    speed={2}
                />
            </Box>
        </HStack>
    </>)
}

export default DocsHeader 