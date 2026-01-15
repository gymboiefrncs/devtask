import chalk from "chalk";
import { checkbox, input } from "@inquirer/prompts";
import type { Feature } from "../types/Features.js";
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

export const promptfocusMultipleFeature = async (feats: Feature[]) => {
  if (!feats.length) return;
  const answer = await checkbox({
    message: "Select features to focus on",
    choices: feats.map((feat) => ({ name: feat.description, value: feat.id })),
  });
  return answer;
};
