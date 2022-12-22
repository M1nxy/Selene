import { Client } from "../client";
import { BaseMessageOptions, Message, CommandInteraction, InteractionReplyOptions, InteractionDeferReplyOptions, SlashCommandBuilder } from "discord.js";
interface CommandOpts {
    name: string;
    description: string;
    nsfw?: boolean;
    category: string;
    usage: string;
    timeout?: number;
    slashData?: SlashCommandBuilder;
    execute: (client: Client, message: Message, args: string[]) => Promise<BaseMessageOptions | void> | BaseMessageOptions | void;
    slashExecute?: (client: Client, interaction: CommandInteraction) => Promise<InteractionReplyOptions | InteractionDeferReplyOptions | void> | InteractionReplyOptions | InteractionDeferReplyOptions | void;
}
export declare class Command implements CommandOpts {
    name: string;
    description: string;
    nsfw?: boolean;
    category: string;
    usage: string;
    timeout?: number;
    timeouts?: Map<string, number> | undefined;
    slashData?: SlashCommandBuilder;
    execute: (client: Client, message: Message, args: string[]) => Promise<BaseMessageOptions | void> | BaseMessageOptions | void;
    slashExecute: (client: Client, interaction: CommandInteraction) => Promise<InteractionReplyOptions | InteractionDeferReplyOptions | void> | InteractionReplyOptions | InteractionDeferReplyOptions | void;
    constructor(options: CommandOpts);
}
export declare type CommandHandler = (client: Client, message: Message) => void;
export declare const defaultHandler: CommandHandler;
export {};
//# sourceMappingURL=index.d.ts.map