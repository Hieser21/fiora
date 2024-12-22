import React from 'react';
import { css } from 'linaria';
const iconButtonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2b2b2b;
    border: 2px solid #ff0000;
    transform: skew(-5deg);
    transition: all 0.3s ease;
    box-shadow: 3px 3px 0 #000000;
    cursor: pointer;

    &:hover {
        transform: skew(-5deg) translateY(-2px);
        box-shadow: 5px 5px 0 #000000;
        background-color: #ff0000;
        
        i {
            color: #ffffff;
        }
    }

    i {
        color: #ff0000;
        transition: color 0.3s ease;
    }
`;

type Props = {
    width: number;
    height: number;
    icon: string;
    iconSize: number;
    className?: string;
    style?: Object;
    onClick?: () => void;
};

function IconButton({
    width,
    height,
    icon,
    iconSize,
    onClick = () => {},
    className = '',
    style = {},
}: Props) {
    return (
        <div
            className={`${iconButtonStyle} ${className}`}
            style={{ width, height, ...style }}
            onClick={onClick}
            role="button"
        >
            <i
                className={`iconfont icon-${icon}`}
                style={{ fontSize: iconSize, lineHeight: `${height}px` }}
            />
        </div>
    );
}

export default IconButton;
