import { Client } from "../client";
import {
	BaseMessageOptions,
	Message,
	ChannelType,
	Interaction,
	InteractionReplyOptions,
	InteractionDeferReplyOptions, SlashCommandBuilder
} from "discord.js";

interface CommandOpts {
	name: string;
	description: string;
	nsfw?: boolean;
	category: string;
	usage: string;
	timeout?: number;
	slashData?: SlashCommandBuilder;
	execute: (client: Client, message: Message, args: string[]) => Promise<BaseMessageOptions | void> | BaseMessageOptions | void;
	slashExecute?: (client: Client, interaction: Interaction) => Promise<InteractionReplyOptions | InteractionDeferReplyOptions | void> | InteractionReplyOptions | InteractionDeferReplyOptions | void;
}

export class Command implements CommandOpts {
	name: string;
	description: string;
	nsfw?: boolean;
	category: string;
	usage: string;
	timeout?: number;
	timeouts?: Map<string, number> | undefined
	slashData?: SlashCommandBuilder;
	execute: (client: Client, message: Message, args: string[]) => Promise<BaseMessageOptions | void> | BaseMessageOptions | void;
	slashExecute: (client: Client, interaction: Interaction) => Promise<InteractionReplyOptions | InteractionDeferReplyOptions | void> | InteractionReplyOptions | InteractionDeferReplyOptions | void;

	constructor(options: CommandOpts) {
		this.name = options.name;
		this.description = options.description;
		this.nsfw = options.nsfw ?? false;
		this.category = options.category;
		this.usage = options.usage;
		this.slashData = options.slashData ?? undefined;
		this.execute = options.execute;
		this.slashExecute = options.slashExecute ?? (() => {})

		if(options.timeout) {
			this.timeout = options.timeout;
			this.timeouts = new Map<string, number>()
		}
	}
}

export type CommandHandler = (client: Client, message: Message) => void

export const defaultHandler: CommandHandler = async (client: Client, message: Message) => {
	if(!message.content.startsWith(client.prefix) || message.channel.isDMBased()) return;
	let args = message.content.slice(client.prefix.length).split(" ")
	let command = args.shift()
	let cmd = client.commands.filter(i => i.name === command)[0]
	if(!cmd) return;

	let timeout = cmd.timeouts.get(message.author.id) ?? 0

	if(!(Date.now() - timeout > cmd.timeout)) {
		return message.reply(client.messages.timeout.replace('{T}', Math.ceil((cmd.timeout - (Date.now() - timeout)) / 1000).toString()))
	}

	if(message.channel.type === ChannelType.GuildText && cmd.nsfw && !(message.channel.nsfw)){
		return message.reply(client.messages.nsfw)
	}

	try {
		let msg = await cmd.execute(client, message, args)
		if(msg) await message.reply(msg)
		if(cmd.timeout){ cmd.timeouts.set(message.author.id, Date.now()) }
	} catch (e) {
		return message.reply(client.messages.error.replace('{E}', `${e}`.substring(0, 1999 - client.messages.error.length)))
	}
}
