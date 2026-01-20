import { getCurrentProjectService } from "../../services/projects.services.js";
import chalk from "chalk";
import { formatDate } from "../../utils/formatDate.js";

export const getCurrentProject = (): void => {
  const currentProject = getCurrentProjectService();
  if (!currentProject.success) {
    console.error(currentProject.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(
    `${chalk.yellow(`ID: ${currentProject.data.id}`)} - ${chalk.blue(
      currentProject.data.name,
    )}
  Status: ${
    currentProject.data.status === "active"
      ? chalk.green(currentProject.data.status)
      : chalk.red(currentProject.data.status)
  }
  Created at: ${formatDate(currentProject.data.created_at)}
`,
  );
};
