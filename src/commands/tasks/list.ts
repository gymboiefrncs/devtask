import { getAllTasksService } from "../../services/tasks.services.js";
import chalk from "chalk";

export const listAllTask = (featId: string) => {
  const result = getAllTasksService(featId);
  if (!result.ok) {
    console.error(result.err.message);
    process.exitCode = 1;
    return;
  }

  if (!result.data.length) {
    console.log("No tasks for this feature yet");
  }
  console.log("Tasks for this feature:\n");
  result.data.forEach((task) => {
    console.log(
      ` - ${chalk.yellow(`ID ${task.id}:`)} ${chalk.blue(task.description)} • ${task.status === "done" ? chalk.green(task.status) : task.status}`,
    );
  });
};
