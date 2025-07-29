import {useEffect, useRef} from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999_9999,
    },
    dotContainer: {
        marginTop: 16,
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 6,
        backgroundColor: '#000',
    },
});

const Dot = ({ delay = 0 }) => {
    const bounce = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(bounce, {
                    toValue: -10,
                    duration: 300,
                    useNativeDriver: true,
                    delay,
                }),
                Animated.timing(bounce, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
    }, [bounce]);

    return (
        <Animated.View style={[styles.dot, { transform: [{ translateY: bounce }] }]} />
    );
};

const FullScreenLoading = ({loading} : {loading:boolean}) => {
    return (
        <>
            {loading &&  <View style={styles.overlay}>
                <Image
                    source={require('@/assets/images/zentrix_logo.png')}
                    style={{
                        width: 80,
                        height: 80
                    }}
                    resizeMode="contain"
                />
                <View style={styles.dotContainer}>
                    <Dot delay={0} />
                    <Dot delay={100} />
                    <Dot delay={200} />
                    <Dot delay={300} />
                </View>
            </View>
            }
        </>
    );
}

export default FullScreenLoading;