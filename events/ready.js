const { Events, ActivityType } = require('discord.js');


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`${client.user.tag} is up and running!`);

		client.user.setPresence({ activities: [{ name: 'with my pet..', type: ActivityType.Playing}], status: 'dnd' });
	},
};