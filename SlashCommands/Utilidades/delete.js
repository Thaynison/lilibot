const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const config = require("../../config.json");

module.exports =  {
    name: "delete",
    description: "Exclui um número especificado de mensagens no canal",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "amount",
            type: ApplicationCommandOptionType.String,
            description: "O número de mensagens a serem excluídas (1 a 50)",
            required: true
        }
    ],
    
    run: async (client, interaction, args) => {
        if (!interaction.member.roles.cache.has(config.servidores.Dulino.Cargos.Opded)) {
            interaction.reply({
                content: `Desculpe, você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
        }
        
        const amount = args[0];
        if (!amount || isNaN(amount)) {
            interaction.reply({
                content: `Você deve inserir um número válido de mensagens para excluir (1 a 50)..`,
                ephemeral: true
            });
            return
        }
        
        interaction.channel.bulkDelete(amount);
        interaction.reply({
            content: `Excluído com êxito ${amount} Mensagens.`,
            ephemeral: true
        });
    }
};