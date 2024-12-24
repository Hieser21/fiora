import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Keyboard, Modal, Image, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import ImageView from 'react-native-image-viewing';


import action from '../../state/action';
import fetch from '../../utils/fetch';

import Message from './Message';
import {
    useFocusLinkman,
    useIsLogin,
    useSelfId,
    useStore,
} from '../../hooks/useStore';
import { Message as MessageType } from '../../types/redux';
import Toast from '../../components/Toast';
import { isAndroid, isiOS } from '../../utils/platform';
import { referer } from '../../utils/constant';


const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000', 
    accent: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.8)'
};

type Props = {
    $scrollView: React.MutableRefObject<ScrollView>;
};

let prevContentHeight = 0;
let prevMessageCount = 0;
let shouldScroll = true;
let isFirstTimeFetchHistory = true;

function MessageList({ $scrollView }: Props) {
    const isLogin = useIsLogin();
    const self = useSelfId();
    const focusLinkman = useFocusLinkman();
    const { focus } = useStore();
    const messages = focusLinkman?.messages || [];

    const [refreshing, setRefreshing] = useState(false);
    const [showImageViewerDialog, toggleShowImageViewerDialog] = useState(
        false,
    );
    const [imageViewerIndex, setImageViewerIndex] = useState(0);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, []);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardWillShow',
            handleKeyboardShow,
        );

        return () => {
            prevContentHeight = 0;
            prevMessageCount = 0;
            shouldScroll = true;
            isFirstTimeFetchHistory = true;
            keyboardDidShowListener.remove();
        };
    }, []);

    function getImages() {
        const imageMessages = messages.filter(
            (message) => message.type === 'image',
        );
        const images = imageMessages.map((message) => {
            const url = message.content;
            const parseResult = /width=(\d+)&height=(\d+)/.exec(url);
            return {
                url: `${url.startsWith('//') ? 'https:' : ''}${url}`,
                ...(parseResult
                    ? {
                        width: +parseResult[1],
                        height: +parseResult[2],
                    }
                    : {}),
            };
        });
        return images;
    }

    function scrollToEnd(time = 0) {
        if (time > 200) {
            return;
        }
        if ($scrollView.current) {
            $scrollView.current!.scrollToEnd({ animated: false });
        }

        setTimeout(() => {
            scrollToEnd(time + 50);
        }, 50);
    }

    function handleKeyboardShow() {
        scrollToEnd();
    }

    async function handleRefresh() {
        if (refreshing) {
            return;
        }

        if (isFirstTimeFetchHistory && isAndroid) {
            isFirstTimeFetchHistory = false;
            return;
        }

        setRefreshing(true);

        let err = null;
        let result = null;
        if (isLogin) {
            [err, result] = await fetch('getLinkmanHistoryMessages', {
                linkmanId: focus,
                existCount: messages.length,
            });
        } else {
            [err, result] = await fetch('getDefalutGroupHistoryMessages', {
                existCount: messages.length,
            });
        }
        if (!err) {
            if (result.length > 0) {
                action.addLinkmanHistoryMessages(focus, result);
            } else {
                Toast.warning('no more news');
            }
        }

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }
    /**
     * 加载历史消息后, 自动滚动到合适位置
     */
    function handleContentSizeChange(
        contentWidth: number,
        contentHeight: number,
    ) {
        if (prevContentHeight === 0) {
            $scrollView.current!.scrollTo({
                x: 0,
                y: 0,
                animated: false,
            });
        } else if (
            contentHeight !== prevContentHeight &&
            messages.length - prevMessageCount > 1
        ) {
            $scrollView.current!.scrollTo({
                x: 0,
                y: contentHeight - prevContentHeight - 60,
                animated: false,
            });
        }
        prevContentHeight = contentHeight;
        prevMessageCount = messages.length;
    }

    function handleScroll(event: any) {
        const {
            layoutMeasurement,
            contentSize,
            contentOffset,
        } = event.nativeEvent;
        shouldScroll =
            contentOffset.y >
            contentSize.height - layoutMeasurement.height * 1.2;

        if (contentOffset.y < (isiOS ? 0 : 50)) {
            handleRefresh();
        }
    }

    function openImageViewer(url: string) {
        const images = getImages();
        const index = images.findIndex(
            (image) => image.url.indexOf(url) !== -1,
        );
        toggleShowImageViewerDialog(true);
        setImageViewerIndex(index);
    }

    function renderMessage(message: MessageType) {
        return (
            <Animated.View 
                style={[
                    styles.messageWrapper,
                    { opacity: fadeAnim }
                ]}
            >
                <LinearGradient
                    colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                    style={styles.messageGradient}
                >
                    <Message
                        key={message._id}
                        message={message}
                        isSelf={self === message.from._id}
                        shouldScroll={shouldScroll}
                        scrollToEnd={scrollToEnd}
                        openImageViewer={openImageViewer}
                    />
                </LinearGradient>
            </Animated.View>
        );
    }

    function closeImageViewerDialog() {
        toggleShowImageViewerDialog(false);
    }

    return (
        <BlurView intensity={20} tint="dark" style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                ref={$scrollView}
                onContentSizeChange={handleContentSizeChange}
                scrollEventThrottle={50}
                onScroll={handleScroll}
            >
                {messages.map((message) => renderMessage(message))}
            </ScrollView>
           <ImageView
    images={getImages()}
    imageIndex={imageViewerIndex}
    visible={showImageViewerDialog}
    onRequestClose={() => closeImageViewerDialog()}
    swipeToCloseEnabled={true}
    animationType="fade"
    backgroundColor={PERSONA_COLORS.overlay}
/>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PERSONA_COLORS.overlay
    },
    scrollView: {
        paddingTop: 8,
        paddingBottom: 8
    },
    messageWrapper: {
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden'
    },
    messageGradient: {
        padding: 12,
        borderRadius: 12
    }
});

export default MessageList;