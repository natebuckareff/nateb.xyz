import { env } from './env';
import { MessageStorage } from './message/message-storage';

export const messageService = new MessageStorage({
    filename: env.get('SQLITE_FILENAME'),
});
