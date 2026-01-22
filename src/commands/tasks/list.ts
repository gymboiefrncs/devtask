import { getAllTasksService } from "../../services/tasks.services.js";

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

  console.log(result.data);
};
