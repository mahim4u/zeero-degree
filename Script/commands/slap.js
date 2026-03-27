module.exports.config = {
  name: "slap",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Mahim + ChatGPT",
  description: "Smart slap meme 😏",
  commandCategory: "fun",
  usages: "slap @user / reply / auto",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = __dirname + "/cache/slap.gif";

  const { threadID, messageID, senderID, messageReply, mentions } = event;

  let target;
  let tagName = "";

  // 🎯 PRIORITY SYSTEM
  if (messageReply) {
    target = messageReply.senderID;
    tagName = "this person 😏";
  } else if (Object.keys(mentions).length > 0) {
    target = Object.keys(mentions)[0];
    tagName = mentions[target].replace("@", "");
  } else {
    // 🧠 AUTO RANDOM
    const threadInfo = await api.getThreadInfo(threadID);
    const users = threadInfo.participantIDs.filter(id => id != senderID);

    if (users.length === 0) {
      return api.sendMessage("⚠️ No one to slap 😢", threadID, messageID);
    }

    target = users[Math.floor(Math.random() * users.length)];
    tagName = "a random victim 😈";
  }

  try {
    // 🎬 GET GIF
    const res = await axios.get("https://api.waifu.pics/sfw/slap");
    const gifURL = res.data.url;

    // 💾 DOWNLOAD
    const buffer = (await axios.get(gifURL, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, buffer);

    // 💬 MESSAGE
    const msg = {
      body: `💢 Slapped ${tagName}!\n\n🦟 "Oops... thought it's mosquito 😭"`,
      attachment: fs.createReadStream(path),
      mentions: target
        ? [{ tag: tagName, id: target }]
        : []
    };

    api.sendMessage(msg, threadID, () => {
      fs.unlinkSync(path);
      api.setMessageReaction("😈", messageID, () => {}, true);
    }, messageID);

  } catch (e) {
    console.log(e);
    api.setMessageReaction("☹️", messageID, () => {}, true);
    api.sendMessage("❌ Failed to slap 😭", threadID, messageID);
  }
};