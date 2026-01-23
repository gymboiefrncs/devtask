import { markAsDoneService } from "../../services/tasks.services.js";

export const markTaskAsDone = (taskId: string) => {
  const result = markAsDoneService(taskId);
  if (!result.ok) {
    console.error(result.err.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Task marked as done`);
};
