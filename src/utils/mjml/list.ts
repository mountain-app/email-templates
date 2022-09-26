import { readdir } from "fs/promises";

const listMJMLs = async (): Promise<string[]> => {
  const [templates] = await Promise.all([
    readdir("./src/templates"),
    // readdir("./src/partials"),
  ]);

  return [
    ...templates.map((template) => `templates/${template}`),
    // ...partials.map((partial) => `partials/${partial}`),
  ];
};

export default listMJMLs;
