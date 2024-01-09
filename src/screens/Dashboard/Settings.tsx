import React from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {
    Box,
    Center,
    Divider,
    Heading,
    HStack,
    Icon,
    Text,
    useColorMode
} from '@gluestack-ui/themed';
import { func } from 'prop-types';

// Interfaces
interface Option {
    icon: JSX.Element;
    text: string;
    route: string;
}
interface OptionProps {
    icon: JSX.Element;
    text: string;
    route: string;
    navigation: any;
}

interface SettingsProps {
    navigation: any; // Substitua 'any' pelo tipo apropriado para a navegação, se possível.
}

const settingsOptions: Option[] = [
    {
        icon: <AntDesign name="user" size={24} />,
        text: 'Perfil',
        route: "ProfileSettings",
    },
    {
        icon: <Ionicons name="notifications-outline" size={24} />,
        text: 'Notificações',
        route: "",
    },
    {
        icon: <Ionicons name="lock-closed-outline" size={24} />,
        text: 'Segurança e privacidade',
        route: "",
    },
    {
        icon: <Ionicons name="eye-outline" size={24} />,
        text: 'Aparência',
        route: "",
    },
    {
        icon: <SimpleLineIcons name="support" size={24} />,
        text: 'Ajuda e suporte',
        route: "",
    },
];



const Settings = ({ navigation }: SettingsProps): JSX.Element => {
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('REMEMBER');
        navigation.navigate('Auth');
    };

    const colormode = useColorMode();

    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 20 }}>
                    <HStack alignContent="center" alignItems="center" space="sm">
                        <Ionicons name="ios-exit" size={22} color={colormode == "dark" ? "white" : "black"} />
                    </HStack>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);



    return (
        <Box w="100%" h="100%" sx={{ _light: { bg: "white" }, _dark: { bg: "$black" } }} p={10}>
            <ScrollView>
                <Box p={8}>
                    {settingsOptions.map((option, index) => (
                        <OptionItem key={index} route={option.route} navigation={navigation} icon={option.icon} text={option.text} />
                    ))}

                </Box>
            </ScrollView>
        </Box>
    );
};

const OptionItem = ({ icon, text, route, navigation }: OptionProps): JSX.Element => {
    return (
        <TouchableOpacity
            onPress={() => {
                route === "" ? Alert.alert('Ops!', 'Essa versão não pode acessar essas opções') : navigation.navigate(route);
            }}
        >
            <HStack w="100%" h={66} alignContent="center" alignItems="center">
                <HStack w="100%" h="100%" alignContent="center" p={10} justifyContent="space-between">
                    <Center>
                        <HStack alignContent="center" alignItems='center' space="md">
                            <Heading>{icon}</Heading>
                            <Text>{text}</Text>
                        </HStack>
                    </Center>
                    <Center>
                        <Heading>
                            <Ionicons name="ios-chevron-forward" size={24} />
                        </Heading>
                    </Center>
                </HStack>
            </HStack>
            <Divider />
        </TouchableOpacity>
    );
};

export default Settings;
