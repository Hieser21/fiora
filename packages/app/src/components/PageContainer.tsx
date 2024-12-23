import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Animated } from 'react-native';
import { View } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type Props = {
    children: React.ReactNode;
    disableSafeAreaView?: boolean;
};

function PageContainer({ children, disableSafeAreaView = false }: Props) {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <ImageBackground
            source={require('../assets/images/background-cool.jpg')}
            style={styles.backgroundImage}
            blurRadius={5}
        >
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <BlurView intensity={15} tint="dark" style={styles.blurContainer}>
                    <LinearGradient
                        colors={['#FF0000', '#8B0000', '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <View style={styles.children}>
                            {disableSafeAreaView ? (
                                children
                            ) : (
                                <SafeAreaView style={styles.safeArea}>
                                    {children}
                                </SafeAreaView>
                            )}
                        </View>
                    </LinearGradient>
                </BlurView>
            </Animated.View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    blurContainer: {
        flex: 1,
        margin: 8,
    },
    gradient: {
        flex: 1,
        padding: 2,
        borderRadius: 12,
    },
    children: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderRadius: 10,
        transform: [{ skewX: '-5deg' }],
        shadowColor: '#FF0000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    },
    safeArea: {
        flex: 1,
        transform: [{ skewX: '5deg' }],
    },
});

export default PageContainer;
