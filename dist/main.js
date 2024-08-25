"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
// import { Browse } from './browser';
const db_1 = require("./db");
// import fs from 'fs'
// const l_arr = fs.readFileSync('links.txt','utf-8').split('\n')
dotenv_1.default.config();
const token = process.env.BOTTOKEN;
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
const channelId = '1236307259441545329';
client.once('ready', () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    // Send a message every 4 minutes
    // setInterval(() => {
    //     const channel = client.channels.cache.get(channelId);
    //     if (channel && channel.isTextBased()) {
    //         (channel as TextChannel).send('This is a message sent every 4 minutes.');
    //     }
    // }, 1000*60*999); // 4 minutes in milliseconds
});
const re = /(https?:\/\/[^\s]+)/g;
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the message author is not a bot
    try {
        console.log(message.content);
        if (!message.author.bot) {
            const mContent = message.content;
            const match = mContent.match(re);
            if (match) {
                const url = new URL(match[0]);
                const p = new db_1.Db();
                const u = yield p.main(url.toString());
                // Send the processed URL result
                if (u.length != 0) {
                    yield message.channel.send(`[${url.hostname}](${u})`);
                }
            }
            else {
                // No link found, send a message
                // await message.channel.send('No link found.');
            }
        }
    }
    catch (error) {
        console.log(error);
        // Send an error message
        // await message.channel.send(`An error occurred: ${error.message}`);
    }
}));
client.login(token);
