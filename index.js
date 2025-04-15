const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonComponent, ButtonStyle, ActionRowBuilder, PermissionsFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, AttachmentBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const fs = require("fs")
const ayarlar = require("./ayarlar.js");
const { prefix, color } = require("./ayarlar.js")
const db = require("croxydb")
const Discord = require("discord.js")
const discordTranscripts = require('discord-html-transcripts');
const client = new Client({
     intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildBans,
          GatewayIntentBits.GuildEmojisAndStickers,
          GatewayIntentBits.GuildIntegrations,
          GatewayIntentBits.GuildWebhooks,
          GatewayIntentBits.GuildInvites,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.GuildPresences,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.GuildMessageTyping,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.DirectMessageReactions,
          GatewayIntentBits.DirectMessageTyping,
          GatewayIntentBits.MessageContent,
     ],
     partials: [
          Partials.Message,
          Partials.Channel,
          Partials.GuildMember,
          Partials.Reaction,
          Partials.GuildScheduledEvent,
          Partials.User,
          Partials.ThreadMember,
     ],
});

module.exports = client;

const { error } = require("console");

client.login(ayarlar.token)


client.on("messageCreate", async (message) => {
     if (!message.guild) return;
     if (message.author.bot) return;
     if (!message.content.startsWith(prefix)) return;
     let command = message.content.toLocaleLowerCase().split(" ")[0].slice(prefix.length);
     let params = message.content.split(" ").slice(1);
     let cmd;
     if (client.commands.has(command)) {
          cmd = client.commands.get(command);
     } else if (client.aliases.has(command)) {
          cmd = client.commands.get(client.aliases.get(command));
     }
     if (cmd) {
          cmd.run(client, message, params)
     }
});

client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', () => {

     client.user.setPresence({ activities: [{ name: 'Code World' }] });
     console.log(`Bot Adı: ${client.user.username}`)
     console.log(`Prefix: ${ayarlar.prefix}`);
     console.log(`Bot Çevrimiçi!`);
});

fs.readdir("./komutlar/GENEL", (err, files) => {
     if (err) console.error(err);
     files.forEach(f => {
          let props = require(`./komutlar/GENEL/${f}`);
          client.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
               client.aliases.set(alias, props.help.name);
          });
     });

})

////////////////////////////////////////// MAİN COMMANDS ////////////////////////////////////////

client.on("messageCreate", async message => {
     let scrimotorol = ayarlar.proseries;
     let kanalid = ayarlar.proserieskanal;
     let scrimotorolemoji = ayarlar.emoji;

     if (message.channel.id === kanalid) {
          if (message.author.bot) return;

          if (message.author.id === message.guild.ownerId) {
               message.delete().catch(err => {
                    if (err.code !== 10008) {
                         return;
                    }
               })

               return message.channel.send(`${message.author} Sunucu sahibi olduğun için bu sistem sende çalışmaz.`).then(e => {
                    setTimeout(() => {
                         e.delete().catch(err => {
                              if (err.code !== 10008) {
                                   return;
                              }
                         });
                    }, 2000);
               })
          }

          const newNickname = `${message.content} | ${message.member.user.username}`;

          if (newNickname.length > 32) {
               const member = message.guild.members.cache.get(message.author.id)
               message.delete().catch(err => {
                    if (err.code !== 10008) {
                         return;
                    }
               })

               return message.channel.send(`${message.author} Sunucu içi adın en fazla 32 karakter olabilir. Lütfen daha düşük bir karakter ile tekrar dene.`).then(e => {
                    setTimeout(() => {
                         e.delete().catch(err => {
                              if (err.code !== 10008) {
                                   return;
                              }
                         });
                    }, 2000);
               })
          }
          if (newNickname.length < 32) {
               const botRole = message.guild.members.cache.get(client.user.id).roles.highest;
               const memberRol = message.member.roles.highest;

               if (botRole.position < memberRol.position) {
                    message.delete().catch(err => {
                         if (err.code !== 10008) {
                              return;
                         }
                    })

                    return message.channel.send(`${message.author} Rolün ve yetkilerin benden üst oldugu için işlem gerçekleştiremiyorum!`).then(e => {
                         setTimeout(() => {
                              e.delete().catch(err => {
                                   if (err.code !== 10008) {
                                        return;
                                   }
                              });
                         }, 2000);
                    })
               }
               let rol = message.guild.roles.cache.get(scrimotorol)
               let emojii = message.guild.emojis.cache.get(scrimotorolemoji)
               if (rol && emojii) {
                    await message.member.roles.add(rol.id).catch(() => { });
                    await message.member.setNickname(newNickname).catch(() => { });
                    await message.react(scrimotorolemoji).catch(() => { });
               } else {
                    console.log("Emoji ve rol ayarlanmamış ayarlar.js dosyasından onları ayarla.")
               }
          }
     }
})
