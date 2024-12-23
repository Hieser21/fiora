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

export default function Chat() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const isLogin = useIsLogin();
    const self = useSelfId();
    const { focus } = useStore();
    const linkman = useFocusLinkman();
    const $messageList = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    const keyboardOffset = insets.bottom + 44;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (!linkman || !isLogin) return;
        
        const request = linkman.type === 'group' 
            ? fetchGroupOnlineMembers 
            : fetchUserOnlineStatus;
            
        request();
        const timer = setInterval(request, 60000);
        return () => clearInterval(timer);
    }, [focus, isLogin]);

    useEffect(() => {
        if (Actions.currentScene !== 'chat') return;
        
        Actions.refresh({
            title: formatLinkmanName(linkman as Linkman),
        });
    }, [(linkman as Group).members, (linkman as Friend).isOnline]);

    useEffect(() => {
        const timer = setInterval(intervalUpdateHistory, 5000);
        return () => clearInterval(timer);
    }, [focus]);

    async function fetchGroupOnlineMembers() {
        const onlineMembers = isLogin 
            ? await getGroupOnlineMembers(focus)
            : await getDefaultGroupOnlineMembers();
            
        if (onlineMembers) {
            action.updateGroupProperty(focus, 'members', onlineMembers);
        }
    }

    async function fetchUserOnlineStatus() {
        const isOnline = await getUserOnlineStatus(focus.replace(self, ''));
        action.updateFriendProperty(focus, 'isOnline', isOnline);
    }

    async function intervalUpdateHistory() {
        if (isLogin && linkman && linkman.messages.length > 0) {
            const lastMessageId = linkman.messages[linkman.messages.length - 1]._id;
            if (lastMessageId !== lastMessageIdCache) {
                lastMessageIdCache = lastMessageId;
                await fetch('updateHistory', {
                    linkmanId: focus,
                    messageId: lastMessageId,
                });
            }
        }
    }

    const scrollToEnd = (time = 0) => {
        if (time > 200) return;
        
        if ($messageList.current) {
            $messageList.current.scrollToEnd({ animated: false });
        }

        setTimeout(() => scrollToEnd(time + 50), 50);
    };

    return (
        <PageContainer disableSafeAreaView>
            <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
                <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                    <LinearGradient
                        colors={['#FF0000', '#8B0000', '#000000']}
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
                                <Input onHeightChange={scrollToEnd} />
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
    keyboardAvoid: {
        flex: 1,
        transform: [{ skewX: '5deg' }],
    }
});
