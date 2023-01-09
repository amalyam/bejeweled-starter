import fs from "fs";
import path from "path";

export const parseSampleData = () => {
  const sampleFile = fs
    .readFileSync(path.join(process.cwd(), "sample-data.txt"))
    .toString()
    .trim();
  const lines = sampleFile.split("\n");
  return lines.map((line) => {
    let trimmed = line.trim();
    return trimmed.split("  ");
  });
};
