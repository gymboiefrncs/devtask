import { updateTaskDescriptionService } from "../../services/tasks.services.js";

export const editTaskDescription = (taskId: string, description: string) => {
  const result = updateTaskDescriptionService(taskId, description);
  if (!result.ok) {
    console.error(result.err.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Task description updated`);
};
