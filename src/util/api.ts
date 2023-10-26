import { createClient } from "@supabase/supabase-js";
import { GenerateWallet } from "./blockchain";
import axios from "axios";
const supabaseUrl = "https://dxxhlgvftegkivncnblj.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eGhsZ3ZmdGVna2l2bmNuYmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4Nzk1MjIwNiwiZXhwIjoyMDAzNTI4MjA2fQ.odHwIH0u5WV_sLTV_0DRkK8eKLvt7LftT8R-_LeDxck";

const supabase = createClient(supabaseUrl, supabaseKey);
export async function authUser(userId, ctx) {
	try {
		const supabase = createClient(supabaseUrl, supabaseKey);
		ctx.reply("Fetching data");
		let { data: botUsers, error }: any = await supabase
			.from("botUsers")
			.select("*")
			.eq("userID", userId);
		if (botUsers.length < 1) {
			const pK1 = GenerateWallet();
			const pK2 = GenerateWallet();
			const pK3 = GenerateWallet();
			console.log(pK1);
			// ctx.reply("Registering......")
			try {
				const response = await axios.post(
					`${supabaseUrl}/rest/v1/botUsers`,
					// '{ "some_column": "someValue", "other_column": "otherValue" }',
					{
						pK1,
						pK2,
						pK3,
						userID: userId,
					},
					{
						headers: {
							apikey: supabaseKey,
							Authorization: "Bearer " + supabaseKey,
							"Content-Type": "application/json",
							Prefer: "return=minimal",
						},
					}
				);
			} catch (error) {
				console.log(error);
			}

			let { data: botUsers, error }: any = await supabase
				.from("botUsers")
				.select("*")
				.eq("userID", userId);
			return botUsers[0];
			// console.log({ data, error });
		}
		if (botUsers.length > 0) {
			//  ctx.reply("Logging In ....")
			let { data: botUsers, error }: any = await supabase
				.from("botUsers")
				.select("*")
				.eq("userID", userId);
			return botUsers[0];
		}
	} catch (error) {}

	//fecth for user if exist
	// generate new wallet
}

export async function addToken(
	tokenAddress,
	walletAddress,
	chain,
	ctx,
	userID
) {
	try {
		const res = await axios.post(
			`${supabaseUrl}/rest/v1/botUserTokens`,
			// '{ "some_column": "someValue", "other_column": "otherValue" }',
			{
				userID,
				tokenAddress,
				walletAddress,
				chain,
			},
			{
				headers: {
					apikey: supabaseKey,
					Authorization: "Bearer " + supabaseKey,
					"Content-Type": "application/json",
					Prefer: "return=minimal",
				},
			}
		);
		if (res) {
			// console.log(res)
			ctx.reply("Token Added Successfully");
		}
	} catch (error) {
		console.log(error);
		ctx.reply("Error While Adding token");
	}
}

export async function getUserTokenAndBalances(userID, wallet, chain, ctx) {
	//filter with params
	const supabase = createClient(supabaseUrl, supabaseKey);
	let { data: botUserTokens, error } = await supabase
		.from("botUserTokens")
		.select("*")
		.eq("userID", userID)
		.eq("walletAddress", wallet)
		.eq("chain", chain);
	//  console.log(botUserTokens, userID, wallet, chain)
	return botUserTokens;
}
module.exports = {
	authUser,
	addToken,
	getUserTokenAndBalances,
};
