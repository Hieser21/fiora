import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Message } from '../../types/redux';
import { getPerRandomColor } from '../../utils/getRandomColor';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: '#FFFFFF'
};

type Props = {
    message: Message;
};

function SystemMessage({ message }: Props) {
    const { content, from } = message;
    
    return (
        <BlurView intensity={15} tint="dark" style={styles.container}>
            <LinearGradient
                colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.contentContainer}>
                    <Text
                        style={[
                            styles.username,
                            { color: getPerRandomColor(from.originUsername as string) },
                        ]}
                    >
                        {from.originUsername}
                    </Text>
                    <Text style={styles.content}>
                        {content}
                    </Text>
                </View>
            </LinearGradient>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden'
    },
    gradient: {
        width: '100%',
        padding: 12,
        borderRadius: 12
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    content: {
        fontSize: 14,
        color: PERSONA_COLORS.text,
        marginLeft: 8,
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    }
});

export default SystemMessage;
