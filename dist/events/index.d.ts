import { Client } from '../client';
import { ClientEvents } from 'discord.js';
import { Awaitable } from "@discordjs/util";
interface EventOpts {
    name: keyof ClientEvents;
    once?: boolean;
    execute: (...args: any[]) => Awaitable<void>;
}
export declare class Event {
    name: keyof ClientEvents;
    once?: boolean;
    execute: (...args: any[]) => Awaitable<void>;
    constructor(options: EventOpts);
}
export declare function eventBinder(client: Client): void;
export {};
//# sourceMappingURL=index.d.ts.map