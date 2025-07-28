import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import 'react-native-reanimated';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {defaultConfig} from "@tamagui/config/v4";
import * as SplashScreen from "expo-splash-screen";
import {useEffect} from "react";
import {createTamagui, TamaguiProvider} from "tamagui";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import FlashMessage from "react-native-flash-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options.
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});
const config = createTamagui(defaultConfig);

export const queryClient = new QueryClient();

export default function RootLayout() {

    const [loaded, error] = useFonts({
        SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <GestureHandlerRootView
            style={{
                flex: 1,
            }}
        >
            <QueryClientProvider client={queryClient}>
                <TamaguiProvider config={config}>
                    <BottomSheetModalProvider>
                        <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            <Stack.Screen name="(app)" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found"/>
                        </Stack>
                        <FlashMessage position="top" />
                    </BottomSheetModalProvider>
                </TamaguiProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
