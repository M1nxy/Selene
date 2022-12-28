import { Client } from '../client'
import { ClientEvents } from 'discord.js'
import { Awaitable } from "@discordjs/util";

interface EventOpts {
	name: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => Awaitable<void>;
}

export class Event implements EventOpts{
	name: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => Awaitable<void>;

	constructor(options: EventOpts) {
		this.name = options.name
		this.once = options.once
		this.execute = options.execute
	}
}
export class EventBuilder implements EventOpts {
	public readonly name: keyof ClientEvents = undefined!;
	public readonly once: boolean = false!;
	public readonly execute: (...args: any[]) => Awaitable<void>;
	public setName(name: keyof ClientEvents): this {
		Reflect.set(this, 'name', name);
		return this;
	}
	public setOnce(once: boolean): this {
		Reflect.set(this, 'once', once);
		return this;
	}
	public setExecute(execute: (...args: any[]) => Awaitable<void>): this {
		Reflect.set(this, 'execute', execute);
		return this;
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
