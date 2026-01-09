import { Command } from "commander";
import { initializeProject } from "./commands/projects/initialize.js";

const program = new Command();

program
  .name("devtask")
  .description("A CLI task management tool for developers that organizes work")
  .version("1.0.0");

program
  .command("init <projectName>")
  .description("Initialize a project")
  .action(initializeProject);

program.parse();
