const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
    PermissionFlagsBits
} = require("discord.js");

require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

const STORE_URL = "https://theheightsnyc.tebex.io/";

// ==========================================
// SLASH COMMAND
// ==========================================

const commands = [
    new SlashCommandBuilder()
        .setName("store")
        .setDescription("Post The Heights NYC official store")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .toJSON()
];

// ==========================================
// REGISTER COMMAND
// ==========================================

const rest = new REST({
    version: "10"
}).setToken(process.env.TOKEN);

async function registerCommands() {
    try {
        console.log("Registering /store command...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {
                body: commands
            }
        );

        console.log("✅ /store command registered.");
    } catch (error) {
        console.error("❌ Command registration error:");
        console.error(error);
    }
}

// ==========================================
// BOT READY
// ==========================================

client.once("ready", () => {
    console.log("==================================");
    console.log(`✅ ${client.user.tag} is online!`);
    console.log("✅ The Heights NYC Store Bot Ready");
    console.log("==================================");
});

// ==========================================
// STORE COMMAND
// ==========================================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName !== "store") return;

    try {

        // Private response to whoever used /store
        await interaction.reply({
            content: "✅ Store message posted successfully.",
            ephemeral: true
        });

        // Heights logo
        const logo = new AttachmentBuilder(
            "./heights-logo.png",
            {
                name: "heights-logo.png"
            }
        );

        // Store embed
        const embed = new EmbedBuilder()

            .setColor("#00FF5A")

            .setTitle("🏙️ The Store is now Open! 🏙️")

            .setURL(STORE_URL)

            .setDescription(
`💸 **[theheightsnyc.tebex.io](${STORE_URL})** 💸


🛒 **The Heights NYC Store**

Purchase packages, perks, vehicles, and other available items through our official store.`
            )

            .setThumbnail("attachment://heights-logo.png")

            .setFooter({
                text: "The Heights NYC • Official Store"
            });

        // Store button
        const buttons = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setLabel("Open Our Store Now")

                    .setEmoji("🛒")

                    .setStyle(ButtonStyle.Link)

                    .setURL(STORE_URL)

            );

        // Send as SEPARATE bot message
        await interaction.channel.send({

            embeds: [embed],

            components: [buttons],

            files: [logo]

        });

        console.log(
            `✅ Store posted by ${interaction.user.tag}`
        );

    } catch (error) {

        console.error("❌ Store command error:");
        console.error(error);

        if (!interaction.replied) {

            await interaction.reply({
                content: "❌ There was an error posting the store.",
                ephemeral: true
            });

        } else {

            await interaction.followUp({
                content: "❌ There was an error posting the store.",
                ephemeral: true
            });

        }
    }
});

// ==========================================
// START BOT
// ==========================================

registerCommands();

client.login(process.env.TOKEN);
