import { useRef, useState } from "react";
import api from "../../utils/api";
import { FormControl, Heading, VStack, useToast, Toast, ToastTitle, ToastDescription, Text, Input, Link, FormControlHelper, FormControlHelperText, FormControlLabel, Box, FormControlLabelText, InputField, Center, Button, ButtonText, HStack, Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel, CheckIcon, LinkText, FormControlError, FormControlErrorIcon, AlertCircleIcon, FormControlErrorText, ButtonSpinner, LockIcon, InputSlot, Icon } from "@gluestack-ui/themed";
import * as SecureStore from "expo-secure-store";
import { Modalize } from "react-native-modalize";


interface AuthFormProps {
    navigation: any;
    openModal: any;
    closeModal: any
}

const AuthForm: React.FC<AuthFormProps> = ({ navigation, openModal, closeModal }) => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [erros, setErros] = useState("");

    const toast = useToast()

    const [typeForm, setTypeForm] = useState("singin");

    const Auth = async () => {
        if (!username || !password) {
            // Show an error message or highlight the fields
            return;
        }
        setIsloading(true);
        try {
            await api
                .post("/app/auth", {
                    username,
                    password,
                })
                .then((res) => {
                    SecureStore.setItemAsync("JSESSION", res?.data?.token);
                    console.log(res.data);

                    if (remember) {
                        SecureStore.setItemAsync("REMEMBER", "true")
                        navigation.navigate("Dashboard");
                    } else {
                        navigation.navigate("Dashboard");
                    }
                })
                .catch((error) => {
                    var httpcode = error.response.status;
                    console.log(httpcode);

                    if (httpcode == 404) {
                        setErros("username");
                    }
                    if (httpcode == 401) {
                        setErros("password");
                    }
                });
            setIsloading(false);
        } catch {
            setIsloading(false);
        }
    };

    const SingUp = async () => {
        setIsloading(true)

        if (password != confirmPassword) {
            setIsloading(false)
            return setErros("password")
        }
        /*
         if (!username || !name || !password || !confirmPassword) {
             return alert("Verifique o formulário")
         }*/

        api.post("/app/singup/", { name, username, password, email }).then((response) => {
            setIsloading(false);

            setTypeForm("singin");
            toast.show({
                placement: "top",
                render: ({ }) => {
                    return (
                        <Toast action="attention" variant="solid">
                            <VStack space="xs">
                                <ToastTitle>Muito Bem!</ToastTitle>
                                <ToastDescription>
                                    Bem vindo ao GreenIrrigate, {name}
                                </ToastDescription>
                            </VStack>
                        </Toast>
                    )
                },
            })

        }).catch((error) => {
            setIsloading(false)

            const status = error?.response?.status;
            if (status == 401) {
                setErros("username")
            }

        })
    }

    function filterNickname(value: string): void {
        // Usando uma expressão regular para remover espaços e caracteres não alfanuméricos
        setUsername(value.replace(/\s+/g, "").replace(/[^\w]/g, ""));
    }


    return (<>{typeForm == "singin" ? <>
        <VStack>
            <Heading lineHeight={30} size="xl">Bem vindo de volta!</Heading>
            <Text fontSize="$md">
                Entre para continuar
            </Text>
            <FormControl isInvalid={erros == "username" ? true : false} marginTop={15} sx={{ ":focus": { borderColor: "red" } }}>
                <FormControlLabel>
                    <FormControlLabelText>Usuário</FormControlLabelText>
                </FormControlLabel>

                <Input
                    variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}>
                    <   InputField value={username} autoCapitalize="none" autoCorrect={false} onChangeText={(e) => { setUsername(e) }} onPressIn={() => setErros("")} />
                </Input>
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        Usuário não encontrado.
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>

            <FormControl isInvalid={erros == "password" ? true : false} marginTop={5} >
                <FormControlLabel>
                    <FormControlLabelText>Senha</FormControlLabelText>
                </FormControlLabel>


                <Input variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}
                >
                    <InputField type="password" autoCapitalize="none" autoCorrect={false} onChangeText={(e) => { setPassword(e) }} onPressIn={() => setErros("")} onSubmitEditing={() => {
                        Auth(); // You can perform actions here
                        setErros("");
                    }} />
                </Input>
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        Senha Incorreta.
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>
            <FormControl>
                <HStack w={"100%"} justifyContent={"space-between"} marginTop={12} >
                    <Checkbox value="red" size="md" isInvalid={false} isDisabled={false} onChange={(e) => setRemember(e)} aria-label="Remember Me Checkbox" >
                        <CheckboxIndicator mr="$2" sx={{ ":checked": { bgColor: "#7caf38", borderColor: "#7caf38" } }}>
                            <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>Lembre se mim</CheckboxLabel>
                    </Checkbox>
                </HStack>

            </FormControl>



            <Center marginTop={45} marginBottom={15}>
                <Button w={"90%"} bg='#8CC63F' sx={{ ":active": { bg: "#7caf38" } }} onPress={Auth} isDisabled={isLoading}
                >
                    {isLoading ? <ButtonSpinner mr="$1" /> : <></>}
                    <ButtonText>Entrar</ButtonText>
                </Button>

                <HStack marginTop={15}>
                    <Text>Não possui conta? {" "}</Text>
                    <Link>
                        <LinkText onPress={() => { setTypeForm("singup") }} sx={{ _dark: { color: "white" }, _light: { color: "black" } }}>Crie agora</LinkText></Link>
                </HStack>
            </Center>
        </VStack>
    </> : <>

        <Heading lineHeight={30} size="xl">Bem vindo!</Heading>
        <Text fontSize="$md">
            Cadastre para continuar
        </Text>
        <HStack w={"100%"} space="sm">
            <FormControl w={"49%"} isInvalid={erros == "name" ? true : false} marginTop={15} sx={{ ":focus": { borderColor: "red" } }}>
                <FormControlLabel>
                    <FormControlLabelText>Nome</FormControlLabelText>
                </FormControlLabel>

                <Input
                    variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}>
                    <   InputField autoCapitalize="none" autoCorrect={false} onChangeText={(e) => { setName(e) }} onPressIn={() => setErros("")} />
                </Input>
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        Usuário não encontrado.
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>
            <FormControl w={"49%"} isInvalid={erros == "username" ? true : false} marginTop={15} sx={{ ":focus": { borderColor: "red" } }}>
                <FormControlLabel>
                    <FormControlLabelText>Usuário</FormControlLabelText>
                </FormControlLabel>

                <Input
                    variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}>
                    <    InputField value={username} autoCapitalize="none" autoCorrect={false} onChangeText={(e) => { filterNickname(e) }} onPressIn={() => setErros("")} />
                </Input>
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        O usuário já existe.
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>
        </HStack>
        <FormControl w={"100%"} isInvalid={erros == "username" ? true : false} marginTop={15} sx={{ ":focus": { borderColor: "red" } }}>
            <FormControlLabel>
                <FormControlLabelText>E-mail</FormControlLabelText>
            </FormControlLabel>

            <Input
                variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}>
                <    InputField value={email} autoCapitalize="none" autoCorrect={false} onChangeText={(e) => { setEmail(e) }} onPressIn={() => setErros("")} />
            </Input>
            <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                    O usuário já existe.
                </FormControlErrorText>
            </FormControlError>
        </FormControl>
        <HStack w={"100%"} space="sm">
            <FormControl w={"49%"} isInvalid={erros == "password" ? true : false} marginTop={15} sx={{ ":focus": { borderColor: "red" } }}>
                <FormControlLabel>
                    <FormControlLabelText>Senha</FormControlLabelText>
                </FormControlLabel>

                <Input
                    variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}>
                    <   InputField autoCapitalize="none" autoCorrect={false} onChangeText={(e) => { setPassword(e) }} onPressIn={() => setErros("")} type="password" />
                </Input>

            </FormControl>
            <FormControl w={"49%"} isInvalid={erros == "password" ? true : false} marginTop={15} sx={{ ":focus": { borderColor: "red" } }}>
                <FormControlLabel>
                    <FormControlLabelText>Confirme sua senha</FormControlLabelText>
                </FormControlLabel>

                <Input
                    variant="underlined" sx={{ ":focus": { borderColor: "#8CC63F" } }}>
                    <   InputField autoCapitalize="none" autoCorrect={false} onChangeText={(e) => { setConfirmPassword(e) }} onPressIn={() => setErros("")} type="password" />
                </Input>
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        Senhas não conferem
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>
        </HStack>

        <Center marginTop={45} marginBottom={15}>
            <Button w={"90%"} bg='#8CC63F' sx={{ ":active": { bg: "#7caf38" } }} onPress={() => {
                SingUp()
            }} isDisabled={isLoading}
            >
                {isLoading ? <ButtonSpinner mr="$1" /> : <></>}
                <ButtonText>Cadastrar</ButtonText>
            </Button>

            <HStack marginTop={15}>
                <Text>Já possui conta? {" "}</Text>
                <Link href="https://birdra1n.github.io">
                    <LinkText onPress={() => { setTypeForm("singin") }} sx={{ _dark: { color: "white" }, _light: { color: "black" } }}>Entrar</LinkText></Link>
            </HStack>
        </Center>


    </>}</>);
}
export default AuthForm