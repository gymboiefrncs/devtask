import { getCurrentProjectService } from "../../services/projects.services.js";
import chalk from "chalk";
import { formatDate } from "../../utils/formatDate.js";

export const getCurrentProject = (): void => {
  const projectResult = getCurrentProjectService();
  if (!projectResult.success) {
    console.error(projectResult.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(
    `${chalk.yellow(`ID: ${projectResult.data.id}`)} - ${chalk.blue(
      projectResult.data.name,
    )}
  Status: ${
    projectResult.data.status === "active"
      ? chalk.green(projectResult.data.status)
      : chalk.red(projectResult.data.status)
  }
  Created at: ${formatDate(projectResult.data.created_at)}
`,
  );
};
