import {Stack} from 'expo-router';
import 'react-native-reanimated';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {defaultConfig} from "@tamagui/config/v4";
import * as SplashScreen from "expo-splash-screen";
import {useEffect} from "react";
import {createFont, createTamagui, TamaguiProvider} from "tamagui";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import FlashMessage from "react-native-flash-message";
import * as Notifications from 'expo-notifications';
import { useFonts } from '@expo-google-fonts/inter';
import { Inter_100Thin } from '@expo-google-fonts/inter/100Thin';
import { Inter_200ExtraLight } from '@expo-google-fonts/inter/200ExtraLight';
import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';
import { Inter_100Thin_Italic } from '@expo-google-fonts/inter/100Thin_Italic';
import { Inter_200ExtraLight_Italic } from '@expo-google-fonts/inter/200ExtraLight_Italic';
import { Inter_300Light_Italic } from '@expo-google-fonts/inter/300Light_Italic';
import { Inter_400Regular_Italic } from '@expo-google-fonts/inter/400Regular_Italic';
import { Inter_500Medium_Italic } from '@expo-google-fonts/inter/500Medium_Italic';
import { Inter_600SemiBold_Italic } from '@expo-google-fonts/inter/600SemiBold_Italic';
import { Inter_700Bold_Italic } from '@expo-google-fonts/inter/700Bold_Italic';
import { Inter_800ExtraBold_Italic } from '@expo-google-fonts/inter/800ExtraBold_Italic';
import { Inter_900Black_Italic } from '@expo-google-fonts/inter/900Black_Italic';

const useFontDefault = () => {
    return  useFonts({
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
        Inter_100Thin_Italic,
        Inter_200ExtraLight_Italic,
        Inter_300Light_Italic,
        Inter_400Regular_Italic,
        Inter_500Medium_Italic,
        Inter_600SemiBold_Italic,
        Inter_700Bold_Italic,
        Inter_800ExtraBold_Italic,
        Inter_900Black_Italic
    });
}

const systemFont = createFont({
    family: 'Inter',
    size: {
        1: 12,
        2: 14,
        3: 15,
        4: 16,
        5: 18,
        6: 20,
        7: 24,
        8: 28,
        9: 32,
    },
    lineHeight: {
        1: 18,
        2: 22,
        3: 24,
        4: 26,
        5: 28,
        6: 32,
        7: 36,
        8: 40,
        9: 44,
    },
    weight: {
        1: '100',
        2: '200',
        3: '300',
        4: '400',
        5: '500',
        6: '600',
        7: '700',
        8: '800',
        9: '900',
    },
    letterSpacing: {
        1: 0,
        2: -0.25,
        3: -0.5,
    },
    face: {
        100: { normal: 'Inter_100Thin', italic: 'Inter_100Thin_Italic' },
        200: { normal: 'Inter_200ExtraLight', italic: 'Inter_200ExtraLight_Italic' },
        300: { normal: 'Inter_300Light', italic: 'Inter_300Light_Italic' },
        400: { normal: 'Inter_400Regular', italic: 'Inter_400Regular_Italic' },
        500: { normal: 'Inter_500Medium', italic: 'Inter_500Medium_Italic' },
        600: { normal: 'Inter_600SemiBold', italic: 'Inter_600SemiBold_Italic' },
        700: { normal: 'Inter_700Bold', italic: 'Inter_700Bold_Italic' },
        800: { normal: 'Inter_800ExtraBold', italic: 'Inter_800ExtraBold_Italic' },
        900: { normal: 'Inter_900Black', italic: 'Inter_900Black_Italic' },
    },
})
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

const config = createTamagui({
    ...defaultConfig,
    fonts: {
        body: systemFont,
    },
});

export const queryClient = new QueryClient();

export default function RootLayout() {
    const [loaded, error] = useFontDefault();

    useEffect(() => {
        if ((loaded || error)) {
            SplashScreen.hideAsync().then(async () => {
                // grand permission notification
                await Notifications.requestPermissionsAsync();
            });
        }
    }, [loaded, error]);

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
