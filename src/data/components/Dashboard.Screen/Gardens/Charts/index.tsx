import React, { useEffect, useState } from "react";
import {
    VictoryChart,
    VictoryLine,
} from "victory-native";
import moment from 'moment-timezone';

// Defina o fuso horário desejado, neste caso, Horário de Brasília (BRT), que é -3
const timeZone = 'America/Sao_Paulo';
import api from "../../../../utils/api";
import {
    Center,
    HStack,
    Spinner,
    Text,
    Box,
    Heading,
    Divider,
    ProgressFilledTrack,
    Progress,
    VStack,
    Badge,
    BadgeText,
    BadgeIcon,
    Button,
    ButtonIcon,
    ButtonText,
    TrashIcon,
    useColorMode
} from "@gluestack-ui/themed";
import { Alert, Platform, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { config } from '@gluestack-ui/themed';
import * as LocalAuthentication from 'expo-local-authentication';
import LottieView from "lottie-react-native";

import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
interface ESPChartsProps {
    ESP: {
        UUID: string,
        updatedAt: string,
        lastHumidy: string,
        lastAcess: string
    };
    closeModal: any;
}
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from "@react-navigation/native";


interface IoTDeviceProps {
    UUID: string,
    updatedAt: string,
    lastHumidy: string,
    lastAcess: string
    sketch: string;
    model: string;
}


export default function ESPCharts({ ESP, closeModal }: ESPChartsProps) {
    const [data, setData] = useState([]);
    const [IoTDevice, setIoTDevice] = useState<IoTDeviceProps>()
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [BtnisLoading, setBtnIsLoading] = useState<boolean>(false);

    const insets = useSafeAreaInsets();

    const lightTheme = {
        background: 'white',
        axisColor: 'black',
        // ... outras propriedades de estilo
    };

    const darkTheme = {
        background: 'black',
        axisColor: 'white',
        // ... outras propriedades de estilo
    };

    const colorMode = useColorMode();



    useEffect(() => {
        const intervalId = setInterval(() => {
            listLastHumidityLog();
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    function checkOnline(data: string): boolean {
        // Converter a string de data para um objeto Date
        const dataFornecida = new Date(data);

        // Obter a hora atual
        const horaAtual = new Date();

        horaAtual.setHours(horaAtual.getHours() - 3);


        // Calcular a diferença em milissegundos entre as duas datas
        const diferencaEmMilissegundos = Math.abs(dataFornecida.getTime() - horaAtual.getTime());

        // Definir o limite de 1 minuto em milissegundos
        const limiteDeUmMinutoEmMilissegundos = 60 * 1000;

        // Verificar se a diferença está dentro do período de 1 minuto
        if (diferencaEmMilissegundos <= limiteDeUmMinutoEmMilissegundos) {
            return true;
        } else {
            return false;
        }
    }
    function listLastHumidityLog() {
        api
            .post("/app/listLastHumidityLog", { UUID: ESP.UUID })
            .then((response) => {

                setData(response?.data.data); // Extrai o array 'data' da resposta
                getInfoDeviceIoT()
            })
            .catch((error) => {
                console.log(error);
            });
    }
    function getInfoDeviceIoT() {
        api
            .post("/app/getDeviceInfo", { UUID: ESP.UUID })
            .then((response) => {
                setIoTDevice(response?.data.result); // Extrai o array 'data' da resposta
                setIsLoading(false);

                //.log(IoTDevice)
            })
            .catch((error) => {
                console.log(error);
            });
    }
    async function unlinkDevice() {

        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) {
            return Alert.alert("Ops!", "É necessário definir uma senha para o seu aparelho")
        }

        const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();



        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autentique-se para continuar',
        });
        console.log(result)

        if (!result.success && result.error && result.error == "not_enrolled") {
            return Alert.alert("Atenção", "o seu smartphone não possui bloqueio de tela. Para remover dispositivos é necessária a autenticação local.")
        }
        if (!result.success) {
            return
        }

        setBtnIsLoading(true)
        api
            .post("/app/unlinkDevice", { UUID: ESP.UUID })
            .then((response) => {
                setBtnIsLoading(false)
                Alert.alert("Tudo certo!", "O dispositivo foi removido da sua conta.")
                closeModal()

                //.log(IoTDevice)
            })
            .catch((error) => {
                setBtnIsLoading(false)
                console.log(error);
            });
    }

    return (
        <Box p={20} >
            <>
                {isLoading ? (
                    <Center h={160}>
                        {Platform.OS == "ios" ? <>
                            <Center h={"100%"}>
                                <LottieView
                                    style={{ width: 120, bottom: 1.5 }}
                                    source={require("../../../../../../assets/lottie-animations/plantsplash.json")}
                                    loop={false}
                                    autoPlay={true}
                                    speed={Platform.OS == "ios" ? 1 : -3}
                                />
                                <Text top={10} size="md">Recebendo informações sobre a horta </Text>
                            </Center></> : <>
                            <HStack space="sm">
                                <Text>Recebendo informações sobre a horta </Text><Spinner size="small" color={"#8CC63F"} />
                            </HStack>
                        </>}

                    </Center>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Heading size="lg">{IoTDevice?.tag}</Heading>

                        {Object.keys(Object(data)).length <= 1 ? <>
                            <Text>Aguardando o dispositivo coletar dados o suficiente para gerar um gráfico.</Text>
                        </> : <>
                            <Text>O gráfico representa apenas a umidade hoje </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: "100%" }}>

                                <VictoryChart >
                                    <VictoryLine
                                        style={{
                                            data: { stroke: "#8CC63F" },
                                            parent: { border: "3px solid #ccc" },
                                        }}
                                        domain={{
                                            x: [
                                                moment().tz(timeZone).startOf('day').toDate(),
                                                moment().tz(timeZone).endOf('day').toDate(),
                                            ],
                                            y: [0, 100], // Ajuste o intervalo y conforme necessário
                                        }}
                                        data={(Object(data))?.map((item: any) => ({
                                            x: item?.date ? moment.tz(item.date, timeZone).toDate() : new Date(),
                                            y: item?.Humidity ? parseFloat(item.Humidity) : 0,
                                        }))}
                                    />
                                </VictoryChart>

                            </ScrollView></>}


                        <VStack space="lg" w={"100%"}>
                            <Heading size="sm">Humidade Atual</Heading>
                            <Progress value={Number(IoTDevice?.lastHumidy)} w={"100%"} h={8} bg="$lime100">
                                <ProgressFilledTrack h={8} bg="$lime500" />
                            </Progress>
                            {!IoTDevice?.lastHumidy ? <Text>Sensor de humidade ainda não foi usado.</Text> : <Text size="md">{IoTDevice?.lastHumidy + " %"}</Text>}
                        </VStack>
                        <VStack>
                            <Heading size="sm">Temperatura Ambiante</Heading>

                            <Heading fontSize={"$3xl"}>
                                {String(`${IoTDevice?.lastTemperature || 0}°`)}
                            </Heading>
                        </VStack>



                        <VStack space="lg" w={"100%"} marginTop={10}>
                            <Heading size="sm">Sobre o equipamento</Heading>

                            <Center>
                                <HStack space="sm" alignContent="center" alignItems="center" w={"100%"}>
                                    {!checkOnline(String(IoTDevice?.lastAcess)) ? <>
                                        <HStack>
                                            <Text size="sm">Status: </Text>
                                            <Badge size="sm" variant="solid" action="error" ml="$1">
                                                <BadgeText>Offline</BadgeText>
                                            </Badge>
                                        </HStack></> : <>
                                        <HStack>
                                            <Text size="sm">Status: </Text>
                                            <Badge size="sm" variant="solid" action="success" ml="$1">
                                                <BadgeText>ONLINE</BadgeText>
                                            </Badge>
                                        </HStack></>}
                                    <HStack>
                                        <Text size="sm">Sketch: </Text>
                                        <Badge size="sm" variant="solid" action='muted' ml="$1">
                                            <BadgeText>{String(IoTDevice?.sketch)}</BadgeText>
                                        </Badge>
                                    </HStack>
                                    <HStack>
                                        <Text size="sm">Modelo: </Text>
                                        <Badge size="sm" variant="solid" action='muted' ml="$1">
                                            <BadgeText>{String(IoTDevice?.model)}</BadgeText>
                                        </Badge>
                                    </HStack>
                                </HStack>


                            </Center>

                        </VStack>

                        <Button variant="outline" borderColor="red" marginTop={25} isDisabled={BtnisLoading} onPress={() => { unlinkDevice() }}>

                            {BtnisLoading ? <><Spinner color={"red"} /></> : <></>}
                            <ButtonIcon color="red" as={TrashIcon}></ButtonIcon>
                            <ButtonText color="red" sx={{ ":active": { color: "white" } }}>Remover dispositivo</ButtonText>
                        </Button>
                    </ScrollView>
                )}
            </>
        </Box>
    );
}
