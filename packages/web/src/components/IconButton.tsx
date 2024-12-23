import React from 'react';
import { css } from 'linaria';
const iconButtonStyle = css`
   .iconButton {
    text-align: center;
    color: rgba(165, 181, 192, 1);
    cursor: pointer;

    &:hover {
        color: rgba(247, 247, 247, 1);
    }
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
