import { View, Text, Button } from 'native-base';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Avatar from '../../components/Avatar';
import PageContainer from '../../components/PageContainer';
import { useFocusLinkman, useSelfId } from '../../hooks/useStore';
import { deleteGroup, leaveGroup } from '../../service';
import action from '../../state/action';
import { Group } from '../../types/redux';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: {
        primary: '#FFFFFF',
        secondary: '#888888',
        danger: '#FF0000'
    }
};

function GroupProfile() {
    const linkman = useFocusLinkman() as Group;
    const self = useSelfId();
    const isGroupCreator = linkman.creator === self;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

    function getOS(os: string) {
        return os === 'Windows Server 2008 R2 / 7' ? 'Windows 7' : os;
    }

    function ShowEnvironment(environment: string) {
        Alert.alert('Device Information', environment);
    }

    async function handleLeaveGroup() {
        if (isGroupCreator) {
            const isSuccess = await deleteGroup(linkman._id);
            if (isSuccess) {
                action.removeLinkman(linkman._id);
                Actions.popTo('_chatlist', { title: '' });
            }
        } else {
            const isSuccess = await leaveGroup(linkman._id);
            if (isSuccess) {
                action.removeLinkman(linkman._id);
                Actions.popTo('_chatlist', { title: '' });
            }
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
                    <ScrollView style={styles.scrollView}>
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Function</Text>
                                <Button danger onPress={handleLeaveGroup} style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        {isGroupCreator ? 'Disband Group' : 'Leave Group'}
                                    </Text>
                                </Button>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Online Members</Text>
                                {linkman.members.map((member) => (
                                    <Pressable
                                        key={member._id}
                                        style={styles.member}
                                        onPress={() => ShowEnvironment(member.environment)}
                                    >
                                        <Avatar src={member.user.avatar} size={24} />
                                        <Text style={styles.memberName}>
                                            {member.user.username}
                                        </Text>
                                        <View style={styles.memberInfoContainer}>
                                            <Text style={styles.memberInfo}>
                                                {member.browser} {getOS(member.os)}
                                            </Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        </Animated.View>
                    </ScrollView>
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
    scrollView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        padding: 16
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: PERSONA_COLORS.text.primary,
        marginBottom: 12,
        textShadowColor: PERSONA_COLORS.primary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    button: {
        backgroundColor: PERSONA_COLORS.text.danger,
        borderRadius: 8,
        shadowColor: PERSONA_COLORS.text.danger,
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
    },
    member: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        marginBottom: 8,
        padding: 8
    },
    memberName: {
        fontSize: 14,
        color: PERSONA_COLORS.text.primary,
        marginLeft: 8,
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    memberInfoContainer: {
        flex: 1,
    },
    memberInfo: {
        fontSize: 12,
        color: PERSONA_COLORS.text.secondary,
        textAlign: 'right'
    }
});

export default GroupProfile;
