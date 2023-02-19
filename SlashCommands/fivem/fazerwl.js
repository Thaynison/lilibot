const { Client, Message, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, MessageEmbed, ApplicationCommandType, ApplicationCommandOptionType, Discord, EmbedBuilder   } = require('discord.js');
const config = require("../../config.json");

module.exports =  {
    name: "inscrever",
    description: "Realizar allowlist dos servidores.",
    type: ApplicationCommandType.ChatInput,
    
    run: async (client, interaction) => {

        if (!interaction.member.roles.cache.has(config.servidores.Dulino.Cargos.Offilist)) {
            interaction.reply({
                content: `Desculpe, você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
            }
        
            if(interaction.channel.id !== (config.servidores.Dulino.Canais.Whitelist.Inscreve)) {
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
                .setPlaceholder('Selecione o servidor da WL.')
                .addOptions(
                    {
                        label: '🥇・Dulino RP',
                        description: 'Servidor Full Roleplay!',
                        value: 'dulino_rp_option',
                    },
                    {
                        label: '🥈・Dulino School',
                        description: 'Servidor Edicacional!',
                        value: 'dulino_school_option',
                    },
                ),
            );

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
            .setTitle('📑 Realizar Inscrição')
            .setDescription("Crie sua história em nossos servidores!")
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

        interaction.reply({
            embeds: [embed],
            components: [rec],
            ephemeral: true
        });
    }
}