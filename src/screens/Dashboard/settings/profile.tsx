import {
    Box,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    Icon,
    ChevronDownIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectItem,
    VStack,
    Button,
    ButtonText,
    Center,
    Spinner,
    Text,
    Heading,
    HStack

} from "@gluestack-ui/themed";
import { View, SafeAreaView, ScrollView, StyleSheet, Alert } from "react-native";

import { useEffect, useState } from "react";
import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import api from "../../../data/utils/api";

interface ProfileProps {
    navigation: any; // Substitua 'any' pelo tipo apropriado para a navegação, se possível.
}
const ProfileSettings = ({ navigation }: ProfileProps): JSX.Element => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const insets = useSafeAreaInsets();

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        api.post("/app/").then((res) => {
            setData(res.data?.user)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
        })
    }



    return (<>
        <Box w={"100%"} h={"100%"} bg="white" sx={{ _dark: { bg: "black" } }} p={15} justifyContent='space-between'>

            {loading ? <>
                <Center h={"90%"}>
                    <VStack space="sm">
                        <Spinner size={"small"} color={"#8CC63F"} />
                        <Text fontSize={"$sm"}>Carregando suas informações</Text>
                    </VStack>
                </Center>
            </> : <>
                <VStack space="lg">
                    <FormControl >
                        <FormControlLabel>
                            <FormControlLabelText>
                                Nome
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input sx={{ ":focus": { borderColor: "#8CC63F" } }} variant="underlined" >
                            <InputField type='text' value={data?.name} onChangeText={(e) => { console.log(e) }} />
                        </Input>
                    </FormControl>

                    <FormControl>
                        <FormControlLabel>
                            <FormControlLabelText>
                                Alterar Plano
                            </FormControlLabelText>
                        </FormControlLabel>


                        <Select>

                            <SelectTrigger variant="underlined" size="md" >
                                <SelectInput placeholder="Selecione o plano" />
                                <SelectIcon mr="$3">
                                    <Icon as={ChevronDownIcon} />
                                </SelectIcon>
                            </SelectTrigger>

                            <SelectPortal >
                                <SelectBackdrop />
                                <SelectContent >

                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />

                                    </SelectDragIndicatorWrapper>

                                    <SelectItem label="FREE" value="ux" />
                                    <SelectItem label="PREMIUM" value="web" />

                                </SelectContent>
                            </SelectPortal>

                        </Select>

                    </FormControl>
                </VStack>
                <Button bg='#8CC63F' sx={{ ":active": { bg: "#7caf38" } }} onPress={() => { Alert.alert("Ops!", `${data?.name}, você não tem permissão para realizar essa ação`) }}>
                    <ButtonText>Salvar</ButtonText>
                </Button></>}

        </Box>
    </>)
}


export default ProfileSettings;