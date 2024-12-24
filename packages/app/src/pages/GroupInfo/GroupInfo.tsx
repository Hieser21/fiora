import React from 'react';
import { Button, Text, View } from 'native-base';
import { StyleSheet, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import PageContainer from '../../components/PageContainer';
import Avatar from '../../components/Avatar';
import { useFocusLinkman, useLinkmans } from '../../hooks/useStore';
import { Linkman } from '../../types/redux';
import action from '../../state/action';
import { getLinkmanHistoryMessages, joinGroup } from '../../service';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: {
        primary: '#FFFFFF',
        secondary: '#666666'
    }
};

type Props = {
    group: {
        _id: string;
        avatar: string;
        name: string;
        members: number;
    };
};

function GroupInfo({ group }: Props) {
    const { _id, avatar, name, members } = group;
    const linkmans = useLinkmans();
    const linkman = linkmans.find(
        (x) => x._id === _id && x.type === 'group',
    ) as Linkman;
    const isJoined = !!linkman;
    const currentLinkman = useFocusLinkman() as Linkman;
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true
        }).start();
    }, []);

    async function handleSendMessage() {
        action.setFocus(group._id);
        if (currentLinkman._id === group._id) {
            Actions.popTo('chat');
        } else {
            Actions.popTo('_chatlist');
            Actions.push('chat', { title: group.name });
        }
    }

    async function handleJoinGroup() {
        const newLinkman = await joinGroup(_id);
        if (newLinkman) {
            action.addLinkman({
                ...newLinkman,
                type: 'group',
                unread: 0,
                messages: [],
            });
            const messages = await getLinkmanHistoryMessages(_id, 0);
            action.addLinkmanHistoryMessages(_id, messages);
            action.setFocus(_id);

            Actions.popTo('_chatlist');
            Actions.push('chat', { title: newLinkman.name });
        }
    }

    return (
        <PageContainer>
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
                            transform: [
                                { scale: scaleAnim },
                                { skewX: '-5deg' }
                            ] 
                        }
                    ]}>
                        <View style={styles.userContainer}>
                            <Avatar src={avatar} size={88} />
                            <Text style={styles.nick}>{name}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Members:</Text>
                                <Text style={styles.infoValue}>{members}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            {isJoined ? (
                                <Button
                                    primary
                                    block
                                    style={styles.button}
                                    onPress={handleSendMessage}
                                >
                                    <Text style={styles.buttonText}>Send Message</Text>
                                </Button>
                            ) : (
                                <Button
                                    primary
                                    block
                                    style={styles.button}
                                    onPress={handleJoinGroup}
                                >
                                    <Text style={styles.buttonText}>Join Group</Text>
                                </Button>
                            )}
                        </View>
                    </Animated.View>
                </LinearGradient>
            </BlurView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
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
        padding: 20,
        borderRadius: 12
    },
    userContainer: {
        alignItems: 'center',
    },
    infoContainer: {
        marginTop: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoLabel: {
        color: PERSONA_COLORS.text.secondary,
        fontSize: 16,
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    infoValue: {
        color: PERSONA_COLORS.text.primary,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        textShadowColor: PERSONA_COLORS.primary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    nick: {
        color: PERSONA_COLORS.text.primary,
        marginTop: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: PERSONA_COLORS.primary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: PERSONA_COLORS.primary,
        borderRadius: 8,
        shadowColor: PERSONA_COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8
    },
    buttonText: {
        color: PERSONA_COLORS.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    }
});

export default GroupInfo;
