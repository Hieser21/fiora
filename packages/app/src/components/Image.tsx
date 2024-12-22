import React from 'react';
import { Image as BaseImage, ImageSourcePropType } from 'react-native';
import { getOSSFileUrl } from '../utils/uploadFile';
import { referer } from '../utils/constant';

type Props = {
    src: string;
    width?: string | number;
    height?: string | number;
    style?: any;
};

export default function Image({
    src,
    width = '100%',
    height = '100%',
    style,
}: Props) {
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
        <BaseImage 
            source={source} 
            style={[
                {
                    width,
                    height,
                    borderWidth: 2,
                    borderColor: '#FF0000',
                    shadowColor: '#FF0000',
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.6,
                    shadowRadius: 3,
                    transform: [{ skewX: '-5deg' }]
                },
                style
            ]} 
        />
    );
}
