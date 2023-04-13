const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin!')
        .addStringOption((option) => 
            option
                .setName('heads')
                .setDescription('Heads!')
                .setRequired (true)
        )
        .addStringOption((option) =>
            option
                .setName('tails')
                .setDescription('Tails!')
                .setRequired (true)
        ),
    async execute(interaction) {
        if (interaction.commandName === 'coinflip') {
            let heads = interaction.options.getString('heads');
            let tails = interaction.options.getString('tails');
            if (Math.random() < 0.5) {
                await interaction.reply('__' + heads + '__** or **__' + tails + '__' + '\n**You got:** ' + heads);
            } else {
                await interaction.reply('__' + heads + '__** or **__' + tails + '__' + '\n**You got:** ' + tails);
            }
        }
    }
};
