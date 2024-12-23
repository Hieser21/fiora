import React from 'react';
import { StyleSheet, Image as BaseImage, ImageSourcePropType, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { getOSSFileUrl } from '../utils/uploadFile';
import { referer } from '../utils/constant';

type Props = {
    src: string;
    width?: string | number;
    height?: string | number;
    style?: any;
};

export default function Image({ src, width = '100%', height = '100%', style }: Props) {
    let source: ImageSourcePropType = src;
    if (typeof src === 'string') {
        let uri = getOSSFileUrl(src, `image/quality,q_90`);
        if (width !== '100%' && height !== '100%') {
            uri = getOSSFileUrl(
                src,
                `image/resize,w_${Math.ceil(width as number)},h_${Math.ceil(
                    height as number,
                )}/quality,q_90`,
            );
        }
        source = {
            uri: uri as string,
            cache: 'force-cache',
            headers: {
                Referer: referer,
            },
        };
    }

    return (
        <View style={[styles.container, { width, height }]}>
            <BlurView intensity={10} tint="dark" style={styles.blurContainer}>
                <LinearGradient
                    colors={['#FF0000', '#8B0000', '#2B2B2B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <BaseImage 
                        source={source} 
                        style={[
                            styles.image,
                            {
                                width: typeof width === 'number' ? width - 4 : width,
                                height: typeof height === 'number' ? height - 4 : height,
                            },
                            style
                        ]} 
                    />
                </LinearGradient>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 4,
    },
    blurContainer: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        borderRadius: 6,
        transform: [{ skewX: '-5deg' }],
        backgroundColor: '#1a1a1a',
        shadowColor: '#FF0000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
    }
});
