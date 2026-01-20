import { getProjectsService } from "../../services/projects.services.js";
import chalk from "chalk";
import { formatDate } from "../../utils/formatDate.js";

export const listProjects = (): void => {
  const projects = getProjectsService();
  if (!projects.success) {
    console.error(projects.error.message);
    process.exitCode = 1;
    return;
  }

  if (!projects.data.length) {
    console.log("No projects found!");
    return;
  }

  projects.data.forEach((project) => {
    console.log(
      `${chalk.yellow(`ID: ${project.id}`)} - ${chalk.blue(project.name)}
  Status: ${
    project.status === "active"
      ? chalk.green(project.status)
      : chalk.red(project.status)
  }
  Created at: ${formatDate(project.created_at)}
  `,
    );
  });
};
