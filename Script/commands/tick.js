const axios = require("axios");

module.exports.config = {
    name: "tick",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "MahimCraft",
    description: "Search TikTok videos with interactive UI, thumbnails, and pagination",
    commandCategory: "Media",
    usages: "[keyword]",
    cooldowns: 5
};

// Helper function to fetch files as streams with bypass headers
async function getStream(url, tempName) {
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
        headers: {
            // These headers prevent the API or TikTok from blocking the bot's request
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Referer': 'https://www.tiktok.com/'
        }
    });
    response.data.path = tempName;
    return response.data;
}

module.exports.run = async function({ api, event, args }) {
    const query = args.join(" ");
    if (!query) {
        api.setMessageReaction("❓", event.messageID, () => {}, true);
        return api.sendMessage("🍓 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝗸𝗲𝘆𝘄𝗼𝗿𝗱 𝘁𝗼 𝘀𝗲𝗮𝗿𝗰𝗵! 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: .𝘁𝗶𝗰𝗸 𝗳𝘂𝗻𝗻𝘆 𝗰𝗮𝘁𝘀", event.threadID, event.messageID);
    }

    // Search reaction
    api.setMessageReaction("🔍", event.messageID, () => {}, true);

    try {
        // Using the reliable TikWM search API endpoint, asking for 30 results to allow pagination
        const apiUrl = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=30`;
        const res = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const responseData = res.data;
        let results = [];
        
        // Ensure we safely target the correct JSON array based on TikWM's structure
        if (responseData.data && Array.isArray(responseData.data.videos)) {
            results = responseData.data.videos;
        } else if (responseData.data && Array.isArray(responseData.data)) {
            results = responseData.data;
        }

        if (!results || results.length === 0) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            return api.sendMessage("🍒🍓 𝗡𝗼 𝘃𝗶𝗱𝗲𝗼𝘀 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿 𝘆𝗼𝘂𝗿 𝗸𝗲𝘆𝘄𝗼𝗿𝗱. 𝗧𝗿𝘆 𝗮𝗻𝗼𝘁𝗵𝗲𝗿 𝗼𝗻𝗲! ‧₊˚🩰🍃", event.threadID, event.messageID);
        }

        // Trigger the first page
        await sendPage(api, event, results, 1, query);

    } catch (error) {
        console.error("TikTok Search Error:", error);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        api.sendMessage("🍒🍓 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗵𝗲 𝘃𝗶𝗱𝗲𝗼𝘀. 𝗧𝗵𝗲 𝗔𝗣𝗜 𝗺𝗶𝗴𝗵𝘁 𝗯𝗲 𝗿𝗮𝘁𝗲-𝗹𝗶𝗺𝗶𝘁𝗲𝗱 𝗿𝗶𝗴𝗵𝘁 𝗻𝗼𝘄. ‧₊˚🩰🍃", event.threadID, event.messageID);
    }
};

// Function to handle sending different pages
async function sendPage(api, event, results, page, query) {
    const itemsPerPage = 6;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = results.slice(startIndex, endIndex);

    if (pageItems.length === 0) {
        return api.sendMessage("🍒🍓 𝗡𝗼 𝗺𝗼𝗿𝗲 𝗿𝗲𝘀𝘂𝗹𝘁𝘀 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗼𝗻 𝘁𝗵𝗶𝘀 𝗽𝗮𝗴𝗲. ‧₊˚🩰🍃", event.threadID, event.messageID);
    }

    let messageBody = `✨ 𝗧𝗶𝗸𝗧𝗼𝗸 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀 ✨\n🔍 𝗞𝗲𝘆𝘄𝗼𝗿𝗱: "${query}"\n📄 𝗣𝗮𝗴𝗲: ${page}\n\n`;
    let attachments = [];

    // Loop through the 6 items to build text and fetch thumbnails
    for (let i = 0; i < pageItems.length; i++) {
        const item = pageItems[i];
        
        // Grab title/description, fallback if missing, and cut it off if it's too long
        let title = item.title || item.desc || "No title";
        title = title.length > 37 ? title.substring(0, 37) + "..." : title;
        
        const duration = item.duration ? `${item.duration}s` : "Unknown"; 
        
        messageBody += `[${i + 1}] 🎬 ${title}\n⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${duration}\n\n`;
        
        try {
            // TikWM usually provides images in 'cover' or 'origin_cover'
            const coverUrl = item.cover || item.origin_cover; 
            if (coverUrl) {
                const stream = await getStream(coverUrl, `thumb_${i}.jpg`);
                attachments.push(stream);
            }
        } catch (e) {
            console.log("Failed to load a thumbnail for item", i);
        }
    }

    messageBody += `📌 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲:\n👉 [1-${pageItems.length}] 𝘁𝗼 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝘁𝗵𝗲 𝘃𝗶𝗱𝗲𝗼\n👉 "n" 𝗳𝗼𝗿 𝗻𝗲𝘅𝘁 𝗽𝗮𝗴𝗲\n👉 "p" 𝗳𝗼𝗿 𝗽𝗿𝗲𝘃𝗶𝗼𝘂𝘀 𝗽𝗮𝗴𝗲`;

    api.sendMessage(
        { body: messageBody, attachment: attachments },
        event.threadID,
        (err, info) => {
            if (err) return console.error("Send Error:", err);
            
            // Success reaction
            api.setMessageReaction("✅", event.messageID, () => {}, true);

            // Save the data to global cache so handleReply can catch the user's response
            global.client.handleReply.push({
                name: "tick", 
                messageID: info.messageID,
                author: event.senderID,
                results: results,
                page: page,
                query: query,
                pageItems: pageItems
            });
        },
        event.messageID
    );
}

module.exports.handleReply = async function({ api, event, handleReply }) {
    // Only allow the original person who searched to reply
    if (event.senderID !== handleReply.author) return;

    const reply = event.body.toLowerCase().trim();
    const { results, page, query, pageItems, messageID } = handleReply;

    // 🧹 AUTO-UNSEND: Clear the massive chat interface immediately
    api.unsendMessage(messageID).catch(err => console.error("Unsend Error:", err));

    // Pagination: Next Page
    if (reply === 'n') {
        return sendPage(api, event, results, page + 1, query);
    } 
    
    // Pagination: Previous Page
    if (reply === 'p') {
        if (page === 1) return api.sendMessage("🍒🍓 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗼𝗻 𝘁𝗵𝗲 𝗳𝗶𝗿𝘀𝘁 𝗽𝗮𝗴𝗲! ‧₊˚🩰🍃", event.threadID, event.messageID);
        return sendPage(api, event, results, page - 1, query);
    }

    // Video Selection: 1 to 6
    const choice = parseInt(reply);
    if (!isNaN(choice) && choice >= 1 && choice <= pageItems.length) {
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        const selectedVideo = pageItems[choice - 1];

        // Send friendly downloading text and catch the info to delete it later
        api.sendMessage("🍓 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝘃𝗶𝗱𝗲𝗼, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝗯𝗮𝗯𝘆... ☺️ ", event.threadID, async (err, info) => {
            if (err) return console.error("Message Error:", err);
            
            const waitMessageID = info.messageID; // Capture ID for auto-deletion

            try {
                // TikWM gives us the direct video download link in the 'play' object
                const videoUrl = selectedVideo.play || selectedVideo.download_url; 
                if (!videoUrl) throw new Error("Video URL not found in API response");

                const videoStream = await getStream(videoUrl, `tiktok_${Date.now()}.mp4`);
                let titleText = selectedVideo.title || selectedVideo.desc || "TikTok Video";
                
                const msg = `🍒🍓 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘆𝗼𝘂𝗿 𝘃𝗶𝗱𝗲𝗼! ‧₊˚🩰🍃\n\n🎬 ${titleText}\n👤 𝗕𝘆: ${selectedVideo.author?.nickname || "Unknown"}`;

                api.sendMessage(
                    { body: msg, attachment: videoStream },
                    event.threadID,
                    () => {
                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                        // Auto-delete the "please wait baby" message once sent successfully
                        api.unsendMessage(waitMessageID).catch(err => console.error("Unsend Wait Message Error:", err));
                    },
                    event.messageID
                );

            } catch (err) {
                console.error("Video Download Error:", err);
                api.setMessageReaction("❌", event.messageID, () => {}, true);
                
                // If it fails, delete the wait message and send an error instead
                api.unsendMessage(waitMessageID).catch(err => console.error("Unsend Wait Message Error:", err));
                api.sendMessage("🍒🍓 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝘁𝗵𝗶𝘀 𝘃𝗶𝗱𝗲𝗼. 𝗧𝗵𝗲 𝗳𝗶𝗹𝗲 𝗺𝗶𝗴𝗵𝘁 𝗯𝗲 𝘁𝗼𝗼 𝗹𝗮𝗿𝗴𝗲 𝗼𝗿 𝘁𝗵𝗲 𝗹𝗶𝗻𝗸 𝗲𝘅𝗽𝗶𝗿𝗲𝗱. ‧₊˚🩰🍃", event.threadID, event.messageID);
            }
        });

    } else {
        api.sendMessage(`🍒🍓 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗰𝗵𝗼𝗶𝗰𝗲. 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮 𝗻𝘂𝗺𝗯𝗲𝗿 𝗯𝗲𝘁𝘄𝗲𝗲𝗻 1 𝗮𝗻𝗱 ${pageItems.length}, 𝗼𝗿 '𝗻'/'𝗽'`, event.threadID, event.messageID);
    }
};