# Selene
A command handler / extension to discord.js with some creature comforts and basic classes to ease the creation of discord bots wih full support for typescript.
It can be installed with `npm install discord-selene`.
The three basic classes right now are:
* Event - An event that can be passed to the client that will automatically be bound to a client event
* Command - A basic command class that can be executed with cmd.execute(), it has some properties that work with the default command handler to provide basic functionality.
* Client - The magic client class that loads the events and handlers. This can be configured in the constructor to load custom handlers and responses to errors / timeouts etc. (timeout functionality provided by the basic command handler)

### Defaults:
* command handler - Command handler with error catching, returned message payloads from Commands will automatically be sent as a reply, this can be replaced easily in the client init.

All of the above should be relatively self-explanatory and have sensible typing which should provide intelligent autofill.
### Planned Features:
* Optional Interaction support

### Example Code:
```ts
import { Command, Event, Client } from 'discord-selene';
import { Message } from 'discord.js';

let test = new Command({
	name: 'test', // name of the command
	description: 'test desc', // description for help command (coming soon!)
	category: 'util', // category for help command (coming soon!)
	usage: 'test <args>', // code to display on help command (coming soon!)
	timeout: 30000, // timeout in ms for default command handler
	execute: async (client: Client, message: Message, args: string[]) => {
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

let client = new Client({
	prefix: 't!', // prefix for default command handler
	commands: [test], // commands
	events: [ready], // client events
	messages: { // message templates
		timeout: 'You need to wait {T} seconds before using this command again.',
		error: 'An error occurred:\n`{E}.`',
		nsfw: 'This command can only be run in an nsfw channel.'
	},
	clientOpts: { // default discordjs client options
		intents: ["MessageContent", "GuildMessages", "GuildMembers", "Guilds"]
	}
})

void client.login('TOKEN')
```