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
    Menu,
    MenuItem,
    MenuItemLabel,
    Icon,
    Button,
    ButtonText,
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicatorWrapper,
    ActionsheetDragIndicator,
    ActionsheetItem,
    ActionsheetItemText,
    useColorMode,
    ExternalLinkIcon,
    MenuIcon
} from "@gluestack-ui/themed";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import TimeRangePicker from "../TimeRangePicker";
import CreateESP from "./CreateESP";
import { Modalize } from "react-native-modalize";
import * as Application from 'expo-application';

import ESPCharts from "../Charts";
import api from "../../../../utils/api";
import FooterVersion from "../../../footer/FooterVersion";
import { SimpleLineIcons } from '@expo/vector-icons';
import JustifiedTextCarousel from '../JustifiedTextCarousel/index';
import { FontAwesome5 } from '@expo/vector-icons';
import ConfigESP from "./ConfigESP";

import { Entypo } from '@expo/vector-icons';
import GardensHeader from "../../Headers/GardensHeader";

import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Portal } from "react-native-portalize";
import { ThemeProvider } from "@react-navigation/native";
import AnimationsPlants from "../animationsPlants";


type ESP = {
    UUID: string;
    tag: string;
};

type MyESPsProps = {
    navigation: any; // Tipo da prop "navigation" deve ser ajustado conforme necessário.
};

interface IoTDevice {
    UUID: string | "",
    updatedAt: string,
    lastHumidy: string,
    lastAcess: string,
    tag: string
}

const MyESPs: React.FC<MyESPsProps> = ({ navigation }) => {
    const [esps, setESPs] = useState<ESP[]>([]);
    const [ESPUUID, setESPUUID] = useState<string>("");
    const [ESP, setESP] = useState<IoTDevice>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [typeModal, setTypeModal] = useState<string>("");
    const modalRef = useRef<Modalize | null>(null);
    const animationRef = useRef<LottieView | null>(null);

    const [showActionsheet, setShowActionsheet] = React.useState(false)
    const handleClose = () => setShowActionsheet(!showActionsheet)
    const colormode = useColorMode();
    const insets = useSafeAreaInsets();




    useEffect(() => {
        animationRef.current?.play();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            listMyESPs();
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    function listMyESPs() {
        api
            .post("/app/ListMyIoTDevices")
            .then((response) => {
                setIsLoading(false);
                setESPs(response.data?.result || []);
            })
            .catch((error) => {
                console.log(error)
                // Lide com o erro aqui, se necessário.
            });
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Heading marginRight={15}>
                    <Ionicons
                        name="ios-add"
                        size={30}
                        onPress={() => openModal("createesp", "")}
                    />
                </Heading>
            ),
        });
    }, [navigation]);

    const renderContent = (): JSX.Element | null => {
        if (typeModal === "createesp") {
            return <Box p={15} marginBottom={insets.bottom}>
                <CreateESP navigation={navigation} closeModal={closeModal} />
            </Box>;
        } else if (typeModal === "settimerange") {
            return (
                <Box p={20} marginBottom={insets.bottom}>

                    <TimeRangePicker UUID={ESPUUID} closeModal={closeModal} />
                </Box>
            );
        } else if (typeModal === "charts") {
            return (
                <Box marginBottom={insets.bottom}>
                    <ESPCharts ESP={Object(ESP)} closeModal={closeModal} />
                </Box>
            );
        } else if (typeModal == "menu") {
            return (<><Box p={20} marginBottom={insets.bottom}>
                <Heading size="lg" marginBottom={5}>Selecione oque deseja fazer</Heading>
                <VStack space="sm">
                    <ActionsheetItem onPress={() => { handleClose(); openModal("settimerange", String(ESP?.UUID)) }} sx={{ _dark: { bg: "$borderDark950" }, _light: { bg: "#F9F9F9" } }}>
                        <HStack space={"lg"}>
                            <MaterialCommunityIcons
                                name="calendar-clock"
                                size={25}
                                color={colormode == "dark" ? "white" : "#18181b"}
                            />
                            <Text>Agendar Irrigação</Text>
                        </HStack>
                    </ActionsheetItem>
                    <ActionsheetItem onPress={() => { handleClose(); openModal("configwifi", String(ESP?.UUID)) }} sx={{ _dark: { bg: "$borderDark950" }, _light: { bg: "#F9F9F9" } }}>
                        <HStack space={"lg"} marginLeft={2.5}>
                            <FontAwesome5 name="wifi" size={19} color={colormode == "dark" ? "white" : "#18181b"} />
                            <Text>Configurar rede WI-FI</Text>
                        </HStack>
                    </ActionsheetItem>
                </VStack>
            </Box></>)
        }
        else if (typeModal === "configwifi") {
            return (
                <Box marginBottom={insets.bottom}>
                    <ConfigESP closeModal={closeModal} />
                </Box>
            );
        }
        return null;
    };

    const openModal = (modalType: string, espUUID: string): void => {
        setTypeModal(modalType);
        setESPUUID(espUUID);
        if (modalRef.current) {
            modalRef.current.open();
        }
    };

    const closeModal = (): void => {
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    return (
        <Box h={"100%"}>

            <Portal>
                <Modalize ref={modalRef} adjustToContentHeight modalStyle={{ backgroundColor: colormode == "dark" ? "#111111" : "white" }}>
                    {renderContent()}
                </Modalize>
            </Portal>

            {isLoading ? (
                <Center h={"100%"}>
                    <HStack space="sm">
                        <Center h={"50%"}>
                            <LottieView
                                style={{ width: 230, bottom: 1.5 }}
                                source={require("../../../../../../assets/lottie-animations/plantsplash.json")}
                                loop={false}
                                autoPlay
                                speed={2}
                            />
                            <Text top={10} size="md">Carregando suas informações...</Text>
                        </Center>
                    </HStack>
                </Center>
            ) : (
                <VStack h={"100%"} justifyContent="space-between">
                    {esps.length <= 0 ? <>
                        <Box h={"100%"}>
                            <Center h={"70%"}>
                                <Text textAlign="center">Clique no botão acima para começar a adicionar equipamentos</Text>
                            </Center>
                        </Box>
                    </> : <>

                        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 15 }}>
                            <VStack space="md">
                                {Object(esps)?.map((esp: IoTDevice, key: number) => (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() => {
                                            openModal("charts", esp?.UUID);
                                            setESP(esp)
                                        }}
                                    >
                                        <Box
                                            w={"100%"}
                                            h={130}

                                            borderRadius={5}
                                            p={"$2"}
                                            sx={{
                                                borderBottomWidth: 4, // Largura da borda inferior (em unidades, como pixels)
                                                borderBottomColor: '#8CC63F',
                                                _dark: {
                                                    bg: "black",

                                                },
                                                _light: {
                                                    bg: "#F9F9F9",

                                                }
                                            }}
                                        >
                                            <HStack justifyContent={"space-between"}>
                                                <VStack>
                                                    <Heading size={"md"}>{esp?.tag}</Heading>
                                                    <Box
                                                        sx={{
                                                            "@base": {
                                                                maxWidth: 120,
                                                                maxHeight: 100,
                                                                bottom: 0,
                                                            },
                                                            "@md": {},
                                                            "@lg": {},
                                                        }}
                                                    >
                                                        <AnimationsPlants name={esp?.tag.toLocaleUpperCase()} />
                                                    </Box>
                                                </VStack>
                                                <VStack space="xl" top={1} right={5}>


                                                    <Button variant="link" bottom={8} onPress={() => { openModal("menu", ESPUUID); setESP(esp) }}>
                                                        <Icon as={MenuIcon} m="$0" w="$5" h="$4" />
                                                    </Button>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    </TouchableOpacity>
                                ))}
                            </VStack>
                        </ScrollView>
                    </>}

                </VStack>
            )}

        </Box>
    );
};

export default MyESPs;
