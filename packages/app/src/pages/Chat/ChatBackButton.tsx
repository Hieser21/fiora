import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import BackButton from '../../components/BackButton';
import { useStore } from '../../hooks/useStore';

function ChatBackButton() {
    const store = useStore();
    const unread = store.linkmans.reduce((result, linkman) => {
        result += linkman.unread;
        return result;
    }, 0);

    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        if (unread > 0) {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [unread]);

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
            <BlurView intensity={15} tint="dark" style={styles.blurContainer}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <BackButton text={unread > 0 ? unread.toString() : ''} />
                </LinearGradient>
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    blurContainer: {
        borderRadius: 8,
    },
    gradient: {
        padding: 2,
        borderRadius: 8,
    }
});

export default ChatBackButton;
