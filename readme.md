[![Verified on Openbase](https://badges.openbase.com/js/verified/discord-selene.svg?token=YdLWVKRmZ61sJG78Zy49qSs4YfNwi29muM4KjCnz3pY=)](https://openbase.com/js/discord-selene?utm_source=embedded&amp;utm_medium=badge&amp;utm_campaign=rate-badge)

# Selene
A command handler / extension to discord.js with some creature comforts and basic classes to ease the creation of discord bots with full support for typescript.
It can be installed with `npm install discord-selene`.
The three basic classes right now are:
* Event - An event that can be passed to the client that will automatically be bound to a client event
* Command - A basic command class that can be executed with cmd.execute(), it has some properties that work with the default command handler to provide basic functionality.
* Client - The magic client class that loads the events and handlers. This can be configured in the constructor to load custom handlers and responses to errors / timeouts etc. (timeout functionality provided by the basic command handler)

### Defaults:
* command handler - Command handler with error catching, returned message payloads from Commands will automatically be sent as a reply, this can be replaced easily in the client init.
* interaction handler - Interaction handler with error catching, returned message payloads from Commands will automatically be sent as a reply, this can be replaced easily in the client init.
All of the above should be relatively self-explanatory and have sensible typing which should provide intelligent autofill.

### Planned Features:
* Help command (possibly)

### Example Code:
```ts
import { Command, Event, EventBuilder, Client } from 'discord-selene';
import { CommandInteraction, Message, SlashCommandBuilder } from 'discord.js';
require('dotenv').config() // allow for use of .env files

let test = new Command({
	name: 'test', // name of the command
	description: 'test desc', // description for help command (coming soon!)
	category: 'util', // category for help command (coming soon!)
	usage: 'test <args>', // code to display on help command (coming soon!)
	timeout: 30000, // timeout in ms for default command handler
	slashData: new SlashCommandBuilder().setName('test').setDescription('test desc'), // optional data, adds slash command
	execute: async (client: Client, message: Message, args: string[]) => { // function to call when command is triggered
		return { content: 'test' }
	},
	slashExecute: async (client: Client, interaction: CommandInteraction) => { // function to call when slash command is triggered
		return { content: 'test' }
	}
})

let ready = new Event({
	name: 'ready', // name of the client event
	once: true, // run once?
	execute: (client: Client) => { // the listener
		console.log(`Ready as ${client.user?.tag}`)
	}
})
let readyBuilt = new EventBuilder().setName('ready').setOnce('true').setExecute(
	(client: Client) => {
		console.log(`Ready as ${client.user?.tag}`)
	}
)


let client = new Client({
	prefix: 't!', // prefix for default command handler
	commands: [test], // commands
	events: [ready, readyBuilt], // client events
	messages: { // message templates
		timeout: 'You need to wait {T} seconds before using this command again.',
		error: 'An error occurred:\n`{E}.`',
		nsfw: 'This command can only be run in an nsfw channel.'
	},
	clientOpts: { // default discordjs client options
		intents: ["MessageContent", "GuildMessages", "GuildMembers", "Guilds"]
	}
})

client.login(process.env.TOKEN).then(() => {
	//void client.deployGuild("GUILDID") // deploy all slash commmands to a specific guild
    //void client.deployGlobal() // deploy all slash commands globally, may take up to 1 hour to propagate
})

```
