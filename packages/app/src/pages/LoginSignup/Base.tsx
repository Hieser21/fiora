import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, Animated } from 'react-native';
import { Form, Label, Button, View } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import PageContainer from '../../components/PageContainer';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: {
        primary: '#FFFFFF',
        secondary: '#888888'
    }
};

type Props = {
    buttonText: string;
    jumpText: string;
    jumpPage: string;
    onSubmit: (username: string, password: string) => void;
};

export default function Base({
    buttonText,
    jumpText,
    jumpPage,
    onSubmit,
}: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const $username = useRef<TextInput>();
    const $password = useRef<TextInput>();

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

    function handlePress() {
        $username.current!.blur();
        $password.current!.blur();
        onSubmit(username, password);
    }

    function handleJump() {
        if (Actions[jumpPage]) {
            Actions.replace(jumpPage);
        }
    }

    return (
        <PageContainer>
            <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                <LinearGradient
                    colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Animated.View style={[
                        styles.container,
                        { 
                            opacity: fadeAnim,
                            transform: [{ skewX: '-5deg' }] 
                        }
                    ]}>
                        <Form>
                            <Label style={styles.label}>Username</Label>
                            <TextInput
                                style={styles.input}
                                ref={$username}
                                clearButtonMode="while-editing"
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCompleteType="username"
                                placeholderTextColor={PERSONA_COLORS.text.secondary}
                            />
                            <Label style={styles.label}>Password</Label>
                            <TextInput
                                style={styles.input}
                                ref={$password}
                                secureTextEntry
                                clearButtonMode="while-editing"
                                onChangeText={setPassword}
                                autoCapitalize="none"
                                autoCompleteType="password"
                                placeholderTextColor={PERSONA_COLORS.text.secondary}
                            />
                        </Form>
                        <Button
                            primary
                            block
                            style={styles.button}
                            onPress={handlePress}
                        >
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </Button>
                        <Button transparent style={styles.signup} onPress={handleJump}>
                            <Text style={styles.signupText}>{jumpText}</Text>
                        </Button>
                    </Animated.View>
                </LinearGradient>
            </BlurView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    blurContainer: {
        flex: 1,
        margin: 12,
        borderRadius: 12,
        overflow: 'hidden'
    },
    gradient: {
        flex: 1,
        padding: 2
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 12
    },
    label: {
        color: PERSONA_COLORS.text.primary,
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: PERSONA_COLORS.primary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    input: {
        height: 42,
        fontSize: 16,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderColor: PERSONA_COLORS.primary,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: PERSONA_COLORS.text.primary
    },
    button: {
        marginTop: 24,
        backgroundColor: PERSONA_COLORS.primary,
        borderRadius: 8,
        shadowColor: PERSONA_COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8
    },
    buttonText: {
        fontSize: 18,
        color: PERSONA_COLORS.text.primary,
        fontWeight: 'bold',
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    signup: {
        alignSelf: 'flex-end',
        marginTop: 16
    },
    signupText: {
        color: PERSONA_COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    }
});
