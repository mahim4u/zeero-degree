const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "auto",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Mahim Islam",
  description: "Auto video downloader",
  commandCategory: "utility",
  usages: "send video link",
  cooldowns: 3
};

// 🔥 AUTO DETECT LINK
module.exports.handleEvent = async ({ api, event }) => {
  try {
    const body = event.body ? event.body.trim() : "";
    if (!body || body.toLowerCase().startsWith("auto")) return;

    // 🎯 Detect link (uses regex so it doesn't break if there's text next to the link)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = body.match(urlRegex);
    if (!links) return;
    
    const videoUrl = links[0]; // Grab the actual link

    api.setMessageReaction("🔎", event.messageID, () => {}, true);

    // 🔹 API CALL
    const res = await axios.get(
      `https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(videoUrl)}`
    );

    const data = res.data?.data;
    if (!data || !data.high) {
      return api.setMessageReaction("❌", event.messageID, () => {}, true);
    }

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    // 🔹 Ensure cache directory exists to prevent ENOENT crashes
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    // 🔹 Unique file path (prevents corruption if multiple users download at once)
    const filePath = path.join(cacheDir, `auto_${Date.now()}_${event.messageID}.mp4`);

    // 🔹 DOWNLOAD VIDEO DIRECTLY TO STREAM (Saves RAM and prevents crashes)
    const videoResponse = await axios({
      method: "GET",
      url: data.high,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    videoResponse.data.pipe(writer);

    // Wait for the file to finish downloading completely
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // ✨ STYLISH SHORT MESSAGE
    const msg = {
      body: `🎬 𝐕𝐈𝐃𝐄𝐎 𝐑𝐄𝐀𝐃𝐘\n\n📌 ${data.title || "No title"}`,
      attachment: fs.createReadStream(filePath)
    };

    // 🔹 Send Message & Catch specific Facebook attachment errors
    api.sendMessage(msg, event.threadID, (err) => {
      // Always clean up the file after sending to save disk space
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      if (err) {
        console.error("Auto Video Send Error:", err);
        api.setMessageReaction("⚠️", event.messageID, () => {}, true);
        return api.sendMessage("⚠️ Video file might be too large for Messenger's 25MB limit!", event.threadID, event.messageID);
      }
      
      api.setMessageReaction("🕜", event.messageID, () => {}, true);
    }, event.messageID);

  } catch (err) {
    console.error("Auto Downloader Error:", err.message);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
  }
};

// 🔹 COMMAND MESSAGE
module.exports.run = async ({ api, event }) => {
  api.sendMessage(
    "🎬 Send any video link (https://...) and I’ll download it 😎",
    event.threadID,
    event.messageID
  );
};