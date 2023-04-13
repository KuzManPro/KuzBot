const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('goodmorning')
        .setDescription('Sends a good morning message!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
            .setName('setup')
            .setDescription('Setup the good morning message!')
                .addStringOption((option) =>
                    option
                    .setName('message')
                    .setDescription('The good morning message you want to send!')
                    .setMinLength(5)
                    .setMaxLength(2000)
                    .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                    .setName('time')
                    .setDescription('What time to send the good morning message! [12h format]')
                    .setChoices(
                        { name: '6 AM', value: '0 6 * * *'},
                        { name: '7 AM', value: '0 7 * * *'},
                        { name: '8 AM', value: '0 8 * * *'},
                        { name: '9 AM', value: '0 9 * * *'},
                        { name: '10 AM', value: '0 10 * * *'},
                        { name: '11 AM', value: '0 11 * * *'},
                        { name: '12 PM', value: '0 12 * * *'},
                        { name: '1 PM', value: '0 13 * * *'},
                        { name: '2 PM', value: '0 14 * * *'},
                        { name: '3 PM', value: '0 15 * * *'},
                        { name: '4 PM', value: '0 16 * * *'},
                    )
                    .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                    .setName('tz')
                    .setDescription('What timezone should the good morning message be sent!')
                    .setChoices(
                        { name: 'Current', value: 'Etc/UTC'},
                        { name: 'PST', value: 'PST'},
                        { name: 'CST', value: 'CST'},
                        { name: 'EST', value: 'EST'},
                        { name: 'AST', value: 'AST'},
                        { name: 'GMT', value: 'GMT'},
                        { name: 'CET', value: 'CET'},
                        { name: 'EET', value: 'EET'},
                        { name: 'CST', value: 'CST'},
                        { name: 'JST', value: 'JST'},
                    )
                    .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                    .setName('channel')
                    .setDescription('The channel the good morning message should be sent to!')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('cancel')
            .setDescription('Cancel good morning message!')
        ),
        
	async execute(interaction) {
        const cancel = interaction.options.getSubcommand('cancel');

        if (cancel == 'cancel') {
            schedule.gracefulShutdown();

            const msgamReply = ':white_check_mark: **Good morning message cancelled!**';
            const date = new Date (new Date().getTime());
            const dateString = date.toTimeString();
            console.log(dateString + ' - Good morning message cancelled!')
            return interaction.reply({
                content: msgamReply, ephemeral: true
            });
        } else {
            const message = interaction.options.getString('message');
            const time = interaction.options.getString('time');
            const zeroTime = time.replace('0 ', '');
            const timeName = zeroTime.replace(' * * *', '');
            const channel = interaction.options.getChannel('channel');
            const timeZone = interaction.options.getString('tz');

            if (timeName == 6 || timeName == 7 || timeName == 8 || timeName == 9 || timeName == 10 || timeName == 11) {
                const amTime = timeName + ' AM';
    
                const msgamReply = '**Good morning message will be sent at `' + amTime + ' ' + timeZone + '` in <#' + channel + '>**\n*__Message:__* \n' + message + '';
                const date = new Date (new Date().getTime());
                const dateString = date.toTimeString();
                console.log(dateString + ' - Good morning message set! - ' + amTime + ' ' + timeZone + ' - Channel: ' + channel + ' - Message: ' + message);
                interaction.reply({
                    content: msgamReply, ephemeral: true
                });
            }
    
            if (timeName == 12 || timeName == 1 || timeName == 2 || timeName == 3 || timeName == 4) {
                const pmTime = timeName + ' PM';
    
                const msgpmReply = '**Good morning message will be sent at `' + pmTime + ' ' + timeZone + '` in <#' + channel + '>**\n*__Message:__* \n' + message + '';
                const date = new Date (new Date().getTime());
                const dateString = date.toTimeString();
                console.log(dateString + ' - Good morning message set! - ' + pmTime + ' ' + timeZone + ' - Channel: ' + channel + ' - Message: ' + message);
                interaction.reply({
                    content: msgpmReply, ephemeral: true
                });
            }
    
            const rule = new schedule.RecurrenceRule();
            rule.hour = timeName;
            rule.minute = 0;
            rule.tz = timeZone;
    
            schedule.scheduleJob(rule, () => {
                channel.send({ content: message});
            });
        }
    }
}