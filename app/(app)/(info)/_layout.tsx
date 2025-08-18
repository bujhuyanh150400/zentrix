import { Stack } from "expo-router";
import DefaultColor from "@/components/ui/DefaultColor";
import HeaderBack from "@/components/HeaderBack";



export default function InfoLayout() {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: DefaultColor.white },
            }}
        >
            <Stack.Screen
                name="userinfo"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            {/* Xác nhận người dùng */}
            <Stack.Screen
                name="verify_user/stepOne"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="verify_user/stepTwo"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="verify_user/stepThree"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="wallet/wallet"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="protectAccount"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="wallet/withdraw"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="support/support"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="support/reply"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="support/create/stepOne"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="support/create/stepTwo"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
        </Stack>
    );
}
