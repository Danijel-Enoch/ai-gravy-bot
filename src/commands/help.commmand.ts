import { Bot, CommandContext, Context } from "grammy";

export async function helpCommand(_ctx: CommandContext<Context>) {
	_ctx.reply(
		`JOIN OUR TELEGRAM CHANNEL TO GET HELP! 🤖🌐 Insight GPT BOT 🚀 `
	);
}
