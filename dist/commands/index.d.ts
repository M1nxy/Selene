import { Client } from "../client";
import { BaseMessageOptions, Message } from "discord.js";
interface CommandOpts {
    name: string;
    description: string;
    nsfw?: boolean;
    category: string;
    usage: string;
    timeout?: number;
    execute: (client: Client, message: Message, args: string[]) => Promise<BaseMessageOptions> | BaseMessageOptions | void;
}
export declare class Command implements CommandOpts {
    name: string;
    description: string;
    nsfw?: boolean;
    category: string;
    usage: string;
    timeout?: number;
    timeouts?: Map<string, number> | undefined;
    execute: (client: Client, message: Message, args: string[]) => Promise<BaseMessageOptions> | BaseMessageOptions | void;
    constructor(options: CommandOpts);
}
export declare type CommandHandler = (client: Client, message: Message) => void;
export declare const defaultHandler: CommandHandler;
export {};
//# sourceMappingURL=index.d.ts.map