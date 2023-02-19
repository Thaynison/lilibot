const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mysql = require('mysql'); 
const config = require("../../config.json");
const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 */

module.exports =  {
    name: "wl",
    description: "Sistema de aprovação de allowlist (WL).",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "allowlist",
            type: ApplicationCommandOptionType.String,
            description: "Sua id que o servidor disponibiliza a você.",
            required: true
        }
    ],
    
    run: async (client, interaction, args, message, member) => {

    let wl = args[0];
    var apelido = [];
    if (!wl) {
        return message.reply(`Eí `+ message.author.toString() + `, você se esqueceu de digitar o **ID**.`)
    }
    connection.query(`UPDATE vrp_infos SET whitelist = 1 WHERE id = ${wl}`, (err) => {
        if (err) {
            console.log(err)
        }
        if(interaction.channel.id !== (config.servidores.Dulino.Canais.Whitelist.MandarID)) return message.channel.send(message.author.toString() + ` Você não pode usar este comando nesse chat.`)
            
            let role = interaction.guild.roles.cache.get(config.servidores.Dulino.Cargos.Allowlist);
            let semwl = interaction.guild.roles.cache.get(config.servidores.Dulino.Cargos.SemiAprovado);

            const member = interaction.member;
            const nome = interaction.user.username;
    
            member.roles.add(role);
            member.roles.remove(semwl);
            
            apelido = `${wl} • ${nome}`
            interaction.member.setNickname(apelido);
            client.channels.cache.get(config.servidores.Dulino.Canais.Whitelist.Aprovados).send(`Parabéns `+ member.toString() + `! Você foi aprovado! 🤲`);
            interaction.reply({
                content: `Parabens! Você foi aprovado(a).`,
                ephemeral: true
            });
        })
    }
};
  