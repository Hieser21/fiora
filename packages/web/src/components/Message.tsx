import React from 'react';
import Notification from 'rc-notification';
import { css } from 'linaria';

import 'rc-notification/dist/rc-notification.min.css';
import Style from './Message.less';

const persona5Animation = css`
    @keyframes slideIn {
        from {
            transform: translateX(-100%) skew(-5deg);
            opacity: 0;
        }
        to {
            transform: translateX(0) skew(-5deg);
            opacity: 1;
        }
    }
`;

function showMessage(text: string, duration = 1500, type = 'success') {
    Notification.newInstance({
        style: { 
            top: 20,
            right: 20,
        }
    }, (notification: any) => {
        notification.notice({
            content: (
                <div className={`${Style.componentMessage} ${persona5Animation}`}>
                    <i className={`iconfont icon-${type}`} />
                    <span className={Style.messageText}>{text}</span>
                </div>
            ),
            duration,
            style: {
                animation: 'slideIn 0.3s ease forwards'
            }
        });
    });
}

export default {
    success(text: string, duration = 1.5) {
        showMessage(text, duration, 'success');
    },
    error(text: string, duration = 1.5) {
        showMessage(text, duration, 'error');
    },
    warning(text: string, duration = 1.5) {
        showMessage(text, duration, 'warning');
    },
    info(text: string, duration = 1.5) {
        showMessage(text, duration, 'info');
    },
};
