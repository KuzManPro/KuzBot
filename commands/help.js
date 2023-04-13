const fs = require('fs');
const path = require('node:path');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands!'),
    async execute(interaction) {
        let str = new String();
        const commandsPath = path.join(__dirname);
        const commandFolder = fs.readdirSync(commandsPath).filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());
        
        for (const folder of commandFolder) {
            const folderPath = path.join(commandsPath, folder);
            const innerCommandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));
            for (const file of innerCommandFiles) {
                const filePath = path.join(folderPath, file);
                const command = require(filePath);
                const commandName = command.data.name;
                const commandDesc = command.data.description;
                str += '**Name:** `/' + commandName + '`\n*Description: ' + commandDesc + '*\n';
            }
        }

        
        return interaction.reply({content: str, ephemeral: true});
    },
};