import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const SkeletonFade = () => {
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
        <Animated.View style={[styles.skeleton, { opacity }]} />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#e0e0e0',
        width: 100,
        height: 20,
        borderRadius: 4,
    },
});

export default SkeletonFade;
