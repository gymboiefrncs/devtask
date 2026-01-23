import { removeTaskService } from "../../services/tasks.services.js";

export const removeTask = (taskId: string) => {
  const result = removeTaskService(taskId);
  if (!result.ok) {
    console.error(result.err.message);
    process.exitCode = 1;
    return;
  }
  console.log("Task deleted");
};
