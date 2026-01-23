import chalk from "chalk";
import { checkbox, input, select } from "@inquirer/prompts";
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

export const promptUnfocusMultipleFeatures = async (feats: Feature[]) => {
  if (!feats.length) return;
  const answer = await checkbox({
    message: "Select features to unfocus",
    choices: feats.map((feat) => ({ name: feat.description, value: feat.id })),
  });
  return answer;
};

export const promptDeleteFeature = async (feats: Feature[]) => {
  if (!feats.length) return;
  const answer = await checkbox({
    message: "Select features to be removed",
    choices: feats.map((feat) => ({ name: feat.description, value: feat.id })),
  });
  return answer;
};

// for adding tasks
export const promptSelectFeature = async (feats: Feature[]) => {
  if (!feats.length) return;
  const answer = await select({
    message: "Select feature to add tasks",
    choices: feats.map((feat) => ({ name: feat.description, value: feat.id })),
  });
  return answer;
};

export const promptAddTasks = async () => {
  const tasks: string[] = [];
  console.log(
    chalk.blue("Enter tasks for this feature.. (empty line to exit)"),
  );
  while (true) {
    const answer = await input({
      message: "> ",
    });
    if (!answer.trim()) break;
    tasks.push(answer);
  }
  return tasks;
};
