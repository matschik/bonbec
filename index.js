#!/usr/bin/env node
import axios from "axios";
import fs from "fs/promises";
import nodePath from "path";

const [name] = process.argv.slice(2);

const GIST_ID = "aaf199c5ecfa445a6c9ac3613ced5dc3";

(async function main() {
  const response = await axios.get(`https://api.github.com/gists/${GIST_ID}`);
  const { files } = response.data;
  const filenames = Object.keys(files);

  if (!name) {
    logAvailableFiles(filenames);
    return;
  }

  const requestedFilename = `${name}.js`;
  const file = files[requestedFilename];

  if (file) {
    const path = nodePath.resolve(requestedFilename);
    await fs.writeFile(path, file.content);
    console.info(`🎉 Created file: ${path}`);
  } else if (name) {
    const filenamesIncludingName = Object.keys(files).filter((filename) =>
      filename.toLowerCase().includes(name.toLowerCase())
    );
    if (filenamesIncludingName.length > 0) {
      console.info("😔 File not found. Did you mean ?", "\n");
      logAvailableFiles(filenamesIncludingName);
    } else {
      console.info("😔 File not found", "\n");
      logAvailableFiles(filenames);
    }
  }
})();

function logAvailableFiles(filenames) {
  console.info(`📓 Available files in https://gist.github.com/${GIST_ID}`);
  for (const filename of filenames) {
    console.info(`- ${filename}`);
  }
}
