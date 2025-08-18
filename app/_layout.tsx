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
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const config = createTamagui(defaultConfig);

export const queryClient = new QueryClient();

export default function RootLayout() {

    useEffect(() => {
        SplashScreen.hideAsync().then(async () => {
            // grand permission notification
            await Notifications.requestPermissionsAsync();
        });
    }, []);

    // grand permission notification
    useEffect(() => {

    }, []);


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
