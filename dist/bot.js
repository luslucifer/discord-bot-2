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
const x_1 = require("./x");
dotenv_1.default.config();
const token = process.env.BOTTOKEN;
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
client.once('ready', () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
});
const re = /(https?:\/\/[^\s]+)/g;
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the message author is you
    if (!message.author.bot) {
        const mContent = message.content;
        const match = mContent.match(re);
        if (match) {
            const url = new URL(match[0]);
            const p = new x_1.P();
            const u = yield p.p(url.origin);
            message.channel.send(u);
        }
        // message.channel.send(`Mimic: ${message.content}`);
    }
}));
client.login(token);
