import { Bot, Context, session } from "grammy";
import { commandsComposer } from "./src/commands";
import { predictMarkeCapConversation } from "./src/conversations";
import {
	type Conversation,
	type ConversationFlavor,
	conversations,
	createConversation,
} from "@grammyjs/conversations";
// const { BOT_TOKEN: token = "" } = process.env;

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>(
	"6910977386:AAEpWPV04nggB4uqVABvcV53-l7-AMYkhY8"
);

bot.use(
	session({
		initial() {
			// return empty object for now
			return {};
		},
	})
);

// attach all middleware
bot.api.setMyCommands([
	{
		command: "start",
		description: "get Started with insight gpt bt",
	},
	{ command: "help", description: "Contact our Help Channel" },
	{
		command: "insight",
		description: "Get GPT insight Rating on Degen Projects",
	},
	{
		command: "predict",
		description: "Predict Marketcaps ",
	},
]);

bot.use(conversations() as any);
bot.use(createConversation(predictMarkeCapConversation));
bot.use(commandsComposer);

bot.start();
