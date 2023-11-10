import { Composer } from "grammy";
import { helpCommand } from "./help.commmand";
import { startCommand } from "./start.command";
import { insightCommand } from "./insight.command";
import { predictCommand } from "./predict.command";
let commandsComposer = new Composer();

let commands: any[] = [
	{ name: "help", command: helpCommand },
	{ name: "start", command: startCommand },
	{ name: "insight", command: insightCommand },
	{ name: "predict", command: predictCommand },
];

for (let index = 0; index < commands.length; index++) {
	commandsComposer.command(commands[index].name, commands[index].command);
}
//commands.command();
export { commandsComposer };
