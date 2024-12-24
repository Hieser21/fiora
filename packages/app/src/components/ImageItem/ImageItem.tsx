import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
    uri: string;
    width: number;
    height: number;
};

export default function ImageItem({ uri, width, height }: Props) {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri }}
                style={[styles.image, { width, height }]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1
    }
});
