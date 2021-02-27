const Discord = require("discord.js");
const client = new Discord.Client();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { parser, htmlOutput, toHTML } = require("discord-markdown");
const emoji = require("discord-emoji-converter");

io.on("connection", (socket) => {
	io.emit("message", {author: "Welcome bot", content: "Hello! Welcome to discord unblocked! Send something to any channel this bot is in!", time: (new Date).toString(), color: "00bbbb", attachments: []})
  io.emit("channels", h)
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});
var channel;
var h={}
app.get("/send", (req, res) => {
  console.log(req.query);
  try {
    if (req.query.password === process.env.PASSWORD) {
      res.send("Sent!");
      
      channel=client.channels.cache.get(req.query.c);
      channel.send(req.query.q);
    } else {
      res.send("Invalid password!");
      console.log("Invalid password");
    }
  } catch (e) {
    console.error(e.stack);
    res.send("Error sending message! \n\n" + e.stack);
  }
});

client.on("ready", () => {
  channel = client.channels.cache.get("798550831292874815");
  
  for (let value of client.channels.cache.entries()) {
    if (value[1].type === "text") {
      h[value[1].guild.name + ": " + value[1].name] = value[1].id;
    }
  }
  console.log(h)
  //console.log(client.channels.cache.entries().next().value[1].name)
});
client.on("message", function (message) {
  findUser = (id) => {
    return client.users.cache.find((u) => u.id === id);
  };
	if (message.content.includes('change-nick ')) {
			message.guild.me.setNickname(message.content.replace("change-nick  ", ""))
			return message.channel.send('Changed!');
	}
  if (message.content === "ping" && !message.author.bot) {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }
  let attachments = message.attachments
  io.emit("message", {
    author: message.author.tag,
		time: (new Date).toString(),
    content: toHTML(emoji.emojify(message.content), {
      discordCallback: {
        user: (node) => "<b>@" + findUser(node.id).username + "</b>",
      },
    }),
    color: message.member ? message.member.displayHexColor : "#fff",
    attachments: attachments,
		channel: message.channel.id
  });
  for (let embed of message.embeds) {
	//Just `embed` is fine, go to index.html now
  
  io.emit("embed", embed)
}

  app.get("/send", (req, res) => {
    channel.send(req.query.q);
  });
});
client.login(process.env.BOT_TOKEN);
http.listen(3000, () => {
  console.log("Exploding on port 3000");
});
