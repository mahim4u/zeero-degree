const axios = require("axios");
const { loadImage, createCanvas, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "joinNoti",
	eventType: ["log:subscribe"],
	version: "1.0.2",
	credits: "MAHIM ISLAM",
	description: "Bot and user welcome message system with canvas images",
	dependencies: {
		"fs-extra": "",
		"canvas": "",
		"axios": ""
	}
};

// Function to apply text with auto-sizing
const applyText = (canvas, text, maxWidth = canvas.width - 300) => {
	const ctx = canvas.getContext("2d");
	let fontSize = 70;

	do {
		ctx.font = `bold ${fontSize -= 10}px "Arial"`;
	} while (ctx.measureText(text).width > maxWidth && fontSize > 20);

	return ctx.font;
};

// Create welcome canvas image
const createWelcomeImage = async (userName, userAvatarURL, threadName) => {
	try {
		const canvas = createCanvas(1024, 500);
		const ctx = canvas.getContext("2d");

		// Load and draw background
		const backgroundURL = "https://images.unsplash.com/photo-1557672172-298e090d0f80?w=1024&h=500&fit=crop";
		const background = await loadImage(backgroundURL);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		// Add dark overlay
		ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw decorative border
		ctx.strokeStyle = "#FF6B9D";
		ctx.lineWidth = 5;
		ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

		// Welcome text
		ctx.font = "bold 60px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.fillText("Welcome to", 100, 100);

		// Thread name
		ctx.font = "bold 50px Arial";
		ctx.fillStyle = "#FF6B9D";
		ctx.fillText(threadName, 100, 160);

		// User avatar circle
		try {
			const avatar = await loadImage(userAvatarURL);
			ctx.save();
			ctx.beginPath();
			ctx.arc(200, 350, 90, 0, Math.PI * 2);
			ctx.strokeStyle = "#FF6B9D";
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.clip();
			ctx.drawImage(avatar, 110, 260, 180, 180);
			ctx.restore();
		} catch (err) {
			console.log("⚠️ Could not load avatar image:", err.message);
		}

		// User name
		ctx.font = applyText(canvas, userName);
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.fillText(userName, 320, 360);

		// Decorative elements
		ctx.fillStyle = "#FF6B9D";
		ctx.beginPath();
		ctx.arc(850, 100, 50, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "#FFD700";
		ctx.beginPath();
		ctx.arc(950, 400, 40, 0, Math.PI * 2);
		ctx.fill();

		// Bottom message
		ctx.font = "bold 28px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.fillText("🎉 Have fun and enjoy! 🎉", canvas.width / 2, canvas.height - 30);

		return canvas.toBuffer();
	} catch (error) {
		console.log("❌ Error creating welcome image:", error);
		return null;
	}
};

module.exports.run = async function({ api, event, Threads }) {
	const { threadID } = event;
	const data = (await Threads.getData(threadID)).data || {};
	const checkban = data.banOut;

	if (Array.isArray(checkban) && checkban.length > 0) return;

	// ➤ Bot Join Welcome
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		const botName = "Mahim";
		const prefix = global.config.PREFIX;

		// Set nickname for bot
		await api.changeNickname(`${botName}`, threadID, api.getCurrentUserID());

		const botMessage = `🤖 𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 ✔️\n\n📋 Use "${prefix}help" to see all commands!`;

		try {
			await api.sendMessage({ body: botMessage }, threadID);
		} catch (err) {
			console.log("❌ Error sending bot welcome:", err);
		}
	}

	// ➤ User Join Welcome with Canvas Image
	else {
		try {
			let { threadName, participantIDs } = await api.getThreadInfo(threadID);
			const threadData = global.data.threadData.get(parseInt(threadID)) || {};
			const mentions = [];
			const nameArray = [];

			for (const user of event.logMessageData.addedParticipants) {
				const userName = user.fullName;
				const userID = user.userFbId;
				nameArray.push(userName);
				mentions.push({ tag: userName, id: userID });
			}

			// Create welcome message
			let msg = threadData.customJoin || 
`‎🦋🍒 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 ${threadName} 🎀💗💪🏼 🍒🦋 \n\n
𝖣𝖾𝖺𝖗 {name},  
𝐆𝐥𝐚𝐝 𝐭𝐨 𝐡𝐚𝐯𝐞 𝐲𝐨𝐮 𝐡𝐞𝐫𝐞! 𝐋𝐞𝐭'𝐬 𝐜𝐨𝐧𝐧𝐞𝐜𝐭 & 𝐬𝐡𝐚𝐫𝐞. 😊👋  \n\n
🖤🍒 𝐄𝐧𝐣𝐨𝐲 𝐲𝐨𝐮𝐫 𝐝𝐚𝐲! 🍒🖤`;

			msg = msg
				.replace(/\{name}/g, nameArray.join(', '))
				.replace(/\{type}/g, nameArray.length > 1 ? 'friends' : 'you')
				.replace(/\{soThanhVien}/g, participantIDs.length)
				.replace(/\{threadName}/g, threadName);

			// Create canvas image for first user (or all if needed)
			const firstUser = event.logMessageData.addedParticipants[0];
			const userName = firstUser.fullName;
			
			// Get user profile picture
			let userAvatarURL = null;
			try {
				const userInfo = await api.getUserInfo(firstUser.userFbId);
				if (userInfo && userInfo[firstUser.userFbId] && userInfo[firstUser.userFbId].thumbSrc) {
					userAvatarURL = userInfo[firstUser.userFbId].thumbSrc;
				}
			} catch (err) {
				console.log("⚠️ Could not fetch user avatar:", err.message);
				userAvatarURL = `https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=${firstUser.userFbId}&height=300&width=300&ext=1234567890&hash=AeS-cuWqe`;
			}

			// Create canvas image
			const canvasBuffer = await createWelcomeImage(userName, userAvatarURL, threadName);

			if (canvasBuffer) {
				// Send message with canvas image
				await api.sendMessage({
					body: msg,
					mentions,
					attachment: canvasBuffer
				}, threadID);
			} else {
				// Fallback: send message without image
				await api.sendMessage({
					body: msg,
					mentions
				}, threadID);
			}

		} catch (e) {
			console.log("❌ Error in user welcome:", e);
			try {
				// Fallback message if canvas fails
				const { threadName } = await api.getThreadInfo(threadID);
				await api.sendMessage({
					body: `🎉 Welcome to ${threadName}! 🎉`
				}, threadID);
			} catch (err) {
				console.log("❌ Fallback error:", err);
			}
		}
	}
};