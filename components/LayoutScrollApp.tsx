import {ReactNode, useRef, useState} from "react";
import {
    Animated,
    View,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import {H6, ViewStyle} from "tamagui";
import {StyleProp} from "@tamagui/web";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {FocusAwareStatusBar} from "@/hooks/FocusAwareStatusBar";

export default function LayoutScrollApp({children, title, style}: {
    children: ReactNode,
    title?: string,
    style?: StyleProp<ViewStyle>
}) {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showHeader, setShowHeader] = useState<boolean>(false);
    const insets = useSafeAreaInsets();
    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                setShowHeader(offsetY > 40);
            },
        }
    );
    return (
        <View style={{flex: 1}}>
            <FocusAwareStatusBar hidden={showHeader}/>
            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{padding: 20, paddingTop: insets.top > 0 ? insets.top : 20}}
                style={style as any}
            >
                {title && <H6 paddingVertical={12} fontWeight={700}>{title}</H6>}
                {children}
            </Animated.ScrollView>
        </View>
    )
}
