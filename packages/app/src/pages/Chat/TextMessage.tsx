import { View, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Expression from '../../components/Expression';
import { Message } from '../../types/redux';
import expressions from '../../utils/expressions';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    link: '#87CEEB',
    text: {
        self: '#FFFFFF',
        other: '#444444'
    }
};

type Props = {
    message: Message;
    isSelf: boolean;
};

function TextMessage({ message, isSelf }: Props) {
    const children = [];
    let copy = message.content;

    function push(str: string) {
        children.push(
            <Text
                key={Math.random()}
                style={[
                    styles.text,
                    { color: isSelf ? PERSONA_COLORS.text.self : PERSONA_COLORS.text.other }
                ]}
            >
                {str}
            </Text>,
        );
    }

    let offset = 0;
    while (copy.length > 0) {
        const regex = /#\(([\u4e00-\u9fa5a-z]+)\)|https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
        const matchResult = regex.exec(copy);
        if (matchResult) {
            const r = matchResult[0];
            const e = matchResult[1];
            const i = copy.indexOf(r);
            if (r[0] === '#') {
                const index = expressions.default.indexOf(e);
                if (index !== -1) {
                    if (i > 0) {
                        push(copy.substring(0, i));
                    }
                    children.push(
                        <Expression
                            key={Math.random()}
                            style={styles.expression}
                            size={30}
                            index={index}
                        />,
                    );
                    offset += i + r.length;
                }
            } else {
                if (i > 0) {
                    push(copy.substring(0, i));
                }
                children.push(
                    <TouchableOpacity
                        key={Math.random()}
                        onPress={() => Linking.openURL(r)}
                    >
                        <BlurView intensity={10} tint={isSelf ? "light" : "dark"}>
                            <LinearGradient
                                colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.linkGradient}
                            >
                                <Text style={styles.link}>{r}</Text>
                            </LinearGradient>
                        </BlurView>
                    </TouchableOpacity>,
                );
                offset += i + r.length;
            }
            copy = copy.substr(i + r.length);
        } else {
            break;
        }
    }

    if (offset < message.content.length) {
        push(message.content.substring(offset, message.content.length));
    }

    return (
        <BlurView intensity={15} tint={isSelf ? "light" : "dark"} style={styles.container}>
            <LinearGradient
                colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>{children}</View>
            </LinearGradient>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradient: {
        padding: 8,
        borderRadius: 12,
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
    },
    text: {
        flexShrink: 1,
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    expression: {
        marginHorizontal: 1,
        transform: [{ translateY: 3 }],
    },
    linkGradient: {
        padding: 4,
        borderRadius: 6,
    },
    link: {
        color: PERSONA_COLORS.link,
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    }
});

export default TextMessage;
