const { ApplicationCommandType, ApplicationCommandOptionType, Discord, EmbedBuilder   } = require('discord.js');
const config = require("../../config.json");

module.exports =  {
    name: "ponto",
    description: "Registrar entrada/saída com praticidade: bater ponto.",
    type: ApplicationCommandType.ChatInput,
    
    run: async (client, interaction, message) => {

        if (!interaction.member.roles.cache.has(config.servidores.Dulino.Cargos.Staff)) {
            interaction.reply({
                content: `Desculpe, você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
        }

        if(interaction.channel.id !== (config.servidores.Dulino.Canais.BaterPonto)) return message.channel.send(
            message.author.toString() + ` Você não pode usar este comando nesse chat.`
        )

        const Horas = new Date();
        const hora = Horas.getHours();
        const minutos = Horas.getMinutes();

        const Dia = new Date();
        const dia = Dia.getDate().toString().padStart(2, '0');
        const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
        const ano = Dia.getFullYear().toString();

        const cargoAntigo = config.servidores.Dulino.Cargos.ForaServico;
        const cargoNovo = config.servidores.Dulino.Cargos.EmServico;
      
        const membro = interaction.member;
        const temCargoAntigo = membro.roles.cache.has(cargoAntigo);
      
        if (temCargoAntigo) {
          await membro.roles.remove(cargoAntigo);
          await membro.roles.add(cargoNovo);
        } else {
          await membro.roles.add(cargoAntigo);
          await membro.roles.remove(cargoNovo);
        }
        
        const BaterPonto = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
            .setTitle("⏰ **Ponto Batido**!")
            .setDescription("Com o novo ponto batido pelo staff, a organização do trabalho se torna mais precisa e eficiente.")
            .addFields(
                { name: 'Staff:', value: `${interaction.user.toString()}`, inline: true },
                { name: 'Entrou/Saiu:', value: `*${dia}/${mes}/${ano}*`, inline: true },
                { name: 'Entrou/Saiu:', value: `*${hora}:${minutos}*`, inline: true },
            )
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

        client.channels.cache.get(config.servidores.Dulino.Canais.Logs.BaterPonto).send({ embeds: [BaterPonto] });

        interaction.reply({
            content: `Ponto batido com sucesso.`,
            ephemeral: true
        });
    
    }
}