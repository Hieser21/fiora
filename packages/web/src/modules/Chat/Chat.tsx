import React, { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { css } from 'linaria';
import Style from './Chat.less';
import HeaderBar from './HeaderBar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import GroupManagePanel from './GroupManagePanel';
import { State, GroupMember } from '../../state/reducer';
import { ShowUserOrGroupInfoContext } from '../../context';
import useIsLogin from '../../hooks/useIsLogin';
import {
    getGroupOnlineMembers,
    getUserOnlineStatus,
    updateHistory,
} from '../../service';
import useAction from '../../hooks/useAction';
import useAero from '../../hooks/useAero';
import store from '../../state/store';
const persona5Styles = css`
    .persona-panel {
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #ff0000;
        box-shadow: 5px 5px 0px #ff0000;
        transform: skew(-2deg);
        transition: all 0.3s ease;
    }

    .persona-text {
        color: #ffffff;
        font-family: 'Arial', sans-serif;
        text-shadow: 2px 2px #ff0000;
        letter-spacing: 1px;
    }

    .persona-button {
        background: #2b2b2b;
        color: #ff0000;
        border: 2px solid #ff0000;
        padding: 8px 16px;
        transform: skew(-5deg);
        transition: all 0.2s ease;

        &:hover {
            background: #ff0000;
            color: #ffffff;
            transform: skew(-5deg) scale(1.05);
        }
    }
`;

let lastMessageIdCache = '';

function Chat() {
    const isLogin = useIsLogin();
    const action = useAction();
    const hasUserInfo = useSelector((state: State) => !!state.user);
    const focus = useSelector((state: State) => state.focus);
    const linkman = useSelector((state: State) => state.linkmans[focus]);
    const [groupManagePanel, toggleGroupManagePanel] = useState(false);
    const context = useContext(ShowUserOrGroupInfoContext);
    const aero = useAero();
    const self = useSelector((state: State) => state.user?._id) || '';

    function handleBodyClick(e: MouseEvent) {
        const { currentTarget } = e;
        let target = e.target as HTMLDivElement;
        do {
            if (target.getAttribute('data-float-panel') === 'true') {
                return;
            }
            // @ts-ignore
            target = target.parentElement;
        } while (target && target !== currentTarget);
        toggleGroupManagePanel(false);
    }
    useEffect(() => {
        document.body.addEventListener('click', handleBodyClick, false);
        return () => {
            document.body.removeEventListener('click', handleBodyClick, false);
        };
    }, []);

    async function fetchGroupOnlineMembers() {
        let onlineMembers: GroupMember[] | { cache: true } = [];
        if (isLogin) {
            onlineMembers = await getGroupOnlineMembers(focus);
        }
        if (Array.isArray(onlineMembers)) {
            action.setLinkmanProperty(focus, 'onlineMembers', onlineMembers);
        }
    }
    async function fetchUserOnlineStatus() {
        const isOnline = await getUserOnlineStatus(focus.replace(self, ''));
        action.setLinkmanProperty(focus, 'isOnline', isOnline);
    }
    useEffect(() => {
        if (!linkman) {
            return () => {};
        }
        const request =
            linkman.type === 'group'
                ? fetchGroupOnlineMembers
                : fetchUserOnlineStatus;
        request();
        const timer = setInterval(() => request(), 1000 * 60);
        return () => clearInterval(timer);
    }, [focus]);

    async function intervalUpdateHistory() {
        // Must get real-time state
        const state = store.getState();
        if (
            !window.document.hidden &&
            state.focus &&
            state.linkmans[state.focus] &&
            state.user?._id
        ) {
            const messageKeys = Object.keys(
                state.linkmans[state.focus].messages,
            );
            if (messageKeys.length > 0) {
                const lastMessageId =
                    state.linkmans[state.focus].messages[
                        messageKeys[messageKeys.length - 1]
                    ]._id;
                if (lastMessageId !== lastMessageIdCache) {
                    lastMessageIdCache = lastMessageId;
                    await updateHistory(state.focus, lastMessageId);
                }
            }
        }
    }
    useEffect(() => {
        const timer = setInterval(intervalUpdateHistory, 1000 * 30);
        return () => clearInterval(timer);
    }, [focus]);

    if (!hasUserInfo) {
        return <div className={Style.chat} />;
    }
    if (!linkman) {
        return (
            <div className={Style.chat}>
                <HeaderBar id="" name="" type="" onClickFunction={() => {}} />
                <div className={Style.noLinkman}>
                    <div className={Style.noLinkmanImage} />
                    <h2 className={Style.noLinkmanText}>
                        Find a group or friends, otherwise how can we chat~~
                    </h2>
                </div>
            </div>
        );
    }

    async function handleClickFunction() {
        if (linkman.type === 'group') {
            let onlineMembers: GroupMember[] | { cache: true } = [];
            if (isLogin) {
                onlineMembers = await getGroupOnlineMembers(focus);
            }
            if (Array.isArray(onlineMembers)) {
                action.setLinkmanProperty(
                    focus,
                    'onlineMembers',
                    onlineMembers,
                );
            }
            toggleGroupManagePanel(true);
        } else {
            // @ts-ignore
            context.showUserInfo(linkman);
        }
    }

    return (
        <div className={`${Style.chat} ${persona5Styles}`} {...aero}>
            <HeaderBar
                id={linkman._id}
                name={linkman.name.toLocaleUpperCase()}
                type={linkman.type}
                onlineMembersCount={linkman.onlineMembers?.length}
                isOnline={linkman.isOnline}
                onClickFunction={handleClickFunction}
            />
            <MessageList />
            <ChatInput />

            {linkman.type === 'group' && (
                <GroupManagePanel
                    className="persona-panel"
                    visible={groupManagePanel}
                    onClose={() => toggleGroupManagePanel(false)}
                    groupId={linkman._id}
                    avatar={linkman.avatar}
                    creator={linkman.creator}
                    onlineMembers={linkman.onlineMembers}
                />
            )}
        </div>
    );
}

export default Chat;
