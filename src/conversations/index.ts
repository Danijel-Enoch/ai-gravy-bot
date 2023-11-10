import {
	type Conversation,
	type ConversationFlavor,
	conversations,
	createConversation,
} from "@grammyjs/conversations";
import { Bot, CommandContext, Context } from "grammy";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

export async function predictMarkeCapConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply("Enter token Name: 🤖 ");
	const name = await conversation.waitFor(":text");
	await ctx.reply(
		"Enter token TotalSupply: 💹 (Insert Total Supply Here) 📈 "
	);
	const totalSupply = await conversation.waitFor(":text");
	await ctx.reply("Enter token Holder: 👤 (Insert Holder Information) 📊: ");
	const holders = await conversation.waitFor(":text");
	await ctx.reply(
		"Enter token LP locker time Duration in Days: ⏳ (Insert Duration Here) 📆: "
	);
	const lpLockTime = await conversation.waitFor(":text");
	await ctx.reply(
		"Enter token number of average Callers: 📞 (Insert Number Here) 📊: "
	);
	const Callers = await conversation.waitFor(":text");
	//titleCtx.msg.text
	await ctx.reply(
		"Enter token current MarketCap: 💰 (Insert MarketCap Here) 📈: "
	);
	const marketCap = await conversation.waitFor(":text");

	let url = "https://ai-api-gilt.vercel.app/predict";

	// console.log(
	// 	name.msg.text.toString(),
	// 	marketCap.msg.text.toString(),
	// 	Callers.msg.text.toString()
	// );

	let options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "insomnia/8.3.0",
		},
		body: `{"tokenName":"${name.msg.text.toString()}","symbol":"${name.msg.text.toString()}","totalSupply":${parseInt(
			totalSupply.msg.text.toString()
		)},"holders":${parseInt(
			holders.msg.text.toString()
		)},"lpLocktime":${parseInt(
			lpLockTime.msg.text.toString()
		)},"degenInfluencers":${parseInt(
			Callers.msg.text.toString()
		)},"marketCap":${parseInt(marketCap.msg.text.toString())}}`,
	};

	fetch(url, options)
		.then((res) => res.json())
		.then((json) => {
			// const prediction = json.prediction;
			console.log(json.prediction);

			ctx.reply(
				`The Prediction for this ${name.msg.text.toString()} is ${
					json.prediction
				} \n Note: DYOR, 🧐 This GPT model is in beta state and still undergoing training. 🔄`
			);
		})
		.catch((err) => {
			ctx.reply("Error Occured While Predicting Pls Try Again");
			console.error("error:" + err);
		});

	await ctx.reply("Predicting");
}
