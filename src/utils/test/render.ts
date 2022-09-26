import { readFile } from "fs/promises";
import mjml2html from "mjml";
import { parse } from "path";

export const renderPartial = async (fileName: string) => {
  const wrapper = `
    <mjml>
        <mj-body>
            ${await readFile(fileName, "utf-8")}
        </mj-body>
    </mjml>
  `;

  return mjml2html(wrapper, {
    validationLevel: "strict",
    filePath: parse(fileName).dir,
  });
};

export const renderTemplate = async (fileName: string) => {
  return mjml2html(await readFile(fileName, "utf-8"), {
    validationLevel: "strict",
    filePath: parse(fileName).dir,
  });
};
