import path from "path";

export const isMdxFile = (filePath: string): boolean => path.extname(filePath) === '.mdx';