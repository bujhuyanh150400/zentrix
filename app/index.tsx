import {useEffect, useRef} from "react";
import {Animated, View, Image, Text} from "react-native";
import useAuthStore from "@/services/auth/store";
import {checkLogin} from "@/services/auth/hook";
import {APP_NAME} from "@/libs/constant_env";

export default function SplashedScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const {hydrate} = useAuthStore();

    useEffect(() => {
        // animate the fade-in and scale-up effect
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();
        const duration = setTimeout(() => {
            checkLogin(hydrate).catch()
        },2000);

        return () => {
            clearTimeout(duration);
        };
    }, [fadeAnim, hydrate, scaleAnim]);

    return (
        <View  style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Animated.View
                style={[
                    {
                        alignItems: "center"
                    },
                    {
                        opacity: fadeAnim,
                        transform: [{scale: scaleAnim}],
                    },
                ]}
            >
                <Image
                    source={require('@/assets/images/zentrix_logo.png')}
                    style={{
                        width: 100,
                        height: 100,

                    }}
                    resizeMode="contain"
                />
                <Text style={{
                        fontSize: 24,
                        fontWeight: 800,
                        marginTop: 20
                    }}
                >
                    {APP_NAME}
                </Text>
            </Animated.View>
        </View>
    )
    
}