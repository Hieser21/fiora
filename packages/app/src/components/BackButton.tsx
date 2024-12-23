import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type Props = {
    text?: string;
};

function BackButton({ text = '' }: Props) {
    return (
        <TouchableOpacity 
            onPress={() => Actions.pop()}
            style={styles.touchable}
        >
            <BlurView intensity={20} tint="dark" style={styles.container}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <Icon
                            name="chevron-back-outline"
                            style={styles.icon}
                        />
                        <Text style={styles.text}>
                            {text}
                        </Text>
                    </View>
                </LinearGradient>
            </BlurView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchable: {
        marginHorizontal: 12,
        marginVertical: 8,
    },
    container: {
        overflow: 'hidden',
        borderRadius: 4,
        transform: [{ skewX: '-10deg' }],
    },
    gradient: {
        padding: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 8,
    },
    icon: {
        color: '#FF0000',
        fontSize: 24,
        marginRight: 8,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textShadowColor: '#FF0000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    }
});

export default BackButton;
