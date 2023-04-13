const { SlashCommandBuilder } = require('discord.js');
const TENOR_KEY = process.env.KUZBOT_TENOR_API_KEY;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Search for a gif!')
        .addStringOption((option) =>
            option
                .setName('search')
                .setDescription('Search for a gif!')
                .setRequired (true)
        ),
    async execute(interaction) {
        let url = `https://tenor.googleapis.com/v2/search?q=${interaction.options.getString('search')}&key=${TENOR_KEY}&client_key=Discord_Bot&limit=16&contentfilter=off`;
        let response = await fetch(url);
        let json = await response.json();
        let rnd = Math.floor(Math.random() * json.results.length);
        await interaction.reply(json.results[rnd].url);
    }
};