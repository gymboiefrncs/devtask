import { listAllFeaturesService } from "../../services/features.services.js";
import { addTaskService } from "../../services/tasks.services.js";
import { promptAddTasks, promptSelectFeature } from "../../utils/prompts.js";

export const addTasks = async () => {
  const listResult = listAllFeaturesService();
  if (!listResult.ok) {
    console.error(listResult.err.message);
    process.exitCode = 1;
    return;
  }

  const { data } = listResult;
  const selectedId = await promptSelectFeature(data);
  const tasks = await promptAddTasks();
  const result = addTaskService(selectedId!, tasks);
  if (!result.ok) {
    console.error(result.err.message);
    process.exitCode = 1;
    return;
  }
  console.log(`(${result.data.changes}) task(s) added.`);
};
