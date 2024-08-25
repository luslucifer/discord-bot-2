import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
// import { Browse } from './browser';
import { Db } from './db';
// import fs from 'fs'


// const l_arr = fs.readFileSync('links.txt','utf-8').split('\n')



dotenv.config();

const token = process.env.BOTTOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const channelId = '1236307259441545329';


client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    // Send a message every 4 minutes
    // setInterval(() => {
    //     const channel = client.channels.cache.get(channelId);
    //     if (channel && channel.isTextBased()) {
    //         (channel as TextChannel).send('This is a message sent every 4 minutes.');
    //     }
    // }, 1000*60*999); // 4 minutes in milliseconds
});

const re = /(https?:\/\/[^\s]+)/g;

client.on('messageCreate', async (message: Message) => {
    // Check if the message author is not a bot
    try {
        console.log(message.content);

        if (!message.author.bot) {
            const mContent = message.content;
            const match = mContent.match(re);

            if (match) {
                const url = new URL(match[0]);
                const p = new Db();
                const u: any = await p.main(url.toString());
                
                // Send the processed URL result
                if (u.length != 0 ){

                    await message.channel.send(`[${url.hostname}](${u})`);
                }
            } else {
                // No link found, send a message
                // await message.channel.send('No link found.');
            }
        }
    } catch (error) {
        console.log(error);
        // Send an error message
        // await message.channel.send(`An error occurred: ${error.message}`);
    }
});

client.login(token);
