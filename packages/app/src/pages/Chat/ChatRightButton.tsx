import { View, Icon } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Actions } from 'react-native-router-flux';
import { useFocusLinkman } from '../../hooks/useStore';

function ChatRightButton() {
    const linkman = useFocusLinkman();
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    function handleClick() {
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            rotateAnim.setValue(0);
            if (linkman?.type === 'group') {
                Actions.push('groupProfile');
            } else {
                Actions.push('userInfo', { user: linkman });
            }
        });
    }

    return (
        <TouchableOpacity onPress={handleClick}>
            <BlurView intensity={15} tint="dark" style={styles.container}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <View style={styles.iconContainer}>
                        <Animated.View style={{ transform: [{ rotate }] }}>
                            <Icon name="ellipsis-horizontal" style={styles.icon} />
                        </Animated.View>
                    </View>
                </LinearGradient>
            </BlurView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
        transform: [{ skewX: '-10deg' }],
    },
    gradient: {
        padding: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: '#FF0000',
        fontSize: 26,
        textShadowColor: '#FF0000',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    }
});

export default ChatRightButton;
