import React from 'react';
import { css } from 'linaria';

const button = css`
    border: none;
    background-color: #2b2b2b;
    color: #ffffff;
    border: 2px solid #ff0000;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    transform: skew(-5deg);
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 3px 3px 0 #000000;
    cursor: pointer;
    user-select: none !important;

    &:hover {
        transform: skew(-5deg) translateY(-2px);
        box-shadow: 5px 5px 0 #000000;
        background-color: #ff0000;
    }

    &:active {
        transform: skew(-5deg) translateY(1px);
        box-shadow: 2px 2px 0 #000000;
    }

    &.danger {
        border-color: #ffffff;
        background-color: #ff0000;
        
        &:hover {
            background-color: #ffffff;
            color: #ff0000;
            border-color: #ff0000;
        }
    }
`;

type Props = {
    type?: string;
    children: string;
    className?: string;
    onClick?: () => void;
};

function Button({
    type = 'primary',
    children,
    className = '',
    onClick,
}: Props) {
    return (
        <button
            className={`${button} ${type} ${className}`}
            type="button"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;
