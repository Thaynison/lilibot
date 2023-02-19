const { ApplicationCommandType, ApplicationCommandOptionType, Discord, EmbedBuilder   } = require('discord.js');
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
    name: "ban",
    description: "Sistema de banimento de allowlist (WL).",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "id",
            type: ApplicationCommandOptionType.String,
            description: "ID do pessoa a ser banida.",
            required: true
        },
        {
            name: "time",
            type: ApplicationCommandOptionType.String,
            description: "Tempo de banimento.",
            required: true
        },
        {
            name: "mensagem",
            type: ApplicationCommandOptionType.String,
            description: "Descrição do banimento",
            required: true
        }
    ],
    
    run: async (client, interaction, args, message, member) => {
    
    if (!interaction.member.roles.cache.has(config.servidores.Dulino.Cargos.Staff)) {
        interaction.reply({
            content: `Desculpe, você não tem permissão para usar este comando.`,
            ephemeral: true
        });
        return;
    }

    let ban = args[0];
    let time = args[1];
    let mensagem = args.slice(2).join(" ");
    var apelido = [];
    if (!ban || !time || !mensagem) {
        return message.reply(`Eí `+ message.author.toString() + `, você se esqueceu de digitar o **ID**.`)
    }
    connection.query(`UPDATE vrp_infos SET banned = 1 WHERE id = ${ban}`, (err) => {
        if (err) {
            console.log(err)
        }
        
        if(interaction.channel.id !== (config.servidores.Dulino.Canais.Administracao.Comandos)) return message.channel.send(message.author.toString() + ` Você não pode usar este comando nesse chat.`)


            const Banimento = new EmbedBuilder()
                .setColor(0x0099FF)
                .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
                .setTitle("📌 Nova **punição** realizada pela Direção 📌")
                .setDescription("O membro descumpriu as regras propostas pela cidade, com isso o mesmo obteve sua punição.")
                .addFields(
                    { name: 'Tempo de Banimento:', value: `*${time} Dias*`, inline: true },
                    { name: 'Id Banido', value: `${ban}`, inline: true  },
                    { name: 'Staff que Baniu:', value: `${interaction.user.toString()}`, inline: true },
                    { name: 'Motivo do Banimento:', value: `*${mensagem}*`, inline: true },
                )
                .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

            client.channels.cache.get(config.servidores.Dulino.Canais.Whitelist.Banimentos).send({ embeds: [Banimento] });


            interaction.reply({
                content: `Banimento aplicado com sucesso.`,
                ephemeral: true
            });
        })
    }
};
  