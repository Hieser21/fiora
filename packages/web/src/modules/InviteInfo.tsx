/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import fetch from '../utils/fetch';
import Dialog from '../components/Dialog';
import Avatar from '../components/Avatar';

import Style from './InfoDialog.less';
import { State } from '../state/reducer';
import Button from '../components/Button';
import { joinGroup, getLinkmanHistoryMessages } from '../service';
import useAction from '../hooks/useAction';

type GroupBasicInfo = {
    name: string;
    avatar: string;
    members: number;
};

function InviteInfo() {
    const groupId = window.sessionStorage.getItem('inviteGroupId') || '';
    const action = useAction();
    const [visible, updateVisible] = useState(!!groupId);
    const [group, updateGroup] = useState<GroupBasicInfo>();
    const [largerAvatar, toggleLargetAvatar] = useState(false);
    const selfId = useSelector((state: State) => state.user?._id);
    const hasLinkman = useSelector((state: State) => !!state.linkmans[groupId]);

    useEffect(() => {
        if (!groupId) {
            return;
        }
        (async () => {
            const [error, groupInfo] = await fetch('getGroupBasicInfo', {
                groupId,
            });
            if (!error) {
                updateGroup((groupInfo as unknown) as GroupBasicInfo);
            }
        })();
    }, [groupId]);

    function clearInviteId() {
        window.sessionStorage.removeItem('inviteGroupId');
    }

    function handleClose() {
        updateVisible(false);
    }

    async function handleJoinGroup() {
        const groupRes = await joinGroup(groupId);
        if (groupRes) {
            groupRes.type = 'group';
            action.addLinkman(groupRes, true);

            const messages = await getLinkmanHistoryMessages(groupId, 0);
            if (messages) {
                action.addLinkmanHistoryMessages(groupId, messages);
            }
        }
        clearInviteId();
        handleClose();
    }

    function handleFocusGroup() {
        action.setFocus(groupId);
        clearInviteId();
        handleClose();
    }

    return (
        <Dialog
            className={Style.infoDialog}
            visible={visible}
            onClose={handleClose}
            title="You are invited to join the group."
        >
            {visible && group && (
                <div className={Style.coantainer}>
                    <div className={Style.header}>
                        <Avatar
                            size={60}
                            src={group.avatar}
                            onMouseEnter={() => toggleLargetAvatar(true)}
                            onMouseLeave={() => toggleLargetAvatar(false)}
                        />
                        <img
                            className={`${Style.largeAvatar} ${
                                largerAvatar ? 'show' : 'hide'
                            }`}
                            src={group.avatar}

                        />
                        <p>{group.name}</p>
                    </div>
                    <div className={Style.info}>
                        <div className={Style.onlineStatus}>
                            <p className={Style.onlineText}>member:</p>
                            <div>{group.members}people</div>
                        </div>
                        {selfId ? (
                            hasLinkman ? (
                                <Button onClick={handleFocusGroup}>
                                    Send a message
                                </Button>
                            ) : (
                                <Button onClick={handleJoinGroup}>
                                    Join group
                                </Button>
                            )
                        ) : (
                            <Button
                                onClick={() =>
                                    action.setStatus(
                                        'loginRegisterDialogVisible',
                                        true,
                                    )
                                }
                            >
                                Login/Register
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </Dialog>
    );
}

export default InviteInfo;
