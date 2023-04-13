const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Enable slowmode in a chat!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Put the duration of slowmode in a channel! [s|m|h]')
                .setRequired(true)
            )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Specific channel to enable slowmode!')
        ),
    async execute(interaction) {
        const { channel, options } = interaction;
        
        const errEmbed = new EmbedBuilder()
            .setTitle("**:x: Something went wrong!**")
            .setDescription(`**You don't have the appropriate permissions to execute this command!**`)
            .setColor(0x000000)

        const errEmbed2 = new EmbedBuilder()
            .setTitle("**:x: Something went wrong!**")
            .setDescription(`**Provide a valid time! [s|m|h]**`)
            .setColor(0x000000)

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        } else {
            let t = interaction.options.getString('time');
            let time = ms(t);
            let channel = interaction.options.getChannel('channel');
            if (!channel || channel === null) channel = interaction.channel;

            if (t.endsWith('s') || t.endsWith('m') || t.endsWith('h')) {
                if (!time || time === false || time === null) {
                    return interaction.reply({embeds: [errEmbed2], ephemeral: true});
                } else {
                    const succesEmbed = new EmbedBuilder()
                        .setTitle("**:white_check_mark: Slowmode Active!**")
                        .setDescription(`The text channel: ${channel} has it's slow mode set to \`${t}\`!`)
                        .setColor(0x000000)
    
                    channel.setRateLimitPerUser(time/1000).then( () => {
                        interaction.reply({embeds: [succesEmbed], ephemeral: true});
                    })
                }
            } else {
                return interaction.reply({embeds: [errEmbed2], ephemeral: true});
            }
        }
    }
}