module.exports.config = {
  name: "kiss",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Mahim + ChatGPT",
  description: "Kiss meme with smart pairing",
  commandCategory: "fun",
  usages: "kiss @user / reply / auto",
  cooldowns: 5,
  dependencies: {
    axios: "",
    fs-extra: "",
    path: "",
    jimp: ""
  }
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Jimp = require("jimp");

// 🟣 Circle avatar
async function circle(imgPath) {
  const img = await Jimp.read(imgPath);
  img.circle();
  return await img.getBufferAsync("image/png");
}

// 🎨 Create image
async function makeImage(one, two) {
  const cache = path.join(__dirname, "cache");
  const bgPath = path.join(cache, "kiss_bg.png");

  if (!fs.existsSync(bgPath)) {
    const bg = await axios.get(
      "https://i.imgur.com/jnFNhj96ooUs.jpeg",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(bgPath, bg.data);
  }

  const avt1Path = path.join(cache, `avt_${one}.png`);
  const avt2Path = path.join(cache, `avt_${two}.png`);
  const outPath = path.join(cache, `kiss_${one}_${two}.png`);

  // avatars
  const a1 = await axios.get(
    `https://graph.facebook.com/${one}/picture?width=512&height=512`,
    { responseType: "arraybuffer" }
  );
  const a2 = await axios.get(
    `https://graph.facebook.com/${two}/picture?width=512&height=512`,
    { responseType: "arraybuffer" }
  );

  fs.writeFileSync(avt1Path, a1.data);
  fs.writeFileSync(avt2Path, a2.data);

  const bg = await Jimp.read(bgPath);
  const c1 = await Jimp.read(await circle(avt1Path));
  const c2 = await Jimp.read(await circle(avt2Path));

  c1.resize(150, 150);
  c2.resize(150, 150);

  bg.composite(c1, 100, 150);
  bg.composite(c2, 300, 150);

  await bg.writeAsync(outPath);

  fs.unlinkSync(avt1Path);
  fs.unlinkSync(avt2Path);

  return outPath;
}

// 🚀 MAIN
module.exports.run = async ({ event, api }) => {
  const { threadID, messageID, senderID, messageReply, mentions } = event;

  let one = senderID;
  let two;

  // 🎯 PRIORITY SYSTEM
  if (messageReply) {
    two = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    two = Object.keys(mentions)[0];
  } else {
    // 🧠 SMART RANDOM PAIRING
    const threadInfo = await api.getThreadInfo(threadID);
    const users = threadInfo.participantIDs.filter(id => id != senderID);

    if (users.length < 1) {
      return api.sendMessage("⚠️ Not enough users", threadID, messageID);
    }

    // pick random
    two = users[Math.floor(Math.random() * users.length)];
  }

  try {
    const img = await makeImage(one, two);

    const love = Math.floor(Math.random() * 100);
    const msg = `💋 ${one == senderID ? "You" : "Someone"} kissed 😏\n❤️ Love: ${love}%`;

    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(img)
      },
      threadID,
      () => fs.unlinkSync(img),
      messageID
    );
  } catch (e) {
    console.log(e);
    api.sendMessage("❌ Error: " + e.message, threadID, messageID);
  }
};