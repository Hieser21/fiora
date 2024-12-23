import { View, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Toast from '../../components/Toast';
import { getLinkmanHistoryMessages, joinGroup } from '../../service';
import action from '../../state/action';
import { Message } from '../../types/redux';

type Props = {
    message: Message;
    isSelf: boolean;
};

function InviteMessage({ message, isSelf }: Props) {
    const invite = JSON.parse(message.content);
    const scaleAnim = React.useRef(new Animated.Value(0)).current;
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    async function handleJoinGroup() {
        const group = await joinGroup(invite.group);
        if (group) {
            group.type = 'group';
            action.addLinkman(group, true);
            Actions.refresh({ title: group.name });
            Toast.success('Joined the group successfully');
            const messages = await getLinkmanHistoryMessages(invite.group, 0);
            if (messages) {
                action.addLinkmanHistoryMessages(invite.group, messages);
            }
        }
    }

    return (
        <Animated.View style={[
            styles.wrapper,
            { transform: [{ scale: scaleAnim }, { skewX: '-5deg' }] }
        ]}>
            <BlurView intensity={15} tint="dark" style={styles.container}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <TouchableOpacity onPress={handleJoinGroup} style={styles.button}>
                        <View style={styles.content}>
                            <View style={[
                                styles.info,
                                { borderBottomColor: isSelf ? '#FF0000' : '#8B0000' }
                            ]}>
                                <Text style={styles.text}>
                                    &quot;{invite.inviterName}&quot; invited you to join「{invite.groupName}」
                                </Text>
                            </View>
                            <Animated.View style={[
                                styles.join,
                                { opacity: glowAnim }
                            ]}>
                                <Text style={styles.joinText}>Join Now</Text>
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '90%',
        marginVertical: 8,
    },
    container: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradient: {
        padding: 2,
    },
    button: {
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    content: {
        padding: 12,
    },
    info: {
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 8,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        textShadowColor: '#FF0000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    join: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    joinText: {
        color: '#FF0000',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

export default InviteMessage;
