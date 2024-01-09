import "expo-dev-client";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
    useColorMode,
} from "@gluestack-ui/themed";
import Auth from "../screens/Auth";
import ProfileSettings from "../screens/Dashboard/settings/profile";
import MyDrawer from "./drawer.navigation";
import QRCodeScanner from "../screens/QRCodeScanner";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
    GluestackUIProvider,
} from "@gluestack-ui/themed";
import Splash from "../screens/Dashboard/splash";


const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    const colormode = useColorMode();
    return (

        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="splash"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colormode == "dark" ? "black" : "white", // Cor de fundo do header
                    },
                    headerTintColor: colormode == "dark" ? "white" : "black",
                    gestureEnabled: false
                }}
            >
                <Stack.Screen
                    name="Auth"
                    component={Auth}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={MyDrawer}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="qrcodescanner"
                    component={QRCodeScanner}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="splash"
                    component={Splash}
                    options={{ headerShown: false }}
                />


                <Stack.Screen
                    name="ProfileSettings"
                    component={ProfileSettings}
                    options={{ headerShown: true, title: "Perfil" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigation;
