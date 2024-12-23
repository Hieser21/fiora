import { isValidObjectId, Types } from '@fiora/database/mongoose';
import assert from 'assert';
import User from '@fiora/database/mongoose/models/user';
import Group from '@fiora/database/mongoose/models/group';
import Message from '@fiora/database/mongoose/models/message';
import { createOrUpdateHistory } from '@fiora/database/mongoose/models/history';

export async function updateHistory(
    ctx: Context<{ userId: string; linkmanId: string; messageId: string }>,
) {
    const { linkmanId, messageId } = ctx.data;
    const self = ctx.socket.user.toString();
    if (!Types.ObjectId.isValid(messageId)) {
        return {
            msg: `not update with invalid messageId:${messageId}`,
        };
    }

    // @ts-ignore
    const [user, linkman, message] = await Promise.all([
        User.findOne({ _id: self }),
        isValidObjectId(linkmanId)
            ? Group.findOne({ _id: linkmanId })
            : User.findOne({ _id: linkmanId.replace(self, '') }),
        Message.findOne({ _id: messageId }),
    ]);
    assert(user, 'User does not exist');
    assert(linkman, 'Contact does not exist');
    assert(message, 'message does not exist');

    await createOrUpdateHistory(self, linkmanId, messageId);

    return {
        msg: 'ok',
    };
}
