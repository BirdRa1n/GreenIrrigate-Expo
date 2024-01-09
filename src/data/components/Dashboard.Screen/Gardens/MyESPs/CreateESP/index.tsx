import {
    FormControl,
    Heading,
    VStack,
    Text,
    Input,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText,
    InputField,
    Center,
    Button,
    ButtonText,
    FormControlError,
    FormControlErrorIcon,
    AlertCircleIcon,
    FormControlErrorText,
    useToast,
    Toast,
    ToastTitle,
    ToastDescription,
    InputSlot,
    Box,
    useColorMode,
    LockIcon

} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCallback, useState } from "react";
import api from "../../../../../utils/api";
import { Alert } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StyleSheet } from 'react-native';
import { useFocusEffect, useRoute } from "@react-navigation/native";

enum ErrorType {
    TagNotSet = "tagnoisset",
    Error = "error",
}

interface CreateESPProps {
    closeModal: () => void;
    navigation: any;
}

const CreateESP: React.FC<CreateESPProps> = ({ closeModal, navigation }) => {
    const [errorType, setErrorType] = useState<ErrorType | null>(null);
    const [tag, setTag] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(true);
    const [scanned, setScanned] = useState(false);
    const [UUID, setUUID] = useState<string>("");
    const toast = useToast();
    const colormode = useColorMode()

    const route = useRoute();

    function addESP() {
        if (!tag) {
            setErrorType(ErrorType.TagNotSet);
            return;
        }

        api
            .post("/app/linkDevice", { tag, UUID })
            .then((response) => {
                setErrorType(null);

                toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <Toast action="success" variant="accent">
                            <VStack space="xs">
                                <ToastTitle>Muito bem!</ToastTitle>
                                <ToastDescription>{`A horta ${tag} foi adicionada com sucesso.`}</ToastDescription>
                            </VStack>
                        </Toast>
                    ),
                });
                closeModal();
            })
            .catch((error) => {
                setErrorType(ErrorType.Error);
            });
    }

    useFocusEffect(
        useCallback(() => {
            const params = Object(route?.params);
            params?.value ? setUUID(String(params.value)) : "";

        }, [route?.params])
    );
    interface handleBarCodeScannedProps {
        type: string;
        data: string;
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setUUID(data)
        setScanned(true)
        setShowModal(true)
    };

    return (
        <>
            {showModal === true ? <>
                <Heading size="lg" lineHeight={30}>
                    Adicionar um equipamento
                </Heading>
                <Text size="sm">Preencha o furmulário para continuar</Text>

                <FormControl marginTop={14} isInvalid={errorType !== null}>
                    <FormControlLabel>
                        <FormControlLabelText>Etiqueta</FormControlLabelText>
                    </FormControlLabel>
                    <Input size="xl" variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}>
                        <InputField value={tag} autoCapitalize="none" onChangeText={(e) => setTag(e)} onPressIn={() => setErrorType(null)} />
                    </Input>
                    <FormControlHelper>
                        <FormControlHelperText>A etiqueta serve para identificar uma horta. Exemplo: Tomates</FormControlHelperText>
                    </FormControlHelper>
                    {errorType === ErrorType.TagNotSet ? (
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>Adicionar uma tag é obrigatório.</FormControlErrorText>
                        </FormControlError>
                    ) : (
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>Falha ao adicionar horta.</FormControlErrorText>
                        </FormControlError>
                    )}


                </FormControl>

                <FormControl marginTop={34} isInvalid={errorType !== null}>
                    <FormControlLabel>
                        <FormControlLabelText>UUID do dispositivo</FormControlLabelText>
                    </FormControlLabel>
                    <Input size="xl" variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}>
                        <InputField value={UUID} autoCapitalize="none" onChangeText={(e) => setUUID(e)} onPressIn={() => setErrorType(null)} />
                        <InputSlot pr="$3" onPress={() => { navigation.navigate("qrcodescanner", { destiny: route.name }) }}>
                            <Heading>
                                <MaterialCommunityIcons name="qrcode-scan" size={24} />
                            </Heading>
                        </InputSlot>
                    </Input>
                    <FormControlHelper>
                        <FormControlHelperText>Insira o UUID do dispositivo, ou aponte o qr code precionando o ícone ao lado.</FormControlHelperText>
                    </FormControlHelper>
                    {errorType === ErrorType.TagNotSet ? (
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>Inserir o código do produto é obrigatório.</FormControlErrorText>
                        </FormControlError>
                    ) : (
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>Falha ao adicionar horta.</FormControlErrorText>
                        </FormControlError>
                    )}


                </FormControl>
                <Button marginTop={29} marginBottom={15} onPress={addESP} bg="#8CC63F" sx={{ ":active": { bg: "#7caf38" } }}>
                    <ButtonText>Adicionar</ButtonText>
                </Button>
            </> : <>
                <Box w={"100%"} h={340} bg="black" borderRadius={10}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={styles.barCodeScanner}
                    />


                </Box>
            </>}
        </>
    );
};

const styles = StyleSheet.create({
    barCodeScanner: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 2, // Define a largura da borda
        borderColor: '#8CC63F', // Define a cor da borda
        borderRadius: 10, // Define o raio da borda para torná-la arredondada
    },
});

export default CreateESP;
