import React from 'react';
import { Container, Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import fetch from '../../utils/fetch';
import platform from '../../utils/platform';
import action from '../../state/action';
import Base from './Base';
import { setStorageValue } from '../../utils/storage';
import { Friend, Group } from '../../types/redux';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF'
};

export default function Signup() {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(-50)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 20,
                friction: 7,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    async function handleSubmit(username: string, password: string) {
        const [err, res] = await fetch('register', {
            username,
            password,
            ...platform,
        });
        if (!err) {
            Toast.show({
                text: 'Created!',
                type: 'success',
                style: styles.toast
            });

            const user = res;
            action.setUser(user);

            const linkmanIds = [
                ...user.groups.map((g: Group) => g._id),
                ...user.friends.map((f: Friend) => f._id),
            ];
            const [err2, linkmans] = await fetch('getLinkmansLastMessagesV2', {
                linkmans: linkmanIds,
            });
            if (!err2) {
                action.setLinkmansLastMessages(linkmans);
            }

            Actions.chatlist();
            await setStorageValue('token', res.token);
        }
    }

    return (
        <BlurView intensity={20} tint="dark" style={styles.container}>
            <LinearGradient
                colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Animated.View style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateX: slideAnim },
                            { skewX: '-5deg' }
                        ]
                    }
                ]}>
                    <Base
                        buttonText="Register"
                        jumpText="Already have an account? Log in"
                        jumpPage="login"
                        onSubmit={handleSubmit}
                    />
                </Animated.View>
            </LinearGradient>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 12,
        borderRadius: 12,
        overflow: 'hidden'
    },
    gradient: {
        flex: 1,
        padding: 2
    },
    content: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12
    },
    toast: {
        backgroundColor: PERSONA_COLORS.primary,
        borderRadius: 8,
        shadowColor: PERSONA_COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8
    }
});
