import {
  listAllFeaturesService,
  listFeatureService,
} from "../../services/features.services.js";
import chalk from "chalk";
import { formatDate } from "../../utils/formatDate.js";
import type { Feature } from "../../types/Features.js";

export const listFeatures = (
  featId: string,
  options: { all?: boolean; todo?: boolean; done?: boolean },
) => {
  const statusColors = {
    todo: chalk.blue,
    in_progress: chalk.yellow,
    done: chalk.green,
  };
  if (featId) {
    const feature = listFeatureService(featId);
    if (!feature.success) {
      console.error(feature.error.message);
      process.exitCode = 1;
      return;
    }
    const colorFn = statusColors[feature.data.status];

    console.log(
      `${chalk.yellow(`ID: ${feature.data.id}`)} - ${chalk.blue(feature.data.description)}
    Status: ${colorFn(feature.data.status)}
    Created at: ${formatDate(feature.data.created_at)}
    Focus: ${feature.data.is_focused === 1 ? chalk.green("Yes") : "No"}
  
    Notes: ${feature.data.notes ?? "No notes"}
  
    ${"=".repeat(50)}  
    `,
    );
    return;
  }

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

  if (options.all) {
    dataToDisplay = features.data;
    label = "";
  } else if (options.todo) {
    dataToDisplay = features.data.filter(
      (feature) => feature.status === "todo",
    );
    label = "todo";
  } else if (options.done) {
    dataToDisplay = features.data.filter(
      (feature) => feature.status === "done",
    );
    label = "done";
  } else {
    dataToDisplay = features.data.filter(
      (feature) => feature.status === "in_progress",
    );
    label = "in-progress";
  }

  if (!dataToDisplay.length) {
    console.log(`No ${label} feature!`);
  }

  // look up colors for status

  dataToDisplay.forEach((feature) => {
    const colorFn = statusColors[feature.status];

    console.log(
      `${chalk.yellow(`ID: ${feature.id}`)} - ${chalk.blue(feature.description)}
  Status: ${colorFn(feature.status)}
  Created at: ${formatDate(feature.created_at)}
  Focus: ${feature.is_focused === 1 ? chalk.green("Yes") : "No"}

  Notes: ${feature.notes ?? "No notes"}

  ${"=".repeat(50)}  
  `,
    );
  });
};
