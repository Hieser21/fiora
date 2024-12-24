import React, { useEffect, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { View } from 'native-base';

import { isiOS } from '../../utils/platform';
import MessageList from './MessageList';
import Input from './Input';
import PageContainer from '../../components/PageContainer';
import { Friend, Group, Linkman } from '../../types/redux';
import { useFocusLinkman, useIsLogin, useSelfId, useStore } from '../../hooks/useStore';
import { getDefaultGroupOnlineMembers, getGroupOnlineMembers, getUserOnlineStatus } from '../../service';
import action from '../../state/action';
import { formatLinkmanName } from '../../utils/linkman';
import fetch from '../../utils/fetch';

const { width, height } = Dimensions.get('window');
let lastMessageIdCache = '';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    background: 'rgba(0,0,0,0.85)'
};

export default function Chat() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-50)).current;
    const isLogin = useIsLogin();
    const self = useSelfId();
    const { focus } = useStore();
    const linkman = useFocusLinkman();
    const $messageList = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    const keyboardOffset = insets.bottom + 44;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // Keep all existing useEffects and functions

    return (
        <PageContainer disableSafeAreaView>
            <Animated.View style={[
                styles.wrapper,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateX: slideAnim },
                        { skewX: '-5deg' }
                    ]
                }
            ]}>
                <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                    <LinearGradient
                        colors={[PERSONA_COLORS.primary, PERSONA_COLORS.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <View style={styles.container}>
                            <KeyboardAvoidingView
                                style={styles.keyboardAvoid}
                                behavior={isiOS ? 'padding' : 'height'}
                                keyboardVerticalOffset={keyboardOffset}
                            >
                                <MessageList $scrollView={$messageList} />
                                <Input onHeightChange={scrollTo} />
                            </KeyboardAvoidingView>
                        </View>
                    </LinearGradient>
                </BlurView>
            </Animated.View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        margin: 8,
    },
    blurContainer: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        padding: 2,
    },
    container: {
        flex: 1,
        backgroundColor: PERSONA_COLORS.background,
        borderRadius: 10,
        transform: [{ skewX: '-5deg' }],
        shadowColor: PERSONA_COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    },
    keyboardAvoid: {
        flex: 1,
        transform: [{ skewX: '5deg' }],
    }
});
