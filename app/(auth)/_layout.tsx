import {useAuthStore} from "@/services/auth/store";
import {useEffect} from "react";
import {_AuthStatus} from "@/services/auth/@type";
import {router, Stack} from "expo-router";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {FocusAwareStatusBar} from "@/hooks/FocusAwareStatusBar";
import {View} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";


export default function AuthLayout() {
    const status = useAuthStore(s => s.status);

    useEffect(() => {
        if (status === _AuthStatus.AUTHORIZED) {
            router.replace('/(app)/(tab)');
        }
    }, [status]);

    return (
        <SafeAreaProvider>
            <FocusAwareStatusBar hidden/>
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen
                    name="login/index"
                    options={{
                        title: 'Đăng nhập',
                        headerTintColor: DefaultColor.black,
                        headerBackButtonDisplayMode: "minimal",
                        headerBackground: () => <View style={{backgroundColor: "transparent"}}></View>,
                    }}/>
                <Stack.Screen name="login/pin" options={{headerShown: false}}/>
                <Stack.Screen name="login/verify" options={{headerShown: false}}/>

                <Stack.Screen
                    name="register/index"
                    options={{
                        title: 'Đăng ký',
                        headerTintColor: DefaultColor.black,
                        headerBackButtonDisplayMode: "minimal",
                        headerBackground: () => <View style={{backgroundColor: "transparent"}}></View>,
                    }}/>
                <Stack.Screen name="register/success" options={{headerShown: false}}/>

                <Stack.Screen
                    name="forgot_pass/index"
                    options={{
                        title: 'Quên mật khẩu',
                        headerTintColor: DefaultColor.black,
                        headerBackButtonDisplayMode: "minimal",
                        headerBackground: () => <View style={{backgroundColor: "transparent"}}></View>,
                    }}
                />
                <Stack.Screen name="forgot_pass/verify" options={{headerShown: false}}/>

                <Stack.Screen name="reset_pass/index" options={{headerShown: false}}/>
                <Stack.Screen name="reset_pass/success" options={{headerShown: false}}/>

            </Stack>

        </SafeAreaProvider>
    )
}