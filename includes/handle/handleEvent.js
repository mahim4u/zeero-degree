module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    const moment = require("moment-timezone"); // Fixed to support .tz()

    return function ({ event }) {
        const timeStart = Date.now();
        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;
        
        const senderID = String(event.senderID);
        const threadID = String(event.threadID);

        // Fast exit: Check bans and inbox settings immediately
        if (userBanned.has(senderID) || threadBanned.has(threadID) || (!allowInbox && senderID === threadID)) {
            return;
        }

        if (event.type === "change_thread_image") {
            event.logMessageType = "change_thread_image";
        }

        // 🚀 OPTIMIZATION: Create the object once outside the loop to save memory
        const contextObj = { api, event, models, Users, Threads, Currencies };

        // 🚀 OPTIMIZATION: Extract 'eventRun' directly from the loop values
        for (const [, eventRun] of events.entries()) {
            
            if (eventRun.config.eventType.includes(event.logMessageType)) {
                try {
                    // Run the event with the pre-built object
                    eventRun.run(contextObj);

                    // 🚀 OPTIMIZATION: Only calculate time if DeveloperMode is actually on
                    if (DeveloperMode) {
                        const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
                        logger(global.getText('handleEvent', 'executeEvent', time, eventRun.config.name, threadID, Date.now() - timeStart), '[ Event ]');
                    }
                } catch (error) {
                    logger(global.getText('handleEvent', 'eventError', eventRun.config.name, JSON.stringify(error)), "error");
                }
            }
        }
    };
};
