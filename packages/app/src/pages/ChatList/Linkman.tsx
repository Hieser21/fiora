import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import Time from '../../utils/time';
import action from '../../state/action';
import Avatar from '../../components/Avatar';
import { Linkman as LinkmanType } from '../../types/redux';
import { formatLinkmanName } from '../../utils/linkman';
import fetch from '../../utils/fetch';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: {
        primary: '#FFFFFF',
        secondary: '#888888',
        preview: '#666666'
    }
};

type Props = {
    id: string;
    name: string;
    avatar: string;
    preview: string;
    time: Date;
    unread: number;
    lastMessageId: string;
    linkman: LinkmanType;
};

export default function Linkman({
    id,
    name,
    avatar,
    preview,
    time,
    unread,
    lastMessageId,
    linkman,
}: Props) {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    function formatTime() {
        const nowTime = new Date();
        if (Time.isToday(nowTime, time)) {
            return Time.getHourMinute(time);
        }
        if (Time.isYesterday(nowTime, time)) {
            return 'yesterday';
        }
        if (Time.isSameYear(nowTime, time)) {
            return Time.getMonthDate(time);
        }
        return Time.getYearMonthDate(time);
    }

    function handlePress() {
        action.setFocus(id);
        Actions.chat({ title: formatLinkmanName(linkman) });

        if (id && lastMessageId) {
            fetch('updateHistory', { linkmanId: id, messageId: lastMessageId });
        }
    }

    return (
        <TouchableOpacity 
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <BlurView intensity={15} tint="dark" style={styles.blurContainer}>
                <LinearGradient
                    colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Animated.View style={[
                        styles.container,
                        { transform: [{ scale: scaleAnim }] }
                    ]}>
                        <Avatar src={avatar} size={50} />
                        <View style={styles.content}>
                            <View style={styles.nickTime}>
                                <Text style={styles.nick}>{name}</Text>
                                <Text style={styles.time}>{formatTime()}</Text>
                            </View>
                            <View style={styles.previewUnread}>
                                <Text style={styles.preview} numberOfLines={1}>
                                    {preview}
                                </Text>
                                {unread > 0 ? (
                                    <View style={styles.unread}>
                                        <Text style={styles.unreadText}>
                                            {unread > 99 ? '99' : unread}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </Animated.View>
                </LinearGradient>
            </BlurView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    blurContainer: {
        margin: 4,
        borderRadius: 12,
        overflow: 'hidden'
    },
    gradient: {
        padding: 2,
        borderRadius: 12
    },
    container: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12
    },
    content: {
        flex: 1,
        marginLeft: 8,
    },
    nickTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nick: {
        fontSize: 16,
        color: PERSONA_COLORS.text.primary,
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    time: {
        fontSize: 14,
        color: PERSONA_COLORS.text.secondary,
    },
    previewUnread: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    preview: {
        flex: 1,
        fontSize: 14,
        color: PERSONA_COLORS.text.preview,
    },
    unread: {
        backgroundColor: PERSONA_COLORS.primary,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        shadowColor: PERSONA_COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5
    },
    unreadText: {
        fontSize: 10,
        color: PERSONA_COLORS.text.primary,
        fontWeight: 'bold'
    },
});
