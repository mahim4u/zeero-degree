module.exports.config = {
  name: "chor",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Mahim Islam (fixed by ChatGPT)",
  description: "Funny chor meme with avatar",
  commandCategory: "fun",
  usages: "@mention / reply",
  cooldowns: 5,
};

module.exports.run = async ({ event, api }) => {
	try {
		const Canvas = global.nodemodule['canvas'];
		const request = global.nodemodule["node-superfetch"];
		const fs = global.nodemodule["fs-extra"];

		const path = __dirname + '/cache/chor.png';

		// 🔥 USER DETECTION
		let id = event.senderID;
		if (event.type === "message_reply") {
			id = event.messageReply.senderID;
		} else if (Object.keys(event.mentions).length > 0) {
			id = Object.keys(event.mentions)[0];
		}

		// 🎭 RANDOM FUNNY CAPTIONS (goes into the message body)
		const captions = [
			"মুরগির দুধ চুরি করতে গিয়া ধরা খাইছে..! 🐸",
			"চোর ধরা পড়ছে লাইভে 😭",
			"ধরা খাইছে বেটা! এখন কি বলবি? 🤡",
			"এত চুরি করিস কেন রে ভাই 💀",
			"পুলিশ ডাকবো নাকি? 🚓",
			"চুরি করতে গিয়ে ক্যামেরায় ধরা 😭",
			"এবার তো শেষ! 🤣",
			"চোরের ১০ দিন, গৃহস্থের ১ দিন 😏",
			"বাবা রে! হাতে নাতে ধরা 😆",
			"এই মুখটাই চোরের মুখ 🐸👻"
		];

		const randomCaption = captions[Math.floor(Math.random() * captions.length)];

		// 🎨 CANVAS SETUP
		const canvas = Canvas.createCanvas(500, 670);
		const ctx = canvas.getContext('2d');

		// Fetch background and avatar
		const background = await Canvas.loadImage("https://i.imgur.com/ES28alv.png");
		const avatarResponse = await request.get(
			`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
		);
		const avatarImg = await Canvas.loadImage(avatarResponse.body);

		// 🖼 DRAW BACKGROUND
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		// 🔵 DRAW CIRCULAR AVATAR (Built-in method, no external function needed)
		ctx.save();
		ctx.beginPath();
		// arc(x_center, y_center, radius, startAngle, endAngle)
		ctx.arc(48 + 111 / 2, 410 + 111 / 2, 111 / 2, 0, Math.PI * 2);
		ctx.clip(); // Creates a circular clipping mask
		ctx.drawImage(avatarImg, 48, 410, 111, 111);
		ctx.restore();

		// 💾 SAVE TO CACHE
		const buffer = canvas.toBuffer();
		fs.writeFileSync(path, buffer);

		// 📤 SEND MESSAGE
		api.sendMessage(
			{
				body: `😂 ${randomCaption}`,
				attachment: fs.createReadStream(path)
			},
			event.threadID,
			() => {
				// Clean up the cache file after sending to save storage
				if (fs.existsSync(path)) fs.unlinkSync(path);
			},
			event.messageID
		);

	} catch (e) {
		console.error(e); // Logs the exact error to your console for debugging
		api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
	}
};