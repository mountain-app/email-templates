import express from "express";
import { readFile } from "fs/promises";
import logger from "./logger";
import renderHbs from "./utils/hbs/render";
import listMJMLs from "./utils/mjml/list";
import renderMJML, { RenderKind } from "./utils/mjml/render";

const app = express();
const port = 3000;

app.get("/preview", async (_, res) => {
  const templatesAndPartials = await listMJMLs();
  const landingPageContent = await readFile("./src/views/index.hbs", "utf-8");
  const landingPageHtml = renderHbs(landingPageContent, {
    links: templatesAndPartials,
  });

  res.send(landingPageHtml);
});

app.get("/preview/:kind(templates|partials)/:name", async (req, res) => {
  const { kind, name } = req.params;

  try {
    const html = await renderMJML(kind as RenderKind, name);
    res.send(html);
  } catch (error) {
    logger.error(error);
    res.status(404).send(`${kind}/${name} not found`);
  }
});

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}/preview`);
});
