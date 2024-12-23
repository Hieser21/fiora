import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { getOSSFileUrl } from '../utils/uploadFile';
import Image from './Image';

type Props = {
    src: string;
    size: number;
    style?: any;
};

export default function Avatar({ src, size, style }: Props) {
    const targetUrl = getOSSFileUrl(
        src,
        `image/resize,w_${size * 2},h_${size * 2}/quality,q_90`,
    ) as string;

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <BlurView intensity={20} style={styles.blur}>
                <LinearGradient
                    colors={['#FF0000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Image
                        src={targetUrl}
                        width={size - 4}
                        height={size - 4}
                        style={[
                            styles.image,
                            { borderRadius: (size - 4) / 2 }
                        ]}
                    />
                </LinearGradient>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#FF0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    blur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        padding: 2,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        backgroundColor: '#1a1a1a',
    }
});
