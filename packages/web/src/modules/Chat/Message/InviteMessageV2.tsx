import React, { useState } from 'react';
import Style from './InviteMessage.less';
import { joinGroup, getLinkmanHistoryMessages } from '../../../service';
import useAction from '../../../hooks/useAction';
import Message from '../../../components/Message';

interface InviteMessageProps {
    inviteInfo: string;
}

function InviteMessage(props: InviteMessageProps) {
    const { inviteInfo } = props;
    const invite = JSON.parse(inviteInfo);
    const [isHovered, setIsHovered] = useState(false);
    const action = useAction();

    async function handleJoinGroup() {
        const group = await joinGroup(invite.group);
        if (group) {
            group.type = 'group';
            action.addLinkman(group, true);
            Message.success('INFILTRATION SUCCESSFUL');
            const messages = await getLinkmanHistoryMessages(invite.group, 0);
            if (messages) {
                action.addLinkmanHistoryMessages(invite.group, messages);
            }
        }
    }

    return (
        <div
            className={Style.inviteMessage}
            onClick={handleJoinGroup}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            style={{
                transform: isHovered ? 'skew(-5deg) translateY(-4px)' : 'skew(-5deg)',
                transition: 'all 0.2s cubic-bezier(0.7, 0, 0.3, 1)'
            }}
        >
            <div className={Style.info}>
                <i className="iconfont icon-group" style={{
                    fontSize: '24px',
                    color: '#ff0000',
                    textShadow: '2px 2px 0 #000000',
                    marginRight: '8px'
                }} />
                <span className={Style.infoText}>
                    {invite.inviterName} REQUESTS YOUR PRESENCE IN「{invite.groupName}」
                </span>
            </div>
            <p className={Style.join}>INFILTRATE</p>
        </div>
    );
}

export default InviteMessage;
