#!/usr/bin/env node

import { Command } from "commander";
import { initializeProject } from "./commands/projects/initialize.js";
import { listProjects } from "./commands/projects/list.js";
import { switchProject } from "./commands/projects/switch.js";
import { getCurrentProject } from "./commands/projects/current.js";
import { removeProject } from "./commands/projects/remove.js";
import { addFeature } from "./commands/features/add.js";
import { listFeatures } from "./commands/features/list.js";
import { focusFeature, unfocusFeatures } from "./commands/features/focus.js";
import { markAsDone } from "./commands/features/done.js";
import { markTaskAsDone } from "./commands/tasks/done.js";
import { removeFeature } from "./commands/features/remove.js";
import { resetDatabase } from "./reset.js";
import { addNotes } from "./commands/features/notes.js";
import { editProject } from "./commands/projects/edit.js";
import { db } from "./db/database.js";
import { editDescription } from "./commands/features/edit.js";
import { addTasks } from "./commands/tasks/add.js";
import { listAllTask } from "./commands/tasks/list.js";
import { editTaskDescription } from "./commands/tasks/edit.js";
import { removeTask } from "./commands/tasks/remove.js";
const program = new Command();

// projects commands
program.command("reset").description("Reset db").action(resetDatabase);

program
  .name("devtask")
  .description("A CLI task management tool for developers that organizes work")
  .version("1.0.0");

program
  .command("init [projectName]")
  .option("-s, --switch", "Switch to newly initialized project")
  .description("Initialize a project")
  .action(initializeProject);

program
  .command("projects")
  .description("List all the projects")
  .action(listProjects);

program
  .command("switch [projectId]")
  .description("Switch projects")
  .action(switchProject);

program
  .command("current")
  .description("Get current project")
  .action(getCurrentProject);

program
  .command("remove [projectId]")
  .description("Deletes a project")
  .action(removeProject);

program
  .command("edit [projectId] [projectName]")
  .description("Edit project name")
  .action(editProject);

// feature commands
const feat = program.command("feat").description("Feature commands");

feat
  .command("add [description]")
  .option("-m, --many", "Add multiple features")
  .description("Add a feature")
  .action(async (description: string, options: { many: boolean }) => {
    await addFeature(description, options);
  });

feat
  .command("edit [featId] [description]")
  .description("Edit feature description")
  .action(editDescription);

feat
  .command("list [featId]")
  .description("List in-progress feature of the active project")
  .option("-a, --all", "List all feature of the active project")
  .option("-t, --todo", "List todo features of the active project")
  .option("-d, --done", "List done features of the active project")
  .option("-f, --focus", "List focused features of the active project")
  .option("-u, --unfocus", "List unfocued features of the active project")
  .action(listFeatures);

feat
  .command("focus [featId]")
  .description("Focus on a feature")
  .option("-m, --many", "Focus multiple feature")
  .action(focusFeature);

feat
  .command("unfocus")
  .description("unfocus a feature")
  .action(unfocusFeatures);

feat
  .command("done [featId]")
  .description("Mark feature as done")
  .action(markAsDone);

feat
  .command("remove")
  .description("Delete a feature")
  .action(async () => await removeFeature());

feat
  .command("notes [featId] [notes]")
  .description("Add notes for features")
  .action(addNotes);

// tasks commands
const task = program.command("task").description("Task commands");

task
  .command("add")
  .description("Add tasks to a feature")
  .action(async () => {
    await addTasks();
  });

task.command("list [featId]").description("List all tasks").action(listAllTask);

task
  .command("done [taskId]")
  .description("Mark task as done")
  .action(markTaskAsDone);

task
  .command("edit [taskId] [description]")
  .description("Edit task description")
  .action(editTaskDescription);

task.command("remove [taskId]").description("Remove task").action(removeTask);

await program.parseAsync();
db.close();
