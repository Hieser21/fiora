import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';
import { View } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
    children: React.ReactNode;
    disableSafeAreaView?: boolean;
};

function PageContainer({ children, disableSafeAreaView = false }: Props) {
    return (
        <ImageBackground
            source={require('../assets/images/background-cool.jpg')}
            style={styles.backgroundImage}
            blurRadius={5}
        >
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.3)']}
                style={styles.gradient}
            >
                <View style={styles.children}>
                    {disableSafeAreaView ? (
                        children
                    ) : (
                        <SafeAreaView style={styles.container}>
                            {children}
                        </SafeAreaView>
                    )}
                </View>
            </LinearGradient>
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
    gradient: {
        flex: 1,
    },
    children: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 2,
        borderColor: '#FF0000',
        margin: 8,
        borderRadius: 4,
        shadowColor: '#FF0000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default PageContainer;
