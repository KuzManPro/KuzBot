const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the discord server!")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName("target")
                .setDescription("User to be banned!")
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the ban!")
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser("target");
        const reason = options.getString("reason") || "No reason provided!";

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setTitle("**:x: Something went wrong!**")
            .setDescription(`You can't take action on ${user.username} since they have a higher role!`)
            .setColor(0x000000);

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setTitle("**:white_check_mark: Banned!**")
            .setDescription(`Succesfully banned ${user} with reason: ${reason}`)
            .setColor(0x000000)
            .setTimestamp()

        await interaction.reply({
            embeds: [embed]
        });
    }
}