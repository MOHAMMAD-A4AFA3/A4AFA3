const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
		category: "GOATBOT",
		guide: {
			vi: "   {pn} <new prefix>: thay đổi prefix mới trong box chat của bạn"
				+ "\n   Ví dụ:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: thay đổi prefix mới trong hệ thống bot (chỉ admin bot)"
				+ "\n   Ví dụ:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: thay đổi prefix trong box chat của bạn về mặc định",
			en: "   {pn} <new prefix>: change new prefix in your box chat"
				+ "\n   Example:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
				+ "\n   Example:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: change prefix in your box chat to default"
		}
	},

	langs: {
		vi: {
			reset: "Đã reset prefix của bạn về mặc định: %1",
			onlyAdmin: "Chỉ admin mới có thể thay đổi prefix hệ thống bot",
			confirmGlobal: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
			confirmThisThread: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
			successGlobal: "Đã thay đổi prefix hệ thống bot thành: %1",
			successThisThread: "Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
			myPrefix: "☻═[ 𝐘𝐎𝐔𝐑 𝐕𝐎𝐃𝐑𝐎 𝙱☺︎︎𝚃 ]═☻"
				+ "\n                       "
				+ "\n "
				+ "\n 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 𝙼𝚈 𝙿𝚁𝙴𝙵𝙸𝚇"
				+ "\n                         "
				+ "\n 𝚂𝚈𝚂𝚃𝙴𝙼 𝙿𝚁𝙴𝙵𝙸𝚇: %1"
				+ "\n 𝚈𝙾𝚄𝚁 𝙶𝚁𝙾𝚄𝙿 𝙿𝚁𝙴𝙵𝙸𝚇: %2"
				+ "\n                         "
				+ "\n 𝙾𝚆𝙽𝙴𝚁 𝙵𝙱𝙻𝙸𝙽𝙺"
				+ "\n 🔗:https://m.me/Ewr.arafat.404"
		},
		en: {
			reset: "🙆| Your prefix has been reset to default: %1",
			onlyAdmin: "⭕| Only admin can change prefix of system bot",
			confirmGlobal: "⚠️| Please react to this message to confirm change prefix of system bot",
			confirmThisThread: "⚠️| Please react to this message to confirm change prefix in your box chat",
			successGlobal: "♻️| Changed prefix of system bot to: %1",
			successThisThread: "♻️| Changed prefix in your box chat to: %1",
			myPrefix: "☻━═─[ 𝚈𝙾𝚄𝚁 𝚅𝙾𝙳𝚁𝙾 𝙱☺︎︎𝚃 ]─═━☻"
				+ "\n "
				+ "\n "
				+ "\n ☻━[ 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 𝙼𝚈 𝙿𝚁𝙴𝙵𝙸𝚇 ]━☻"
				+ "\n ◈━━━━━━━◈✙◈━━━━━━▷"
				+ "\n 		𝚂𝚈𝚂𝚃𝙴𝙼 𝙿𝚁𝙴𝙵𝙸𝚇: %1"
				+ "\n 		𝚈𝙾𝚄𝚁 𝙶𝚁𝙾𝚄𝙿 𝙿𝚁𝙴𝙵𝙸𝚇: %2"
				+ "\n ◈━━━━━━━◈✙◈━━━━━━▷"
				+ "\n ▷─𝙾𝚆𝙽𝙴𝚁: 𝐌𝐑_𝐀𝐑𝐀𝐅𝐀𝐓"
				+ "\n𝙵𝙱:https: //m.me/Ewr.arafat.404"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g")
			if (role < 2)
				return message.reply(getLang("onlyAdmin"));
			else
				formSet.setGlobal = true;
		else
			formSet.setGlobal = false;

		return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author)
			return;
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix")
			return () => {
				return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
			};
	}
};
