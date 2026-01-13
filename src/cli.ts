import { Command } from "commander";
import { initializeProject } from "./commands/projects/initialize.js";
import { listProjects } from "./commands/projects/list.js";
import { switchProject } from "./commands/projects/switch.js";
import { listCurrentProject } from "./commands/projects/current.js";
import { removeProject } from "./commands/projects/remove.js";
import { addFeature } from "./commands/features/add.js";
import { listFeature } from "./commands/features/list.js";

const program = new Command();

// projects commands
program
  .name("devtask")
  .description("A CLI task management tool for developers that organizes work")
  .version("1.0.0");

program
  .command("init <projectName>")
  .option("-s, --switch", "Switch to newly initialized project")
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

program
  .command("current")
  .description("Get current project")
  .action(listCurrentProject);

program
  .command("remove <projectId>")
  .description("Deletes a project")
  .action(removeProject);

// feature commands
const feat = program.command("feat").description("Feature commands");

feat
  .command("add <description>")
  .description("Add a feature")
  .action(addFeature);

feat
  .command("list")
  .description("List in-progress feature of the active project")
  .option("-a, --all", "List all feature of the active project")
  .option("-t, --todo", "List todo features of the active project")
  .action(listFeature);

program.parse();
