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
    intents: [GatewayIntentBits.Guilds]
});

const STORE_URL = "https://theheightsnyc.tebex.io/";

const commands = [
    new SlashCommandBuilder()
        .setName("store")
        .setDescription("Post The Heights NYC official store")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering /store command...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("✅ /store command registered.");
    } catch (error) {
        console.error(error);
    }
})();

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} is online.`);
});

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "store") {

        const logo = new AttachmentBuilder("./heights-logo.png");

        const embed = new EmbedBuilder()
            .setColor("#00FF5A")

            .setTitle("🏙️ The Store is now Open! 🏙️")

            .setDescription(
`💸 **[theheightsnyc.tebex.io](${STORE_URL})** 💸

━━━━━━━━━━━━━━━━━━━━━━

🛒 **The Heights NYC Store**

Purchase packages, perks, vehicles, and other available items through our official store.

━━━━━━━━━━━━━━━━━━━━━━`
            )

            .setThumbnail("attachment://heights-logo.png")

            .setFooter({
                text: "The Heights NYC • Official Store"
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("🛒 Open Our Store Now")
                    .setStyle(ButtonStyle.Link)
                    .setURL(STORE_URL)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            files: [logo]
        });
    }
});

client.login(process.env.TOKEN);