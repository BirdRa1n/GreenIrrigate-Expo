import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import axios from "axios";
import { useColorMode, Divider } from '@gluestack-ui/themed';
import {
    ActionsheetItem,
    ActionsheetItemText,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Heading,
    Input,
    InputField,
    Text,
    Center,
    Box,
    Spinner,
    HStack,
    VStack,
    useToast,
    Toast,
    ToastTitle,
    ToastDescription,
    InputSlot,
    LockIcon,
    Icon
} from "@gluestack-ui/themed";

interface Network {
    ssid: string;
}

interface NetworkItemProps {
    network: Network;
    colormode: string;
    onSelect: (ssid: string) => void;
}

const NetworkItem: React.FC<NetworkItemProps> = ({ network, onSelect, colormode }) => (
    <ActionsheetItem onPress={() => onSelect(network.ssid)} sx={{ _dark: { bg: "$borderDark950" }, _light: { bg: "#F9F9F9" } }}>
        <HStack w={"100%"} justifyContent='space-between'>
            <ActionsheetItemText color={colormode === "dark" ? "white" : "#18181b"}>{network.ssid}</ActionsheetItemText>
            <FontAwesome5 name="wifi" size={25} color={colormode === "dark" ? "white" : "#18181b"} />
        </HStack>
    </ActionsheetItem>
);

interface ConfigESPProps {
    closeModal: () => void;
}

const ConfigESP: React.FC<ConfigESPProps> = ({ closeModal }) => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showSSIDs, setShowSSIDs] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showBtn, setShowBtn] = useState<boolean>(false);
    const [BtnLoading, setBtnLoading] = useState<boolean>(false);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [ssid, setSSID] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const colormode = useColorMode()

    useEffect(() => {
        if (showSSIDs) {
            const intervalId = setInterval(() => {
                fetchDataForAndroidOrWeb();
            }, 2000);

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [showSSIDs]);

    // const handleClose = () => setShowForm(!showForm);

    const fetchDataForAndroidOrWeb = async () => {
        setBtnLoading(true);
        try {
            const response = await axios.get("http://192.168.4.1/networks");
            const result = response.data;
            setIsLoading(false); setBtnLoading(false);
            setNetworks(result.networks);
        } catch (error) {
            setBtnLoading(false);
            console.error(error);
        }
    };

    const testConnection = async () => {
        setBtnLoading(true);
        try {
            await axios.get("http://192.168.4.1", { timeout: 4000 });
            setShowBtn(true);
            setBtnLoading(false);
            setShowSSIDs(true); setIsLoading(true);
        } catch (error) {
            showToast("Ops!", "A conexão com o dispositivo falhou. Tente novamente.", "error");
            setBtnLoading(false);
            //Alert.alert("Error", String(error));
        }
    };

    const setConnection = async (selectedSSID: string, selectedPassword: string) => {
        setBtnLoading(true);
        try {
            await axios.get("http://192.168.4.1/setting", {
                params: {
                    ssid: selectedSSID,
                    pass: selectedPassword,
                },
            });
            closeModal();
            setBtnLoading(false);
            showToast("Sucesso!", `A rede ${selectedSSID} foi definida.`, "attention")
        } catch (error) {
            setBtnLoading(false);
            showToast("Ops!", "Ocorreu uma falha ao definir a rede WI-FI", "error");
        }
    };
    const toast = useToast();

    const showToast = async (title: string, description: string, type: string) => {
        toast.show({
            placement: "top",
            duration: 1500,
            render: ({ id }) => {
                return (
                    <Toast sx={{ _android: { top: 25 } }} action={type || "info"} variant={"accent"}>
                        <VStack space="xs">
                            <ToastTitle>{title}</ToastTitle>
                            <ToastDescription>
                                {description}
                            </ToastDescription>
                        </VStack>
                    </Toast>
                )
            },
        })
    }

    return (
        <Box p={20} marginBottom={10}>
            <Heading>{"Configure a rede WI-FI"}</Heading>
            {!showForm && !showSSIDs ? (
                <VStack space="2xl" marginTop={5}>
                    <Box>
                        <Text size="lg" marginBottom={5} bold>
                            Para entrar no modo de configuração, siga os seguintes passos:
                        </Text>
                        <Text>Passo 1: Desconecte o dispositivo da alimentação.</Text>
                        <Text>Passo 2: Reconecte o dispositivo à alimentação e, rapidamente, pressione o botão de reset.</Text>
                        <Text>Passo 3: Mantenha o botão de reset pressionado por 5 segundos e conecte o seu smartphone à rede Wi-Fi "GreenIrrigate".</Text>
                    </Box>

                    <>
                        {showBtn ? (
                            <Button isDisabled={BtnLoading} margin={10} onPress={() => { setShowSSIDs(true); setIsLoading(true); }} bg="#8CC63F" sx={{ ":active": { bg: "#7caf38" } }}>
                                <HStack space="sm">
                                    {BtnLoading ? <Spinner color={"white"} /> : <></>}
                                    <ButtonText>Procurar Redes</ButtonText>
                                </HStack>
                            </Button>
                        ) : (
                            <Button isDisabled={BtnLoading} margin={10} onPress={() => { testConnection(); }} bg="#8CC63F" sx={{ ":active": { bg: "#7caf38" } }}>
                                <HStack space="sm">
                                    {BtnLoading ? <Spinner color={"white"} /> : <></>}
                                    <ButtonText>Testar Conexão</ButtonText>
                                </HStack>
                            </Button>
                        )}
                    </>
                </VStack>
            ) : null}

            {showSSIDs && isLoading ? (
                <Center p={10}>
                    <HStack space="sm">
                        <Text>Carregando redes WI-FI disponíveis</Text>
                        <Spinner color={"#8CC63F"} />
                    </HStack>
                </Center>
            ) : null}

            {showSSIDs && !isLoading ? (
                <VStack space="sm">
                    {networks?.map((network, key) => (
                        <VStack key={key}>
                            <NetworkItem
                                network={network}
                                colormode={colormode}
                                onSelect={(selectedSSID) => {
                                    setSSID(selectedSSID);
                                    setShowSSIDs(false);
                                    setShowForm(true);
                                }}
                            />
                        </VStack>

                    ))}
                </VStack>
            ) : null}

            {showForm ? (
                <>
                    <Heading marginBottom={15} size="sm">{"WI-FI Selecionado: " + ssid}</Heading>

                    <FormControl>
                        <FormControlLabel>
                            <FormControlLabelText>Senha</FormControlLabelText>
                        </FormControlLabel>
                        <Input variant="underlined" size="xl" >
                            <InputField
                                placeholder=""
                                type="password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={password}
                                onChangeText={(e) => setPassword(e)}
                            />
                            <InputSlot pr="$3" onPress={() => { alert(true) }}>
                                <Icon as={LockIcon} />
                            </InputSlot>
                        </Input>

                        <Button
                            marginTop={25}
                            bg="#8CC63F"
                            isDisabled={BtnLoading}
                            sx={{ ":active": { bg: "#7caf38" } }}
                            onPress={() => { setConnection(ssid, password) }}
                        >
                            <HStack space="sm">
                                {BtnLoading ? <Spinner color={"white"} /> : <></>}
                                <ButtonText>Conectar</ButtonText>
                            </HStack>
                        </Button>
                    </FormControl>
                </>
            ) : null}
        </Box>
    );
};

export default ConfigESP;