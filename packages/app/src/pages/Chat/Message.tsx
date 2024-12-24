import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Triangle from '@react-native-toolkit/triangle';
import { ActionSheet } from 'native-base';
import { Actions } from 'react-native-router-flux';

import Time from '../../utils/time';
import Avatar from '../../components/Avatar';
import { Message as MessageType } from '../../types/redux';
import SystemMessage from './SystemMessage';
import ImageMessage from './ImageMessage';
import TextMessage from './TextMessage';
import { getRandomColor } from '../../utils/getRandomColor';
import InviteMessage from './InviteMessage';
import { useFocus, useIsAdmin, useSelfId, useTheme } from '../../hooks/useStore';
import { deleteMessage } from '../../service';
import action from '../../state/action';

const { width: ScreenWidth } = Dimensions.get('window');

type Props = {
    message: MessageType;
    isSelf: boolean;
    shouldScroll: boolean;
    scrollToEnd: () => void;
    openImageViewer: (imageUrl: string) => void;
};

function Message({
    message,
    isSelf,
    shouldScroll,
    scrollToEnd,
    openImageViewer,
}: Props) {
    const { primaryColor8 } = useTheme();
    const isAdmin = useIsAdmin();
    const self = useSelfId();
    const focus = useFocus();
    const slideAnim = React.useRef(new Animated.Value(-50)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const couldDelete = message.type !== 'system' && (isAdmin || message.from._id === self);

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();

        if (shouldScroll) {
            scrollToEnd();
        }
    }, []);
    async function handleDeleteMessage() {
        const options = ['Delete', 'Cancel'];
        ActionSheet.show(
            {
                options: ['OK', 'Cancel'],
                cancelButtonIndex: options.findIndex(
                    (option) => option === 'Cancel',
                ),
                title: 'Do you want to Delete this message?',
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0: {
                        const isSuccess = await deleteMessage(message._id);
                        if (isSuccess) {
                            action.deleteLinkmanMessage(focus, message._id);
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        );
    }

    function formatTime() {
        const createTime = new Date(message.createTime);
        const nowTime = new Date();
        if (Time.isToday(nowTime, createTime)) {
            return Time.getHourMinute(createTime);
        }
        if (Time.isYesterday(nowTime, createTime)) {
            return `昨天 ${Time.getHourMinute(createTime)}`;
        }
        if (Time.isSameYear(nowTime, createTime)) {
            return `${Time.getMonthDate(createTime)} ${Time.getHourMinute(
                createTime,
            )}`;
        }
        return `${Time.getYearMonthDate(createTime)} ${Time.getHourMinute(
            createTime,
        )}`;
    }

    function handleClickAvatar() {
        Actions.push('userInfo', { user: message.from });
    }

    function renderContent() {
        switch (message.type) {
            case 'text': {
                return <TextMessage message={message} isSelf={isSelf} />;
            }
            case 'image': {
                return (
                    <ImageMessage
                        message={message}
                        openImageViewer={openImageViewer}
                        couldDelete={couldDelete}
                        onLongPress={handleDeleteMessage}
                    />
                );
            }
            case 'system': {
                return <SystemMessage message={message} />;
            }
            case 'inviteV2': {
                return <InviteMessage message={message} isSelf={isSelf} />;
            }
            case 'file':
            case 'code': {
                return (
                    <Text style={{ color: isSelf ? 'white' : '#666' }}>
                        Message types not yet supported[
                        {message.type}
                        ], Please check it on the web
                    </Text>
                );
            }
            default:
                return (
                    <Text style={{ color: isSelf ? 'white' : '#666' }}>
                        unsupported message type
                    </Text>
                );
        }
    }

    return (
        <Animated.View style={[
            styles.container,
            isSelf && styles.containerSelf,
            {
                opacity: fadeAnim,
                transform: [
                    { translateX: slideAnim },
                    { skewX: '-5deg' }
                ]
            }
        ]}>
            <BlurView intensity={15} tint="dark" style={styles.messageContainer}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {isSelf ? (
                        <Avatar src={message.from.avatar} size={44} />
                    ) : (
                        <TouchableOpacity onPress={handleClickAvatar}>
                            <Avatar src={message.from.avatar} size={44} />
                        </TouchableOpacity>
                    )}
                    <View style={[styles.info, isSelf && styles.infoSelf]}>
                        <View style={[styles.nickTime, isSelf && styles.nickTimeSelf]}>
                            {!!message.from.tag && (
                                <View style={[styles.tag, { backgroundColor: getRandomColor(message.from.tag) }]}>
                                    <Text style={styles.tagText}>{message.from.tag}</Text>
                                </View>
                            )}
                            <Text style={[styles.nick, isSelf ? styles.nickSelf : styles.nickOther]}>
                                {message.from.username}
                            </Text>
                            <Text style={[styles.time, isSelf && styles.timeSelf]}>
                                {formatTime()}
                            </Text>
                        </View>
                        {couldDelete ? (
                            <TouchableOpacity onLongPress={handleDeleteMessage}>
                                <View style={[styles.content, { backgroundColor: isSelf ? primaryColor8 : 'rgba(0,0,0,0.7)' }]}>
                                    {renderContent()}
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={[styles.content, { backgroundColor: isSelf ? primaryColor8 : 'rgba(0,0,0,0.7)' }]}>
                                {renderContent()}
                            </View>
                        )}
                        <View style={[styles.triangle, isSelf ? styles.triangleSelf : styles.triangleOther]}>
                            <Triangle
                                type="isosceles"
                                mode={isSelf ? 'right' : 'left'}
                                base={10}
                                height={5}
                                color={isSelf ? primaryColor8 : 'rgba(0,0,0,0.7)'}
                            />
                        </View>
                    </View>
                </LinearGradient>
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    containerSelf: {
        flexDirection: 'row-reverse',
    },
    messageContainer: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradient: {
        padding: 2,
        borderRadius: 12,
        flexDirection: 'row',
    },
    info: {
        position: 'relative',
        marginHorizontal: 12,
        maxWidth: ScreenWidth - 120,
        alignItems: 'flex-start',
    },
    infoSelf: {
        alignItems: 'flex-end',
    },
    nickTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nickTimeSelf: {
        flexDirection: 'row-reverse',
    },
    nick: {
        fontSize: 13,
        color: '#FFFFFF',
        textShadowColor: '#FF0000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    nickSelf: {
        marginRight: 4,
    },
    nickOther: {
        marginLeft: 4,
    },
    time: {
        fontSize: 12,
        color: '#999',
        marginLeft: 4,
    },
    timeSelf: {
        marginRight: 4,
    },
    content: {
        marginTop: 6,
        borderRadius: 6,
        padding: 8,
        minHeight: 26,
        minWidth: 20,
    },
    triangle: {
        position: 'absolute',
        top: 25,
    },
    triangleSelf: {
        right: -5,
    },
    triangleOther: {
        left: -5,
    },
    tag: {
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderRadius: 3,
    },
    tagText: {
        fontSize: 11,
        color: '#FFFFFF',
    },
});

export default React.memo(Message);