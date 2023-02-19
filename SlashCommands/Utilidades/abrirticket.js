const { Client, Message, ActionRowBuilder, Events, StringSelectMenuBuilder, MessageEmbed, ApplicationCommandType, ApplicationCommandOptionType, Discord, EmbedBuilder   } = require('discord.js');
const config = require("../../config.json");

module.exports =  {
    name: "abrirticket",
    description: "Abrir ticket para a staff.",
    type: ApplicationCommandType.ChatInput,
    
    run: async (client, interaction, message, Events) => {
        if (!interaction.member.roles.cache.has(config.servidores.Dulino.Cargos.Allowlist)) {
          interaction.reply({
            content: `Desculpe, você não tem permissão para usar este comando.`,
            ephemeral: true
          });
          return;
        }
      
        if(interaction.channel.id !== (config.servidores.Dulino.Canais.Suporte.Abrirticket)) {
          interaction.reply({
            content: `Você não pode usar este comando nesse chat.`,
            ephemeral: true
          });
          return;
        }
        
      
        const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Selecione o tipo de suporte.')
                .addOptions(
                    {
                        label: '👨🏻‍💼・Atendimento:',
                        description: 'Atendimento rápido e eficiente!',
                        value: 'atendimento_option',
                    },
                    {
                        label: '💣・Reportar Bugs:',
                        description: 'Reporte bugs e ajude a melhorar!',
                        value: 'reportar_bugs_option',
                    },
                    {
                        label: '🕵🏽・Reportar Staff:',
                        description: 'Denuncie comportamentos inadequados!',
                        value: 'reportar_staff_option',
                    },
                    {
                        label: '👮‍♂️・Reportar Playars:',
                        description: 'Reporte jogadores suspeitos!',
                        value: 'reportar_players_option',
                    },
                ),
            );
      
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
            .setTitle('📑 Abrir Ticket')
            .setDescription("Abra um ticket para suporte rápido e personalizado.")
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

        // Responder ao usuário com uma mensagem e a linha de ação com o botão
        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
          });
     
      }
}