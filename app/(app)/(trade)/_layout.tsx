import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/DefaultColor";
import HeaderBack from "@/components/HeaderBack";
import {HeaderEditFavoriteScreen} from "@/app/(app)/(trade)/editFavorite";

export default function TradeLayout () {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: DefaultColor.white },
            }}
        >
            <Stack.Screen name="trading" options={{
                headerShown: false,
            }} />
            <Stack.Screen name="transaction" options={{
                header: () => <HeaderBack />,
            }} />
            <Stack.Screen name="search" options={{
                header: () => <HeaderBack />,
            }} />
            <Stack.Screen name="editFavorite" options={{
                header: () => <HeaderEditFavoriteScreen routerBack={"/(app)/(tab)/trade"} />,
            }} />
            <Stack.Screen name="addFavorite" options={{
                header: () => <HeaderBack routerBack={"/(app)/(trade)/editFavorite"} />,
            }} />
        </Stack>
    )
}