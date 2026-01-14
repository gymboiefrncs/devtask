import chalk from "chalk";
import { input } from "@inquirer/prompts";

export const addFeatures = async () => {
  const features: string[] = [];
  console.log(chalk.blue("Enter feature... (empty line to exit)"));
  while (true) {
    const answer = await input({
      message: "> ",
    });
    if (!answer.trim()) break;
    features.push(answer);
  }
  return features;
};
