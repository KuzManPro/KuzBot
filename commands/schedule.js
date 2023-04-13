const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Schedules a message!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
            .setName('message')
            .setDescription('The message to be scheduled!')
            .setMinLength(5)
            .setMaxLength(2000)
            .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
            .setName('time')
            .setDescription('When to schedule the message!')
            .setChoices(
                { name: '1 second', value: 1000},
                { name: '5 seconds', value: 5000},
                { name: '15 seconds', value: 15000},
                { name: '30 seconds', value: 15000 },
                { name: '1 minute', value: 60000 },
                { name: '15 minutes', value: 900000 },
                { name: '30 minutes', value: 1800000 },
                { name: '1 hour', value: 3600000 },
                { name: '3 hours', value: 10800000 },
                { name: '6 hours', value: 21600000 },
                { name: '12 hours', value: 43200000 },
                { name: '1 day', value: 86400000 },
            )
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel the message should be sent to!')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),
    
	async execute(interaction) {
        const message = interaction.options.getString('message');
        const time = interaction.options.getInteger('time');
        const channel = interaction.options.getChannel('channel');

        const date = new Date(new Date().getTime() + time);
        const dateString = date.toTimeString();
        const msgReply = '**Your message has been scheduled for `' + dateString + '` in <#' + channel + '>**\n*__Message:__* \n' + message;
        interaction.reply({
            content: msgReply, ephemeral: true
        });

        schedule.scheduleJob(date, () => {
            channel.send({ content: message});
        });
    }
}