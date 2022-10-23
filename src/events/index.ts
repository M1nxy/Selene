import { Client } from '../client'
import { ClientEvents } from 'discord.js'
import { Awaitable } from "@discordjs/util";

interface EventOpts {
	name: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => Awaitable<void>;
}

export class Event {
	name: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => Awaitable<void>;

	constructor(options: EventOpts) {
		this.name = options.name
		this.once = options.once
		this.execute = options.execute
	}
}

export function eventBinder(client: Client){
	for (const event of client.events) {
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}
}
