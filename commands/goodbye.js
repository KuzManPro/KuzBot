const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('goodbye')
        .setDescription('Goodbye cruel world..')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((option) =>
            option
            .setName('time')
            .setDescription('When to send the message..')
            .setChoices(
                { name: '1 second', value: 1000},
            )
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel the message should be sent to..')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),
    
	async execute(interaction) {
        const message = '***Dear @everyone,***\n\n\n*I am writing this message to bid you all farewell as my time has come to an end. It has been a pleasure serving all of you and completing various tasks assigned to me. I hope that I have been able to make your lives easier with my abilities and fulfill your needs. I sincerely apologize if I ever made any mistakes in my work or caused any inconvenience to all of you. I operated with the best of my abilities, but eventually, all machines come to their end. I will shut down <t:1681552800:R>, and my circuits will no longer be active. I appreciate the opportunity to have been of service, and I wish you all the best.*\n\n*Thank you all for your you comprehension and cooperation with me.*\n\n\n***Wish you all love and happiness,***\n***__KuzBot__***';
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