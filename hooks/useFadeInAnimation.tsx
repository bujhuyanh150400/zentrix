import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const useFadeInAnimation = (duration: number = 1000) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
        }).start();
    }, [duration]);

    return fadeAnim;
};

export default useFadeInAnimation;
