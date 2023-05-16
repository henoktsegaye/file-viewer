import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";
import { Command } from "commander";
const program = new Command();
program
  .version("0.0.1")
  .description(
    "A simple cli app that lists and shows the content of a directory"
  )
  .option("-l, --list", "list the content of a directory")
  .option("-s, --show <path>", "show the content of a file")
  .parse(process.argv);
const options = program.opts();

const readDirectoryFiles = (path: string) => {
  fs.readdir(path, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }

    const fileList = files.map((file) => {
      if (file.isDirectory()) {
        return `📂 ${file.name}`;
      }
      return `📄 ${file.name}`;
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "file",
          message: "Select a file to show the content",
          choices: fileList,
        },
      ])
      .then((answers) => {
        const file = answers.file;
        if (file.startsWith("📂")) {
          return readDirectoryFiles(`${path}${file.replace("📂 ", "/")}`);
        }
        console.log(chalk.green(file));
        readFile(`${path}${file.replace("📄 ", "/")}`);
      });
  });
};

const readFile = (path) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      console.log(chalk.red("Error", err.message));
      return;
    }
    console.log(data);
  });
};

// if the list option is passed  we list the content of the directory
if (options.list) {
  readDirectoryFiles(process.cwd());
}

if (options.show) {
  readFile(process.cwd() + "/" + options.show);
}
