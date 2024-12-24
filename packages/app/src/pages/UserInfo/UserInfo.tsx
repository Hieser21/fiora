import React from 'react';
import { Button, Text, View } from 'native-base';
import { StyleSheet, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import PageContainer from '../../components/PageContainer';
import Avatar from '../../components/Avatar';
import { useFocusLinkman, useIsAdmin, useLinkmans, useSelfId } from '../../hooks/useStore';
import { Linkman } from '../../types/redux';
import action from '../../state/action';
import { addFriend, deleteFriend, getLinkmanHistoryMessages, sealUser, sealUserOnlineIp } from '../../service';
import getFriendId from '../../utils/getFriendId';
import Toast from '../../components/Toast';

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
    user: {
        _id: string;
        avatar: string;
        tag: string;
        username: string;
    };
};

function UserInfo({ user }: Props) {
    const { _id, avatar, username } = user;
    const linkmans = useLinkmans();
    const friend = linkmans.find((linkman) => linkman._id.includes(_id)) as Linkman;
    const isFriend = friend && friend.type === 'friend';
    const isAdmin = useIsAdmin();
    const currentLinkman = useFocusLinkman() as Linkman;
    const self = useSelfId();
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true
        }).start();
    }, []);

    function handleSendMessage() {
        action.setFocus(friend._id);
        if (currentLinkman._id === friend._id) {
            Actions.pop();
        } else {
            Actions.popTo('_chatlist');
            Actions.push('chat', { title: friend.name });
        }
    }

    async function handleDeleteFriend() {
        const isSuccess = await deleteFriend(_id);
        if (isSuccess) {
            action.removeLinkman(friend._id);
            if (currentLinkman._id === friend._id) {
                Actions.popTo('_chatlist');
            } else {
                Actions.pop();
            }
        }
    }

    async function handleAddFriend() {
        const newLinkman = await addFriend(_id);
        const friendId = getFriendId(_id, self);
        if (newLinkman) {
            if (friend) {
                action.updateFriendProperty(friend._id, 'type', 'friend');
                const messages = await getLinkmanHistoryMessages(
                    friend._id,
                    friend.messages.length,
                );
                action.addLinkmanHistoryMessages(friend._id, messages);
            } else {
                action.addLinkman({
                    ...newLinkman,
                    _id: friendId,
                    name: username,
                    type: 'friend',
                    unread: 0,
                    messages: [],
                    from: self,
                    to: {
                        _id,
                        avatar,
                        username,
                    },
                });
                const messages = await getLinkmanHistoryMessages(friendId, 0);
                action.addLinkmanHistoryMessages(friendId, messages);
            }
            action.setFocus(friendId);

            if (currentLinkman._id === friend?._id) {
                Actions.pop();
            } else {
                Actions.popTo('_chatlist');
                Actions.push('chat', { title: newLinkman.username });
            }
        }
    }

    async function handleSealUser() {
        const isSuccess = await sealUser(username);
        if (isSuccess) {
            Toast.success('The user was banned successfully');
        }
    }

    async function handleSealIp() {
        const isSuccess = await sealUserOnlineIp(_id);
        if (isSuccess) {
            Toast.success('The user\'s current IP was banned succesfully');
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
                            <Text style={styles.nick}>{username}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            {isFriend ? (
                                <>
                                    <Button primary block style={styles.button} onPress={handleSendMessage}>
                                        <Text style={styles.buttonText}>Send Message</Text>
                                    </Button>
                                    <Button danger block style={styles.button} onPress={handleDeleteFriend}>
                                        <Text style={styles.buttonText}>Delete Friend</Text>
                                    </Button>
                                </>
                            ) : (
                                <Button primary block style={styles.button} onPress={handleAddFriend}>
                                    <Text style={styles.buttonText}>Add Friend</Text>
                                </Button>
                            )}
                            {isAdmin && (
                                <>
                                    <Button danger block style={styles.button} onPress={handleSealUser}>
                                        <Text style={styles.buttonText}>Block</Text>
                                    </Button>
                                    <Button danger block style={styles.button} onPress={handleSealIp}>
                                        <Text style={styles.buttonText}>Block IP</Text>
                                    </Button>
                                </>
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
        padding: 20,
        borderRadius: 12
    },
    userContainer: {
        alignItems: 'center'
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
        marginTop: 24
    },
    button: {
        marginBottom: 12,
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

export default UserInfo;