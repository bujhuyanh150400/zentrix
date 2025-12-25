import FullScreenLoading from "@/components/FullScreenLoading";
import DefaultColor from "@/components/ui/DefaultColor";
import { WebSocketProvider } from "@/services/app/socketProvider";
import { useAppStore } from "@/services/app/store";
import { _AuthStatus } from "@/services/auth/@type";
import { useAuthStore } from "@/services/auth/store";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const status = useAuthStore((state) => state.status);
  const loading = useAppStore((state) => state.loading);

  useEffect(() => {
    if (status === _AuthStatus.UNAUTHORIZED) {
      router.replace("/(auth)");
    }
  }, [status]);

  return (
    <WebSocketProvider>
      <FullScreenLoading loading={loading} />
      <Stack
        initialRouteName="(tab)"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: DefaultColor.primary_bg },
        }}
      >
        <Stack.Screen name="(tab)" />
        <Stack.Screen name="(account)" />
        <Stack.Screen name="(info)" />
        <Stack.Screen name="(trade)" />
        <Stack.Screen name="(new)" />
        <Stack.Screen name="affilate" />
      </Stack>
    </WebSocketProvider>
  );
}
