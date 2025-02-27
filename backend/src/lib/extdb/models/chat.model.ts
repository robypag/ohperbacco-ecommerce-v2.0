import { Message } from "ai";
import { model, models, Schema, Document } from "mongoose";

export interface IMongoChat {
    _id: string;
    createdAt: Date;
    userId: string;
    messages: Message[];
}

const ChatSchema = new Schema<IMongoChat>(
    {
        _id: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: new Date(),
        },
        userId: String,
        messages: Array<Message>,
    },
    {
        toJSON: {
            versionKey: false,
            virtuals: false,
        },
    },
);

const Chat = models.Chat || model("Chat", ChatSchema);
export default Chat;
