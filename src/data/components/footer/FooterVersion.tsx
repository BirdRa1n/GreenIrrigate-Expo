import * as Application from 'expo-application';
import React, { useState, useEffect, useRef } from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import {
    Text,
    Box,
    HStack,
    Heading,
    VStack,
    Center,
    Spinner,
    Divider
} from "@gluestack-ui/themed";
import { AntDesign } from '@expo/vector-icons';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const FooterVersion = (): JSX.Element => {
    const insets = useSafeAreaInsets();
    return (<Center p={10} >
        {Platform.OS == "ios" ? <><Text top={5} size="md">{`${Application.applicationName} Beta  ${Application.nativeApplicationVersion}`}</Text>
        </> : <>
            <HStack alignContent="center" alignItems="center" top={5}>
                <Text size="md">{Application.applicationName + "Beta "}</Text>
                <AntDesign name="android1" size={12} color="black" />
                <Text size="md">{" " + Application.nativeApplicationVersion}</Text>
            </HStack>
        </>}
    </Center>)
}

export default FooterVersion
