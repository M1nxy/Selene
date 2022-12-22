import * as djs from "discord.js";
import { Command, CommandHandler } from "../commands";
import { SlashCommandHandler } from "../slash";
import { Event } from "../events";
interface ClientOptions {
    prefix: string;
    commands: Array<Command>;
    events?: Array<Event>;
    clientOpts: djs.ClientOptions;
    handlers?: {
        command: CommandHandler;
        slash: SlashCommandHandler;
    };
    /**
     * @property {string} timeout {T} The time remaining in seconds
     * @property {string} nsfw No special properties
     * @property {string} error {E} The error message
     */
    messages: {
        timeout: string | 'You need to wait {T} seconds before using this command again.';
        nsfw: string | 'This command can only be run in a channel marked as nsfw.';
        error: string | 'An error occurred: {E}.';
    };
}
export declare class Client extends djs.Client {
    prefix: string;
    commands: Array<Command>;
    events?: Array<Event>;
    handlers?: {
        commands: CommandHandler;
        slash: SlashCommandHandler;
    };
    messages: {
        timeout: string | 'You need to wait {T} seconds before using this command again.';
        nsfw: string | 'This command can only be run in a channel marked as nsfw.';
        error: string | 'An error occurred: {E}.';
    };
    constructor(opts: ClientOptions);
    /**
     * @description Deploy slash commands to a specific server. Should reflect on discord's end instantly, mostly used for testing.
     * @param guildId The id of the guild that you wish to deploy to.
     */
    deployGuild(guildId: string): Promise<void>;
    /**
     * @description Deploy slash commands to all servers. May take up to 1 hour to reflect on all regions.
     */
    deployGlobal(): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map