import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import mjml2html from "mjml";
import renderHbs from "../hbs/render";

export type RenderKind = "templates" | "partials";

export const wrapper = (content: string) =>
  `<mjml>
        <mj-body>
            <mj-container>
                ${content}
            </mj-container>
        </mj-body>
    </mjml>`;

const renderMJML = async (kind: RenderKind, name: string): Promise<string> => {
  const path = resolve("./src", kind, name, "index.mjml");
  const dataPath = resolve(dirname(path), "data.json");

  const [content, data] = await Promise.all([
    readFile(path, "utf8"),
    readFile(dataPath, "utf8"),
  ]);

  const input = kind === "partials" ? wrapper(content) : content;

  const output = mjml2html(input, {
    filePath: dirname(path),
    beautify: true,
    validationLevel: "strict",
  });

  return renderHbs(output.html, JSON.parse(data));
};

export default renderMJML;
