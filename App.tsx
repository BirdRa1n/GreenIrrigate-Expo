import { GluestackUIProvider } from "@gluestack-ui/themed";
import StackNavigation from "./src/navigation/stack.navigation";
import React from "react";
import { useColorScheme } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);
  const [hasPermission, setHasPermission] = React.useState<any>(null);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getBarCodeScannerPermissions();
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  return (
    <GluestackUIProvider colorMode={isDarkMode ? "dark" : "light"}>
      <StackNavigation />
    </GluestackUIProvider>
  );
}
