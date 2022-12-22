"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHandler = exports.Command = void 0;
const discord_js_1 = require("discord.js");
class Command {
    name;
    description;
    nsfw;
    category;
    usage;
    timeout;
    timeouts;
    slashData;
    execute;
    slashExecute;
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.nsfw = options.nsfw ?? false;
        this.category = options.category;
        this.usage = options.usage;
        this.slashData = options.slashData ?? undefined;
        this.execute = options.execute;
        this.slashExecute = options.slashExecute ?? (() => { });
        if (options.timeout) {
            this.timeout = options.timeout;
            this.timeouts = new Map();
        }
    }
}
exports.Command = Command;
const defaultHandler = async (client, message) => {
    if (!message.content.startsWith(client.prefix) || message.channel.isDMBased())
        return;
    let args = message.content.slice(client.prefix.length).split(" ");
    let command = args.shift();
    let cmd = client.commands.filter(i => i.name === command)[0];
    if (!cmd)
        return;
    let timeout = cmd.timeouts.get(message.author.id) ?? 0;
    if (!(Date.now() - timeout > cmd.timeout)) {
        return message.reply(client.messages.timeout.replace('{T}', Math.ceil((cmd.timeout - (Date.now() - timeout)) / 1000).toString()));
    }
    if (message.channel.type === discord_js_1.ChannelType.GuildText && cmd.nsfw && !(message.channel.nsfw)) {
        return message.reply(client.messages.nsfw);
    }
    try {
        let msg = await cmd.execute(client, message, args);
        if (msg)
            await message.reply(msg);
        if (cmd.timeout) {
            cmd.timeouts.set(message.author.id, Date.now());
        }
    }
    catch (e) {
        return message.reply(client.messages.error.replace('{E}', `${e}`.substring(0, 1999 - client.messages.error.length)));
    }
};
exports.defaultHandler = defaultHandler;
//# sourceMappingURL=index.js.map