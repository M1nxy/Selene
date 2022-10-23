import * as djs from "discord.js";
import { Command, CommandHandler, defaultHandler } from "../commands";
import { Event, eventBinder } from "../events";
import { Message } from "discord.js";

interface ClientOptions {
	prefix: string;
	commands: Array<Command>;
	events?: Array<Event>;
	clientOpts: djs.ClientOptions
	handlers?: {
		commands: CommandHandler
	}
	/**
	 * @property timeout {T} The time remaining in seconds
	 * @property nsfw No special properties
	 * @property error {E} The error message
	 */
	messages: {
		timeout: string | 'You need to wait {T} seconds before using this command again.',
		nsfw: string | 'This command can only be run in a channel marked as nsfw.',
		error: string | 'An error occurred: {E}.'
	}
}

 export class Client extends djs.Client {
	prefix: string;
	commands: Array<Command>;
	events?: Array<Event>;
	handlers?: {
		commands: CommandHandler
	}
	messages: {
		timeout: string | 'You need to wait {T} seconds before using this command again.',
		nsfw: string | 'This command can only be run in a channel marked as nsfw.',
		error: string | 'An error occurred: {E}.'
	}
	constructor(opts: ClientOptions) {
		super(opts.clientOpts);
		this.prefix = opts.prefix
		this.commands = opts.commands;
		this.events = opts.events;
		this.messages = opts.messages;
		this.events.push(new Event({
			name: 'messageCreate',
			execute: (message: Message) => {
				opts.handlers?.commands || defaultHandler(this, message)
			}
		}))

		eventBinder(this)
	}
}
