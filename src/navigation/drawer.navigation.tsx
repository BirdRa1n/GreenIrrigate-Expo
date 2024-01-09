import "expo-dev-client";
import * as React from "react";
import {
    Box,
    HStack,
    Heading,

    Divider,

    Center,
    Link,
    LinkText,
    useColorMode,
} from "@gluestack-ui/themed";
import {
    DrawerItemList,
    createDrawerNavigator,
} from "@react-navigation/drawer";
import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Gardens from "../screens/Dashboard/Gardens";
import { Host } from "react-native-portalize";

import GardensHeader from "../data/components/Dashboard.Screen/Headers/GardensHeader";

//icons
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import SettingsHeader from "../data/components/Dashboard.Screen/Headers/SettingsHeader";
import Settings from "../screens/Dashboard/Settings";
import FooterVersion from "../data/components/footer/FooterVersion";

import Financial from "../screens/Dashboard/Financial";
import FinancialHeader from "../data/components/Dashboard.Screen/Headers/FinancialHeader";

const Drawer = createDrawerNavigator();

type MyDrawerProps = {
    navigation: any; // Tipo da prop "navigation" deve ser ajustado conforme necessário.
};
const MyDrawer: React.FC<MyDrawerProps> = () => {
    const colormode = useColorMode()

    const insets = useSafeAreaInsets();
    return (
        <GestureHandlerRootView style={{
            height: "100%", backgroundColor: "red"
        }
        }>
            <Host>
                <Drawer.Navigator

                    screenOptions={{

                        headerStyle: {
                            backgroundColor: colormode == "dark" ? "black" : "white", // Cor de fundo do header
                        },
                        drawerStyle: { backgroundColor: colormode == "dark" ? "#171717" : "white", },
                        headerTintColor: colormode == "dark" ? "white" : "black",  // Cor do título
                        headerTitleStyle: {
                            fontWeight: "bold", // Peso da fonte do título
                        },
                        drawerLabelStyle: {
                            color: colormode == "dark" ? "white" : "black",
                        },
                        drawerActiveBackgroundColor:
                            colormode == "dark" ? "#252526" : "#8CC63F",
                    }}

                    drawerContent={(props) => (

                        <Box justifyContent="space-between" h={"99%"}>
                            <Box marginTop={insets.top}>
                                <HStack bottom={5} p={13} justifyContent="space-between" alignItems='center'>
                                    <HStack alignItems='center'>
                                        <Heading color='green' size="xl">
                                            Green
                                        </Heading>
                                        <Heading size="xl">Irrigate</Heading>
                                        <LottieView
                                            style={{ width: "19%", bottom: 1 }}
                                            source={require("../../assets/lottie-animations/animation_llpro7le.json")}
                                            loop={true}
                                            autoPlay
                                            speed={2}
                                        />
                                    </HStack>

                                </HStack>

                                <DrawerItemList {...props} />
                                <Box p={15}>
                                    <Divider />
                                </Box>
                            </Box>
                            <Center marginBottom={insets.bottom}>
                                <FooterVersion />
                                <Link href='https://birdra1n.github.io'>
                                    <LinkText fontSize={"$sm"} sx={{ _dark: { color: "white" }, _light: { color: "black" } }}>Built by BirdRa1n</LinkText></Link>
                            </Center>

                        </ Box>
                    )}
                >
                    <Drawer.Screen name='gardens' options={{
                        headerShown: true,
                        headerTitle: () => <GardensHeader />, drawerIcon: ({ focused, size }) => (
                            <MaterialIcons
                                name="eco"
                                size={size}
                                color={colormode == "dark" ? "white" : "black"}
                            />
                        ), title: "Minhas Hortas",
                        headerTitleAlign: "center",
                        headerShadowVisible: false
                    }} component={Gardens} />
                    <Drawer.Screen name='financial' options={{
                        headerTitle: () => <FinancialHeader />, drawerIcon: ({ focused, size }) => (
                            <MaterialIcons name="attach-money" size={size} color={colormode == "dark" ? "white" : "black"} />
                        ),
                        title: "Financeiro"
                    }} component={Financial} />


                    <Drawer.Screen name='settings' options={{
                        headerTitle: () => <SettingsHeader />, drawerIcon: ({ focused, size }) => (
                            <Feather name="settings" size={size} color={colormode == "dark" ? "white" : "black"} />
                        ),
                        title: "Configurações"
                    }} component={Settings} />



                </Drawer.Navigator>
            </Host>
        </GestureHandlerRootView >
    );
};

export default MyDrawer;
