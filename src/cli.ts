import { Command } from "commander";
import { initializeProject } from "./commands/projects/initialize.js";
import { listProjects } from "./commands/projects/list.js";
import { switchProject } from "./commands/projects/switch.js";

const program = new Command();

program
  .name("devtask")
  .description("A CLI task management tool for developers that organizes work")
  .version("1.0.0");

program
  .command("init <projectName>")
  .description("Initialize a project")
  .action(initializeProject);

program
  .command("projects")
  .description("List all the projects")
  .action(listProjects);

program
  .command("switch <projectId>")
  .description("Switch projects")
  .action(switchProject);

program.parse();
