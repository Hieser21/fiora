import React, { useState } from 'react';
import { getPerRandomColor } from '@fiora/utils/getRandomColor';
import { css } from 'linaria';

const styles = {
    system: css`
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        transform: skew(-5deg);
        position: relative;

        &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #ff0000 30%, #ff0000 70%, transparent 100%);
            left: 0;
            top: 50%;
            transform: skew(-35deg) translateY(-50%);
            z-index: -1;
        }

        &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #000000 20%, #000000 80%, transparent 100%);
            left: 0;
            top: 60%;
            transform: skew(-45deg) translateY(-50%);
            z-index: -2;
        }
    `,
    container: css`
        background-color: #2b2b2b;
        padding: 8px 16px;
        border: 2px solid #ff0000;
        box-shadow: 3px 3px 0 #000000;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: bold;
        text-shadow: 1px 1px 0 #000000;
        transition: all 0.3s cubic-bezier(0.7, 0, 0.3, 1);

        &:hover {
            transform: translateY(-2px);
            box-shadow: 5px 5px 0 #000000;
        }
    `,
    username: css`
        font-weight: bold;
        letter-spacing: 2px;
        text-shadow: 1px 1px 0 #000000;
    `
};

interface SystemMessageProps {
    message: string;
    username: string;
}

function SystemMessage({ message, username }: SystemMessageProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={styles.system}>
            <div 
                className={styles.container}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <span 
                    className={styles.username}
                    style={{ color: getPerRandomColor(username) }}
                >
                    {username}
                </span>
                &nbsp;
                <span style={{ color: '#ffffff' }}>
                    {message}
                </span>
            </div>
        </div>
    );
}

export default SystemMessage;
