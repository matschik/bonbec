#!/usr/bin/env node
import axios from "axios";
import fs from "fs/promises";
import nodePath from "path";

const [name] = process.argv.slice(2);

const GIST_ID = "0dbcdf970f1cd5f8b16c0a0e3501cfd0";

(async function main() {
  const response = await axios.get(`https://api.github.com/gists/${GIST_ID}`);
  const { files } = response.data;

  if (!name) {
    logAvailableFiles(files);
    return;
  }

  const requestedFilename = `${name}.js`;
  const file = files[requestedFilename];

  if (file) {
    const path = nodePath.resolve(requestedFilename);
    await fs.writeFile(path, file.content);
    console.info(`🎉 Created file: ${path}`);
  } else {
    console.info("File not found.", "\n");
    logAvailableFiles(files)
  }
})();

function logAvailableFiles(files) {
  console.info(`📓 Available files in https://gist.github.com/${GIST_ID}`);
  for (const filename of Object.keys(files)) {
    console.info(`- ${filename}`);
  }
}
