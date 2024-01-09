import { Text, Box, config, HStack, Heading, VStack, ButtonText, Button, Center, Link, LinkText, useColorMode } from '@gluestack-ui/themed';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from 'react-native-modalize';
import { StatusBar } from 'expo-status-bar';
import AuthForm from '../data/components/Auth.Screen/form';
import * as SecureStore from "expo-secure-store";
import api from '../data/utils/api';
import JustifiedTextCarousel from '../data/components/Dashboard.Screen/Gardens/JustifiedTextCarousel';
import { Platform } from 'react-native';

const texts = [
    "Controle suas plantações com o GreenIrrigate! Monitoramento e gerenciamento fáceis na palma da sua mão.",
    "GreenIrrigate: sua plantação conectada! Veja informações em tempo real e ajuste o cultivo com IoT e controladores ESP.",
    "Cultive com confiança! GreenIrrigate usa IoT e controladores ESP para monitorar e cuidar das suas plantas de forma simples."
];

const Auth = ({ navigation }): JSX.Element => {
    const [isLoading, setIsloading] = useState(true);
    const insets = useSafeAreaInsets();
    const modalRef = useRef(null);
    const colormode = useColorMode()

    const openModal = (): void => {
        if (modalRef.current) {
            modalRef.current.open();

        }
    };
    const closeModal = (): void => {
        if (modalRef.current) {
            modalRef.current.close();

        }
    };


    const renderContent = (): JSX.Element => {
        return (<>
            <Box style={{ padding: 20 }} >
                <AuthForm navigation={navigation} openModal={(openModal)} closeModal={closeModal} />
            </Box>
        </>)
    }



    return (<>
        <GestureHandlerRootView style={{
            height: "100%", marginBottom: insets.top - 6
        }
        }>
            <StatusBar />

            <Box w={"100%"} h={"100%"} p="$4"
                justifyContent='space-between'
                sx={{ _light: { bg: "white" }, _dark: { bg: "$black" } }}

            >
                <HStack bottom={19} marginTop={insets.top}>
                    <Heading color='green'>
                        Green
                    </Heading>
                    <Heading>Irrigate</Heading>

                </HStack>


                <Center>
                    <VStack w={"100%"} maxWidth={700} p={8} alignContent='center' alignItems='center'>
                        <LottieView
                            style={{ width: "100%", bottom: 1.5 }}
                            source={require("../../assets/lottie-animations/animation_llpro7le.json")}
                            loop={true}
                            autoPlay
                            speed={2}
                        />
                        <Heading marginTop={23} marginBottom={2} size="2xl" textAlign='center'>
                            {`Bem-vindo\nao\nGreenIrrigate`}
                        </Heading>
                        <Box maxHeight={200} maxWidth={645} >
                            <JustifiedTextCarousel texts={texts} />
                        </Box>
                    </VStack>
                </Center>


                <Modalize ref={modalRef} adjustToContentHeight modalStyle={{ backgroundColor: colormode == "dark" ? "black" : "white" }}>
                    {renderContent()}
                </Modalize>

                <Center >
                    <Button w={"50%"} bg='#8CC63F' sx={{ ":active": { bg: "#7caf38" } }} onPress={openModal}>
                        <ButtonText>Acessar</ButtonText>
                    </Button>
                    <HStack marginTop={5}>
                        <Text>Built by {""}</Text>
                        <Link>
                            <LinkText sx={{ _dark: { color: "white" }, _light: { color: "black" } }}>BirdRa1n</LinkText></Link>
                    </HStack>
                </Center>
            </Box >
        </GestureHandlerRootView >

    </>)

}

export default Auth