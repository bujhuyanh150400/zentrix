import {Stack} from "expo-router";
import HeaderBack from "@/components/HeaderBack";

export default function AccountLayout() {

    return (
        <Stack>
            {/* Nạp tiền */}
            <Stack.Screen
                name="recharge"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="withdraw"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="detail"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
            <Stack.Screen
                name="list"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="history"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>

    );
}