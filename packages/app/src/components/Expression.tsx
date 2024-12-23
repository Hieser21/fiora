import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Image from './Image';
import uri from '../assets/images/baidu.png';

type Props = {
    size: number;
    index: number;
    style?: any;
};

export default function Expression({ size, index, style }: Props) {
    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <BlurView intensity={15} tint="dark">
                <LinearGradient
                    colors={['#FF0000', '#2B2B2B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <View style={styles.imageWrapper}>
                        <Image
                            src={uri}
                            width={size - 4}
                            height={((size - 4) * 3200) / 64}
                            style={[
                                styles.image,
                                { marginTop: -(size - 4) * index }
                            ]}
                        />
                    </View>
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
        shadowColor: '#FF0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    gradient: {
        padding: 2,
    },
    imageWrapper: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        overflow: 'hidden',
    },
    image: {
        opacity: 0.9,
    }
});
