import React, { useCallback, useState, useEffect } from "react";
import { Box, Button, ButtonText, Center, Spinner, Text, VStack } from "@gluestack-ui/themed";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Platform, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

type QRCodeScannerProps = {
    navigation: any; // Tipo da prop "navigation" deve ser ajustado conforme necessário.
};

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ navigation }) => {
    const [destiny, setDestiny] = useState<string>("");
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (type === "org.iso.QRCode") {
            setScanned(true);
            navigation.navigate(destiny, { value: data });
        }
    };


    const route = useRoute();

    useEffect(() => {
        navigation.setOptions({
            gestureEnabled: true,
        });
    }, [navigation]);
    useFocusEffect(
        useCallback(() => {
            const params = Object(route?.params);
            setDestiny(params?.destiny);
        }, [route?.params])
    );

    if (hasPermission === null) {
        return <Box w={"100%"} h={"100%"} bg="white" sx={{ _dark: { bg: "black" } }}>
            <Center h={"100%"}>
                <Text>Ativando a câmera</Text>
                <Spinner top={10} size={"small"} color={"orange"} />
            </Center>
        </Box>;
    }
    if (!hasPermission) {
        return <Box w={"100%"} h={"100%"} bg="white" sx={{ _dark: { bg: "black" } }}>
            <Center h={"100%"}>
                <Text>O App não possui acesso a câmera</Text>
            </Center>
        </Box>;
    }
    /*
        return (<Box w={"100%"} h={"100%"} >
            <Center h="100%">
                <Button>
                    <ButtonText onPress={() => navigation.navigate(destiny, { value: "1234" })}>
                        Devolver valor
                    </ButtonText>
                </Button>
    
            </Center>
        </Box>)
        */


    return (
        <Box w={"100%"} h={"100%"} >
            <Center h={"100%"}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                >
                    <Center h={"100%"} >
                        <VStack space='sm'>

                            {Platform.OS == "ios" ? <Box w={250} h={210}>
                                <LottieView autoPlay loop style={{ width: "100%", height: "100%" }} source={require("../../assets/lottie-animations/qrcodescanner.json")} />
                            </Box> : <Box w={220} h={210} borderColor='black' borderRadius={10} borderWidth={4} />}

                            <Center>
                                <Text color='black'>Aponte para o QRCode</Text>
                            </Center>
                            <Center>

                            </Center>
                        </VStack>

                    </Center>
                </BarCodeScanner>
            </Center>

        </Box>
    );
};

export default QRCodeScanner;
