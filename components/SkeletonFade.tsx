import React, {FC, useEffect, useRef} from 'react';
import { Animated, StyleSheet } from 'react-native';
import DefaultColor from "@/components/ui/DefaultColor";

type Props = {
    width?:number | Animated.Value | "auto" | Animated.AnimatedInterpolation<string | number> | `${number}%` | Animated.WithAnimatedObject<Animated.AnimatedNode> | null | undefined,
    height?:number | Animated.Value | "auto" | Animated.AnimatedInterpolation<string | number> | `${number}%` | Animated.WithAnimatedObject<Animated.AnimatedNode> | null | undefined,
}

const SkeletonFade:FC<Props> = (props) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.skeleton, { opacity }, {
            width: props.width ?? 100,
            height: props.height ?? 20,
        }]} />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: DefaultColor.slate[300],
        borderRadius: 4,
    },
});

export default SkeletonFade;
