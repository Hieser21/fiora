import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Animated,
} from 'react-native';
import { Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import action from '../../state/action';
import fetch from '../../utils/fetch';
import { isiOS } from '../../utils/platform';
import expressions from '../../utils/expressions';
import Expression from '../../components/Expression';
import { useIsLogin, useStore, useUser } from '../../hooks/useStore';
import { Message } from '../../types/redux';
import uploadFile from '../../utils/uploadFile';

const { width: ScreenWidth } = Dimensions.get('window');
const ExpressionSize = (ScreenWidth - 16) / 10;

type Props = {
    onHeightChange: () => void;
};

export default function Input({ onHeightChange }: Props) {
    const isLogin = useIsLogin();
    const user = useUser();
    const { focus } = useStore();
    const slideAnim = React.useRef(new Animated.Value(0)).current;

    const [message, setMessage] = useState('');
    const [showFunctionList, toggleShowFunctionList] = useState(true);
    const [showExpression, toggleShowExpression] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });

    const $input = useRef<TextInput>(null);

    React.useEffect(() => {
        if (showExpression) {
            Animated.spring(slideAnim, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showExpression]);

    function setInputText(text = '') {
        // iossetNativeProps无效, 解决办法参考:https://github.com/facebook/react-native/issues/18272
        if (isiOS) {
            $input.current!.setNativeProps({ text: text || ' ' });
        }
        setTimeout(() => {
            $input.current!.setNativeProps({ text: text || '' });
        });
    }

    function addSelfMessage(type: string, content: string) {
        const _id = focus + Date.now();
        const newMessage: Message = {
            _id,
            type,
            content,
            createTime: Date.now(),
            from: {
                _id: user._id,
                username: user.username,
                avatar: user.avatar,
                tag: user.tag,
            },
            to: '',
            loading: true,
        };

        if (type === 'image') {
            newMessage.percent = 0;
        }
        action.addLinkmanMessage(focus, newMessage);

        return _id;
    }

    async function sendMessage(localId: string, type: string, content: string) {
        const [err, res] = await fetch('sendMessage', {
            to: focus,
            type,
            content,
        });
        if (!err) {
            res.loading = false;
            action.updateSelfMessage(focus, localId, res);
        }
    }

    function handleSubmit() {
        if (message === '') {
            return;
        }

        const id = addSelfMessage('text', message);
        sendMessage(id, 'text', message);

        setMessage('');
        toggleShowFunctionList(true);
        toggleShowExpression(false);
        setInputText();
    }

    function handleSelectionChange(event: any) {
        const { start, end } = event.nativeEvent.selection;
        setCursorPosition({
            start,
            end,
        });
    }

    function handleFocus() {
        toggleShowFunctionList(true);
        toggleShowExpression(false);
    }

    function openExpression() {
        $input.current!.blur();

        toggleShowFunctionList(false);
        toggleShowExpression(true);

        onHeightChange();
    }

    async function handleClickImage() {
        const currentPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (currentPermission.accessPrivileges === 'none') {
            if (currentPermission.canAskAgain) {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (permission.accessPrivileges === 'none') {
                    return;
                }
            } else {
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos', 'livePhotos'],
            base64: true,
        });

        // Replace the existing result handling with:
        if (!result.canceled && result.assets[0]) {
            const id = addSelfMessage(
                'image',
                `${result.assets[0].uri}?width=${result.assets[0].width}&height=${result.assets[0].height}`,
            );
            const key = `ImageMessage/${user._id}_${Date.now()}`;
            const imageUrl = await uploadFile(
                result.assets[0].base64 as string,
                key,
                true,
            );
            sendMessage(
                id,
                'image',
                `${imageUrl}?width=${result.assets[0].width}&height=${result.assets[0].height}`,
            );
        }

    }

    async function handleClickCamera() {
        const currentPermission = await ImagePicker.getCameraPermissionsAsync();
        if (currentPermission.status === 'undetermined') {
            if (currentPermission.canAskAgain) {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (permission.status === 'undetermined') {
                    return;
                }
            } else {
                return;
            }
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
        });

        // Replace the existing result handling with:
        if (!result.canceled && result.assets[0]) {
            const id = addSelfMessage(
                'image',
                `${result.assets[0].uri}?width=${result.assets[0].width}&height=${result.assets[0].height}`,
            );
            const key = `ImageMessage/${user._id}_${Date.now()}`;
            const imageUrl = await uploadFile(
                result.assets[0].base64 as string,
                key,
                true,
            );
            sendMessage(
                id,
                'image',
                `${imageUrl}?width=${result.assets[0].width}&height=${result.assets[0].height}`,
            );
        }

    }

    function handleChangeText(value: string) {
        setMessage(value);
    }

    function insertExpression(e: string) {
        const expression = `#(${e})`;
        const newValue = `${message.substring(
            0,
            cursorPosition.start,
        )}${expression}${message.substring(
            cursorPosition.end,
            message.length,
        )}`;
        setMessage(newValue);
        setCursorPosition({
            start: cursorPosition.start + expression.length,
            end: cursorPosition.start + expression.length,
        });
        setInputText(newValue);
    }

    return (
        <SafeAreaView style={styles.safeView}>
            <BlurView intensity={15} tint="dark" style={styles.container}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {isLogin ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={$input}
                                style={styles.input}
                                placeholder="Just chat about anything..."
                                placeholderTextColor="#666"
                                onChangeText={handleChangeText}
                                onSubmitEditing={handleSubmit}
                                autoCapitalize="none"
                                blurOnSubmit={false}
                                maxLength={2048}
                                returnKeyType="send"
                                enablesReturnKeyAutomatically
                                underlineColorAndroid="transparent"
                                onSelectionChange={handleSelectionChange}
                                onFocus={handleFocus}
                            />
                        </View>
                    ) : (
                        <Button block style={styles.button} onPress={Actions.login}>
                            <Text style={styles.buttonText}>
                                Login / Register, Join the chat
                            </Text>
                        </Button>
                    )}
                    {isLogin && showFunctionList && (
                        <View style={styles.iconButtonContainer}>
                            <TouchableOpacity onPress={handleClickImage} style={styles.iconButton}>
                                <Ionicons name="image" size={28} color="#FF0000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleClickCamera} style={styles.iconButton}>
                                <Ionicons name="camera" size={28} color="#FF0000" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <Animated.View
                        style={[
                            styles.expressionContainer,
                            {
                                transform: [
                                    {
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [200, 0]
                                        })
                                    }
                                ]
                            }
                        ]}
                    >
                        
                    </Animated.View>
                </LinearGradient>
            </BlurView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeView: {
        backgroundColor: 'transparent',
    },
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        margin: 8,
    },
    gradient: {
        padding: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    input: {
        flex: 1,
        height: 36,
        paddingHorizontal: 8,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: '#FF0000',
        borderRadius: 5,
        transform: [{ skewX: '-5deg' }],
    },
    button: {
        height: 36,
        margin: 10,
        backgroundColor: '#FF0000',
        transform: [{ skewX: '-5deg' }],
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    iconButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,0,0,0.1)',
    },
    expressionContainer: {
        height: (isiOS ? 34 : 30) * 5 + 6,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    expressionButton: {
        width: ExpressionSize,
        height: isiOS ? 34 : 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});