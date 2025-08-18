import DefaultColor from "@/components/ui/DefaultColor";
import {Stack} from "expo-router";
import HeaderBack from "@/components/HeaderBack";

export default function InfoLayout() {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: DefaultColor.white },
            }}
        >
            <Stack.Screen
                name="[slug]"
                options={{
                    header: () => <HeaderBack />,
                }}
            />
        </Stack>
    );
}