import {
  readdir,
  stat,
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "fs";
import mjml2html from "mjml";
import { join, resolve } from "path";

const BASE_PATH = resolve(__dirname, "..");
const BASE_TEMPLATES_PATH = resolve(BASE_PATH, "./src/templates");
const OUTPUT_DIR = "out";

function main(dirPath: string, parentDir?: string) {
  readdir(dirPath, (readDirErr, files) => {
    if (readDirErr) {
      console.log("Error: ", readDirErr);
      return;
    }
    files.forEach((file) => {
      const fullPath = join(dirPath, file);

      stat(fullPath, (statErr, f) => {
        if (statErr) {
          console.log("Error: ", statErr);
          return;
        }

        if (f.isDirectory()) {
          main(fullPath, file);
        } else if (/\.mjml$/.test(fullPath)) {
          const mjml = readFileSync(resolve(dirPath, fullPath), "utf-8");
          const output = mjml2html(mjml, {
            filePath: dirPath,
            validationLevel: "strict",
          });

          if (output.errors.length) {
            console.error(`Error while writing ${fullPath} output:`);
            output.errors.forEach((err) => console.error(err));
            return;
          }
          const outputDir = `${OUTPUT_DIR}/${parentDir ?? ""}`;

          if (!existsSync(outputDir)) {
            mkdirSync(resolve(BASE_PATH, outputDir), { recursive: true });
          }

          writeFileSync(
            resolve(BASE_PATH, outputDir, file.replace(".mjml", ".hbs")),
            output.html
          );
        }
      });
    });
  });
}

main(BASE_TEMPLATES_PATH);
