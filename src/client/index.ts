import * as djs from "discord.js";
import { Command, CommandHandler, defaultHandler } from "../commands";
import { SlashCommandHandler, defaultSlashHandler } from "../slash";
import { Event, eventBinder } from "../events";
import { Interaction, Message, Routes } from "discord.js";

interface ClientOptions {
	prefix: string;
	commands: Array<Command>;
	events?: Array<Event>;
	clientOpts: djs.ClientOptions
	handlers?: {
		command: CommandHandler,
		slash: SlashCommandHandler
	}
	/**
	 * @property {string} timeout {T} The time remaining in seconds
	 * @property {string} nsfw No special properties
	 * @property {string} error {E} The error message
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
		slash: SlashCommandHandler
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
		this.events.push(
			new Event({
				name: 'messageCreate',
				execute: (message: Message) => {
					opts.handlers?.command || defaultHandler(this, message)
				}
			})
		)
		this.events.push(
			new Event({
				name: 'interactionCreate',
				execute: (interaction: Interaction) => {
					opts.handlers?.slash || defaultSlashHandler(this, interaction)
				}
			})
		)

		eventBinder(this)
	}
	/**
	 * @description Deploy slash commands to a specific server. Should reflect on discord's end instantly, mostly used for testing.
	 * @param guildId The id of the guild that you wish to deploy to.
	 */
	async deployGuild (guildId: string) {
		let commands = this.commands.map(item => {
			if(!item.slashData) return;
			return item.slashData.toJSON()
		}).filter(item => item); // may not pass code review but i like it :eltroll:

		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			let data = await this.rest.put(
				Routes.applicationGuildCommands(this.application.id, guildId),
				{ body: commands },
			);

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
	async deployGlobal () {
		let commands = this.commands.map(item => { // duplicate fragment :eltroll:
			if(!item.slashData) return;
			return item.slashData.toJSON()
		}).filter(item => item);

		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			let data = await this.rest.put(
				Routes.applicationCommands(this.application.id),
				{ body: commands },
			);

			// @ts-ignore
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		}
		catch (error) {
			console.error(error);
		}
	}
}
