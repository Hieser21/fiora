import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Avatar from '../../components/Avatar';
import { useIsLogin, useStore, useTheme, useUser } from '../../hooks/useStore';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    online: 'rgba(94, 212, 92, 1)',
    offline: 'rgba(206, 12, 35, 1)'
};

function SelfInfo() {
    const isLogin = useIsLogin();
    const user = useUser();
    const { primaryTextColor10 } = useTheme();
    const { connect } = useStore();
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    if (!isLogin) {
        return null;
    }

    const { avatar, username } = user;

    return (
        <BlurView intensity={15} tint="dark" style={styles.blurContainer}>
            <LinearGradient
                colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.container}>
                    <View>
                        <Avatar src={avatar} size={32} />
                        <Animated.View
                            style={[
                                styles.onlineStatus,
                                connect ? styles.online : styles.offline,
                                {
                                    transform: [{ scale: connect ? pulseAnim : 1 }]
                                }
                            ]}
                        />
                    </View>
                    <View>
                        <Text style={[styles.nickname, { color: PERSONA_COLORS.accent }]}>
                            {username}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    blurContainer: {
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden'
    },
    gradient: {
        padding: 2,
        borderRadius: 12
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 38,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12
    },
    nickname: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    onlineStatus: {
        width: 10,
        height: 10,
        borderRadius: 5,
        position: 'absolute',
        right: 0,
        bottom: 0,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5
    },
    online: {
        backgroundColor: PERSONA_COLORS.online,
        shadowColor: PERSONA_COLORS.online
    },
    offline: {
        backgroundColor: PERSONA_COLORS.offline,
        shadowColor: PERSONA_COLORS.offline
    }
});

export default SelfInfo;
