module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.2",
	credits: "Modified by ChatGPT",
	description: "Send a stylish English text message when someone leaves",
	dependencies: {}
};

module.exports.onLoad = function () {
	return;
};

module.exports.run = async function ({ api, event, Users, Threads }) {
	try {
		if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

		const { threadID } = event;

		const data =
			global.data.threadData.get(parseInt(threadID)) ||
			(await Threads.getData(threadID)).data;

		const name =
			global.data.userName.get(event.logMessageData.leftParticipantFbId) ||
			(await Users.getNameUser(event.logMessageData.leftParticipantFbId));

		const type =
			event.author == event.logMessageData.leftParticipantFbId
				? "𝗟𝗲𝗳𝘁 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽"
				: "𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽";

		let msg =
			typeof data.customLeave == "undefined"
				? "━━━━━━━━━━━━━━━\n" +
				  "🌸 𝗚𝗼𝗼𝗱𝗯𝘆𝗲, {name}\n" +
				  "━━━━━━━━━━━━━━━\n\n" +
				  "𝙒𝙚 𝙬𝙞𝙡𝙡 𝙢𝙞𝙨𝙨 𝙮𝙤𝙪.\n" +
				  "𝙎𝙩𝙖𝙮 𝙨𝙖𝙛𝙚 & 𝙝𝙖𝙥𝙥𝙮 💖\n\n" +
				  "📌 𝗦𝘁𝗮𝘁𝘂𝘀: {type}"
				: data.customLeave;

		msg = msg
			.replace(/\{name}/g, name)
			.replace(/\{type}/g, type);

		return api.sendMessage({ body: msg }, threadID);
	} catch (error) {
		console.error("Leave event error:", error);
	}
};