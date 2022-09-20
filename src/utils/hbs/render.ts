import { compile } from "handlebars";

const renderHbs = (content: string, data: any) => {
  const template = compile(content);

  return template(data);
};

export default renderHbs;
