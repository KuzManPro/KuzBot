const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the misterious 8ball!')
        .addStringOption((option) =>
            option
                .setName('question')
                .setDescription('Ask any question!')
                .setRequired (true)
        ),
    async execute(interaction) {
        let replies = [
            "Yes!",
            "No!",
            "I don't know..",
            "Don't bug me with this now!",
            "Don't count on it.",
            "My reply is no.",
            "You may rely on it!",
            "Cannot predict now..",
            "Outlook good!",
            "Signs point to yes!",
            "Better not tell you now.."
        ];
        let rnd = Math.floor(Math.random() * replies.length);
        await interaction.reply('**Question:** ' + interaction.options.getString('question') + '\n**Answer:** ' + replies[rnd]);
    }
};