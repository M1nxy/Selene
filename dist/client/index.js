"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const djs = __importStar(require("discord.js"));
const commands_1 = require("../commands");
const slash_1 = require("../slash");
const events_1 = require("../events");
const discord_js_1 = require("discord.js");
class Client extends djs.Client {
    prefix;
    commands;
    events;
    handlers;
    messages;
    constructor(opts) {
        super(opts.clientOpts);
        this.prefix = opts.prefix;
        this.commands = opts.commands;
        this.events = opts.events;
        this.messages = opts.messages;
        this.events.push(new events_1.Event({
            name: 'messageCreate',
            execute: (message) => {
                opts.handlers?.command || (0, commands_1.defaultHandler)(this, message);
            }
        }));
        this.events.push(new events_1.Event({
            name: 'interactionCreate',
            execute: (interaction) => {
                opts.handlers?.slash || (0, slash_1.defaultSlashHandler)(this, interaction);
            }
        }));
        (0, events_1.eventBinder)(this);
    }
    /**
     * @description Deploy slash commands to a specific server. Should reflect on discord's end instantly, mostly used for testing.
     * @param guildId The id of the guild that you wish to deploy to.
     */
    async deployGuild(guildId) {
        let commands = this.commands.map(item => {
            if (!item.slashData)
                return;
            return item.slashData.toJSON();
        }).filter(item => item); // may not pass code review but i like it :eltroll:
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            let data = await this.rest.put(discord_js_1.Routes.applicationGuildCommands(this.application.id, guildId), { body: commands });
            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     * @description Deploy slash commands to all servers. May take up to 1 hour to reflect on all regions.
     */
    async deployGlobal() {
        let commands = this.commands.map(item => {
            if (!item.slashData)
                return;
            return item.slashData.toJSON();
        }).filter(item => item);
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            let data = await this.rest.put(discord_js_1.Routes.applicationCommands(this.application.id), { body: commands });
            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.Client = Client;
//# sourceMappingURL=index.js.map