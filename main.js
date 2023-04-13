const fs = require('node:fs');
const path = require('node:path');
const { config } = require('dotenv');
const { Client, Collection, Events, GatewayIntentBits, Intents, REST, Routes,} = require('discord.js');
const { Player } = require('discord-player');

config();

const TOKEN = process.env.KUZBOT_TOKEN;
const CLIENT_ID = process.env.KUZBOT_CLIENT_ID

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessageReactions
    ],
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandsFolder = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync(commandsPath).filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());

for (const file of commandsFolder) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const innerCommandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));
    for (const file of innerCommandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.player = new Player (client, {
    ytdlOptions:{
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

const rest = new REST({version: '10'}).setToken(TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();



client.destroy();
client.login(TOKEN);