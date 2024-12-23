import React from 'react';
import { View, Text, Dimensions, StyleSheet, Animated, Easing } from 'react-native';
import { Spinner } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useStore } from '../hooks/useStore';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

export default function Loading() {
    const { loading } = useStore().ui;
    const spinValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    if (!loading) {
        return null;
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.loadingView}>
            <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loadingBox}
                >
                    <Animated.View style={[styles.spinnerContainer, { transform: [{ rotate: spin }] }]}>
                        <Spinner color="#FF0000" size="lg" />
                    </Animated.View>
                    <Text style={styles.loadingText}>{loading}</Text>
                </LinearGradient>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingView: {
        width: ScreenWidth,
        height: ScreenHeight,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    blurContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        transform: [{ skewX: '-10deg' }],
    },
    loadingBox: {
        width: 160,
        height: 160,
        padding: 2,
        backgroundColor: 'rgba(0,0,0,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textShadowColor: '#FF0000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});
