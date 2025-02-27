"use server";

import connectMongo from "../../extdb";
import mongoose from "mongoose";
import Chat from "../models/chat.model";

export async function loadChats() {
    try {
        await connectMongo();
        // @ts-ignore
        const chats = await Chat.find({}).lean();
        return chats;
    } catch (error) {
        console.error(error);
        return [];
    }
}
