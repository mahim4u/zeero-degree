module.exports.config = {
	name: "offbot",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "Admin",
	description: "turn the bot off",
	commandCategory: "system",
	cooldowns: 0
};

module.exports.run = ({event, api, args}) => {
    const permission = ["100088769563815"];
    
    // Check if the user has admin permission
    if (!permission.includes(event.senderID)) {
        return api.sendMessage("[ ERR ] Oopsie! 🙈 Only admin can use this command.", event.threadID, event.messageID);
    }

    // Check if the command is ".offbot no"
    if (args && args.join(" ").toLowerCase() === "no") {
        return api.sendMessage("[ OK ] I'm already awake and running! ☀️ I will stay online.", event.threadID, event.messageID);
    }
    
    // Default action: turn the bot off
    api.sendMessage(`[ OK ] Nighty night! 🌙 ${global.config.BOTNAME} is now taking a nap and turning off. (To wake me back up, you'll need to restart the host or console! 🚀)`, event.threadID, () => process.exit(0));
}
