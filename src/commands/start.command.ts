import { Bot, CommandContext, Context } from "grammy";

export async function startCommand(_ctx: CommandContext<Context>) {
	_ctx.reply(
		`Welcome to Insight GPT BOT \n Get AI based Project Score Rating\n Using this token marketcap prediction bot implies acknowledgment of ⚠️ financial risk. \n Predictions are not guaranteed, and users must conduct personal research. \nNo financial advice provided. ⚠️🤖📊💰`
	);
}
