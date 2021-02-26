const Discord = require("discord.js");
const client = new Discord.Client();
const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {
    parser,
    htmlOutput,
    toHTML
} = require('discord-markdown');
const emoji = require('discord-emoji-converter')


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})
app.get("/send", (req, res) => {
    try {
        if (req.query.password === process.env.PASSWORD) {
            res.send("Sent!")
            channel.send(req.query.q)
        } else {
            res.send("Invalid password!")
            console.log("Invalid password");
        }
    } catch (e) {
        console.error(e.stack);
        res.send("Error sending message! \n\n" + e.stack)
    }
})
var channel;
client.on("ready", () => {
    channel = client.channels.cache.get('789662825215426568');
})
client.on("message", function(message) {
    test = (id) => {
        return client.users.cache.find(u => u.id === id)
    }
    if (message.content === "ping" && !message.author.bot) {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }
    io.emit("message", {
        author: message.author.tag,
        content: toHTML(emoji.emojify(message.content), {
            discordCallback: {
                user: node => '@' + test(node.id).username
            }
        }),
        color: message.member.displayHexColor
    });
    app.get("/send", (req, res) => {
        channel.send(req.query.q)
    });
});

client.login(process.env.BOT_TOKEN);
http.listen(3000, () => {
    console.log('Exploding on port 3000');
});