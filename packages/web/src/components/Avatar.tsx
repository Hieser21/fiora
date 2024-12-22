import React, { SyntheticEvent, useState, useMemo } from 'react';
import { getOSSFileUrl } from '../utils/uploadFile';
import { css } from 'linaria';

export const avatarFailback = '/avatar/0.jpg';

const persona5Style = css`
    transition: all 0.3s ease;
    border: 3px solid #ff0000;
    box-shadow: 3px 3px 0 #000000;
    transform: skew(-5deg);
    
    &:hover {
        transform: skew(-5deg) scale(1.1);
        box-shadow: 5px 5px 0 #000000;
        border-color: #ffffff;
    }
`;

type Props = {
    src: string;
    size?: number;
    className?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

function Avatar({
    src,
    size = 60,
    className = '',
    onClick,
    onMouseEnter,
    onMouseLeave,
}: Props) {
    const [failTimes, updateFailTimes] = useState(0);

    function handleError(e: SyntheticEvent<HTMLImageElement>) {
        if (failTimes >= 2) {
            return;
        }
        e.currentTarget.src = avatarFailback;
        updateFailTimes(failTimes + 1);
    }

    const url = useMemo(() => {
        if (/^(blob|data):/.test(src)) {
            return src;
        }
        
        return getOSSFileUrl(
            src,
            `image/resize,w_${size * 2},h_${size * 2}/quality,q_90`,
        );
    }, [src]);

    return (
        <img
            className={`${persona5Style} ${className}`}
            style={{ 
                width: size, 
                height: size, 
                borderRadius: size / 2,
                backgroundColor: '#2b2b2b'
            }}
            src={url}
            alt=""
            onClick={onClick}
            onError={handleError}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    );
}

export default Avatar;
