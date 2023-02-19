const {Discord, EmbedBuilder} = require("discord.js")
const { ApplicationCommandType } = require('discord.js');

module.exports =  {
    name: "ping",
    description: "Veja meu ping.",
    type: ApplicationCommandType.ChatInput,   
    
    run: async (client, interaction) => {

        let embed = new EmbedBuilder()
        .setColor("00001")
        .setDescription(`**\\📡 Meu ping está em** \`${client.ws.ping}ms\`**.**`);

        interaction.reply({ embeds: [embed], ephemeral: true })

    }
}