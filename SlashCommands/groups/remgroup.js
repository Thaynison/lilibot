const { ApplicationCommandType, ApplicationCommandOptionType, Discord, EmbedBuilder   } = require('discord.js');
const config = require("../../config.json");

module.exports =  {
    name: "remgroup",
    description: "Remove o membro do cargo desejado.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            type: ApplicationCommandOptionType.User,
            description: "nome do membro",
            required: true
        },
        {
            name: "cargo",
            type: ApplicationCommandOptionType.String,
            description: "O cargo desejado",
            required: true
        }
    ],

    run: async (client, interaction, message) => {
        if (!interaction.member.roles.cache.has(config.servidores.Dulino.Cargos.Opded)) {
            interaction.reply({
                content: `Desculpe, você não tem permissão para usar este comando.`,
                ephemeral: true
            });
            return;
        }
        
        // Obtém o ID do cargo do objeto de configuração
        const suporteId = config.servidores.Dulino.Cargos.Suporte;
           
        // Obtém a menção do membro que receberá o cargo
        const member = interaction.options.getMember('usuário');
      
        // Obtém o cargo que será adicionado ao membro
        const cargo = interaction.options.getString('cargo');
      
        // Verifica se o cargo especificado pelo usuário existe
        if (!config.servidores.Dulino.Cargos[cargo]) {
          return interaction.reply({
                content: `O cargo '${cargo}' não existe.`,
                ephemeral: true
            });
        }
      
        // Obtém o ID do cargo especificado pelo usuário
        const cargoId = config.servidores.Dulino.Cargos[cargo];
        const cargostaff = config.servidores.Dulino.Cargos.Staff;


        try {
          // Adiciona o cargo ao membro mencionado
          await member.roles.remove(cargoId);
      
          await member.roles.remove(cargostaff);
          // Envia uma mensagem de confirmação
          await 
            interaction.reply({
                content: `O cargo '${cargo}' foi removido com sucesso do ${member.user.username}.`,
                ephemeral: true
            });
        } catch (error) {
          console.error(error);
          await
            interaction.reply({
                content: `'Ocorreu um erro ao remover o cargo do membro.`,
                ephemeral: true
            });
        }
      }
}