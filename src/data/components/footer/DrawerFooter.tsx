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

const DrawerFooter = (): JSX.Element => {
    const insets = useSafeAreaInsets();
    return (<Box p={10} >
        <Divider />
        {Platform.OS == "ios" ? <VStack ><Heading top={5} fontSize={"$sm"}>{`${Application.applicationName + " Beta"} ${Application.nativeApplicationVersion}`}</Heading>

            <HStack>
                <Heading fontSize={"$sm"}>Sistema: </Heading>
                <Heading fontSize={"$sm"}> {`${Platform.OS.toUpperCase()} `}</Heading>
            </HStack>

        </VStack> : <>
            <HStack alignContent="center" alignItems="center" top={5}>
                <Text fontSize={"$sm"}>{Application.applicationName + " "}</Text>
                <AntDesign name="android1" size={11} color="black" />
                <Text size="sm">{" " + Application.nativeApplicationVersion}</Text>
            </HStack>
        </>}
    </Box>)
}

export default DrawerFooter
