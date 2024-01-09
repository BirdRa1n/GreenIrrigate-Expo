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

const FinancialHeader = (): JSX.Element => {
    return (<>
        <HStack >
            <Heading color='black' sx={{
                "@base": {
                    fontSize: 18
                },
                "@md": {
                    fontSize: 20
                },
                "@lg": {
                    fontSize: 22
                },
                _dark: { color: "white" }, _light: { color: "black" }
            }}>
                Financeiro
            </Heading>

        </HStack>
    </>)
}

export default FinancialHeader 