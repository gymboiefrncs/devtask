import { listAllFeaturesService } from "../../services/features.services.js";
import chalk from "chalk";
import { formatDate } from "../../utils/formatDate.js";
import type { Feature } from "../../types/Features.js";

export const listFeature = (options: {
  a: string;
  all: string;
  t: string;
  todo: string;
}) => {
  const features = listAllFeaturesService();
  if (!features.success) {
    console.error(features.error.message);
    process.exitCode = 1;
    return;
  }

  if (!features.data.length) {
    console.log("No features found for this project!");
    return;
  }

  let dataToDisplay: Feature[];
  let label: string;

  if (options.a || options.all) {
    dataToDisplay = features.data;
    label = "No features found for this project!";
  } else if (options.t || options.todo) {
    dataToDisplay = features.data.filter(
      (feature) => feature.status === "todo"
    );
    label = "todo";
  } else {
    dataToDisplay = features.data.filter(
      (feature) => feature.status === "in_progress"
    );
    label = "in-progress";
  }

  if (!dataToDisplay.length) {
    console.log(`No ${label} feature!`);
  }

  // look up colors for status
  const statusColors = {
    todo: chalk.blue,
    in_progress: chalk.yellow,
    done: chalk.green,
  };

  dataToDisplay.forEach((feature) => {
    const colorFn = statusColors[feature.status];

    console.log(
      `${chalk.yellow(`ID: ${feature.id}`)} - ${chalk.blue(feature.description)}
  Status: ${colorFn(feature.status)}
  Created at: ${formatDate(feature.created_at)}
  Focus: ${feature.is_focused === 1 ? chalk.green("Yes") : "No"}
  Time Spent: ${feature.time_spent}
  Finished at: ${formatDate(feature.finished_at)}

  ${"=".repeat(50)}

  Notes: ${feature.notes ?? "No notes"}
  `
    );
  });
};
