import {
  listAllFeaturesService,
  listFeatureService,
} from "../../services/features.services.js";
import chalk from "chalk";
import { formatDate } from "../../utils/formatDate.js";
import type { Feature, ListOptions } from "../../types/Features.js";

export const listFeatures = (featId: string, options: ListOptions): void => {
  const statusColors: Record<string, (str: string) => string> = {
    todo: chalk.blue,
    in_progress: chalk.yellow,
    done: chalk.green,
  };

  const printFeat = (f: Feature) => {
    const color = statusColors[f.status] || chalk.white;
    console.log(`${chalk.yellow(`ID: ${f.id}`)} - ${chalk.blue(f.description)}
    Status: ${color(f.status)}
    Created at: ${formatDate(f.created_at)}
    Focus: ${f.is_focused ? chalk.green("Yes") : "No"}
    Notes: ${f.notes ?? "No notes"}\n${"=".repeat(50)}`);
  };

  const result = featId ? listFeatureService(featId) : listAllFeaturesService();

  if (!result.success) {
    console.error(result.error.message);
    process.exitCode = 1;
    return;
  }

  // if res.data is not an array then its a sinlge feature
  if (!Array.isArray(result.data)) {
    printFeat(result.data);
    return;
  }

  // look-up table
  const callbacks: Record<keyof ListOptions, (f: Feature) => boolean> = {
    all: () => true,
    todo: (f) => f.status === "todo",
    done: (f) => f.status === "done",
    focus: (f) => !!f.is_focused,
    unfocus: (f) => !f.is_focused,
  };

  // find which option is passed by the user
  const option = (Object.keys(callbacks) as Array<keyof ListOptions>).find(
    (k) => options[k],
  );

  const dataToDisplay = option
    ? result.data.filter(callbacks[option])
    : result.data.filter((f) => f.status === "in_progress");

  if (!dataToDisplay.length) {
    console.log(`No ${option || "in-progress"} features found!`);
    return;
  }

  dataToDisplay.forEach(printFeat);
};
