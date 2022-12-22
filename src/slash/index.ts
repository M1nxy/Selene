import { Client } from "../client";
import { ChannelType, Interaction } from "discord.js";

export type SlashCommandHandler = (client: Client, message: Interaction) => void
export const defaultSlashHandler: SlashCommandHandler = async (client: Client, interaction: Interaction) => {
	if(interaction.isCommand()){
		let cmd = client.commands.filter(i => {
			if(!i.slashData) return false
			return i.slashData.name === interaction.commandName
		})[0];
		if(!cmd) return;

		let timeout = cmd.timeouts.get(interaction.member.user.id) ?? 0
		if(!(Date.now() - timeout > cmd.timeout)) {
			return interaction.reply({
				content: client.messages.timeout.replace('{T}', Math.ceil((cmd.timeout - (Date.now() - timeout)) / 1000).toString()),
				ephemeral: true
			})
		}
		// @ts-ignore does not exist on thread based text channels however returns falsy value -> logic works
		if(cmd.nsfw && interaction.channel.nsfw){
			return interaction.reply(client.messages.nsfw)
		}
		try {
			let msg = await cmd.slashExecute(client, interaction)
			if(msg) await interaction.reply(msg)
			if(cmd.timeout){ cmd.timeouts.set(interaction.user.id, Date.now()) }
		} catch (e) {
			return interaction.reply(client.messages.error.replace('{E}', `${e}`.substring(0, 1999 - client.messages.error.length)))
		}
	}
}
