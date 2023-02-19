const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const mysql = require('mysql'); 
const config = require("../../config.json");
const FiveM = require('fivem-api.js'); // Import npm.
const server = new FiveM.server(`${config.fivem.host}`); //Create new server with ip and port.

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 */

module.exports =  {
    name: "playerlist",
    description: "Veja a quantidade de estudantes online.",
    type: ApplicationCommandType.ChatInput,   
    
    run: async (client, interaction) => {

        (async function updatePlayers() {
            const playersInfo = await server.getPlayersInfo(); //Get players info.
            let infoPlayers = playersInfo.getOnline();
            
            let embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("🏫 Dulino RP")
            .setDescription(`\nExistem no momento  **${infoPlayers}**  estudante(s) online.\n`)
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });
    
            interaction.reply({ embeds: [embed], ephemeral: true })
        })();

    }
}
