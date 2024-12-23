import { View } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Image from '../../components/Image';
import { Message } from '../../types/redux';

const { width: ScreenWidth } = Dimensions.get('window');

type Props = {
    message: Message;
    openImageViewer: (imageUrl: string) => void;
    couldDelete: boolean;
    onLongPress: () => void;
};

function ImageMessage({
    message,
    openImageViewer,
    couldDelete,
    onLongPress,
}: Props) {
    const maxWidth = ScreenWidth - 130 - 16;
    const maxHeight = 200;
    let scale = 1;
    let width = 0;
    let height = 0;
    
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    const parseResult = /width=([0-9]+)&height=([0-9]+)/.exec(message.content);
    if (parseResult) {
        width = parseInt(parseResult[1], 10);
        height = parseInt(parseResult[2], 10);
        if (width * scale > maxWidth) {
            scale = maxWidth / width;
        }
        if (height * scale > maxHeight) {
            scale = maxHeight / height;
        }
    }

    function handleImageClick() {
        const imageUrl = message.content;
        openImageViewer(imageUrl);
    }

    return (
        <Animated.View style={[
            styles.container,
            { 
                width: width * scale, 
                height: height * scale,
                transform: [
                    { scale: scaleAnim },
                    { skewX: '-5deg' }
                ]
            }
        ]}>
            <BlurView intensity={15} tint="dark" style={styles.blurContainer}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <TouchableOpacity
                        onPress={handleImageClick}
                        {...(couldDelete ? { onLongPress } : {})}
                        style={styles.touchable}
                    >
                        <Image
                            src={message.content}
                            style={[
                                styles.image,
                                { width: width * scale - 4, height: height * scale - 4 }
                            ]}
                        />
                    </TouchableOpacity>
                </LinearGradient>
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#FF0000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 8,
    },
    blurContainer: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        padding: 2,
    },
    touchable: {
        flex: 1,
    },
    image: {
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.7)',
    }
});

export default ImageMessage;
