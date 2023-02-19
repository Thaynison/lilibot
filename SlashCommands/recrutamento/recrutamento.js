const { Client, Message, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, MessageEmbed, ApplicationCommandType, ApplicationCommandOptionType, Discord, EmbedBuilder   } = require('discord.js');
const config = require("../../config.json");

module.exports =  {
    name: "recrutamento",
    description: "Realizar inscrição dos concurso da cidade.",
    type: ApplicationCommandType.ChatInput,
    
    run: async (client, interaction) => {

        if (!interaction.member.roles.cache.has(config.servidores.Dulino.Cargos.Allowlist)) {
            interaction.reply({
                content: `Desculpe, você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
            }
        
            if(interaction.channel.id !== (config.servidores.Dulino.Canais.Empregos.Recrutamento)) {
            interaction.reply({
                content: `Você não pode usar este comando nesse chat.`,
                ephemeral: true
            });
            return;
            }

            const rec = new ActionRowBuilder()
            .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Selecione o tipo de concurso.')
                .addOptions(
                    {
                        label: '🚓・Departamento de Policia:',
                        description: 'Proteja e sirva com honra!',
                        value: 'policia_option',
                    },
                    {
                        label: '🚑・Departamento de Médico:',
                        description: 'Salvando vidas!',
                        value: 'medico_option',
                    },
                ),
            );

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
            .setTitle('📑 Concurso Publico')
            .setDescription("Transforme sua carreira e conquiste estabilidade!")
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

        interaction.reply({
            embeds: [embed],
            components: [rec],
            ephemeral: true
        });
    }
}