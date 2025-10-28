import Readline from "node:readline";
import fs from "node:fs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);

function main() {
  const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the title of the post: ", (title: string) => {
    if (title.trim() === "") {
      console.log("Title is required");
    } else {
      const postPath = `src/content/posts/${title
        .toLowerCase()
        .replaceAll(/ /g, "-")}`;
      // 检查目录是否存在
      if (!fs.existsSync(postPath)) {
        fs.mkdirSync(postPath, { recursive: true });
      }

      // 文章文件
      createPostFile({
        title,
        postPath,
      });
      createPreviewFile({
        title,
        postPath,
      });
      createDataFile({
        postPath,
      });
    }
    rl.close();
  });
}

main();

function createPostFile(data: { title: string; postPath: string }) {
  const { title, postPath } = data;
  const postFileName = `${postPath}/index.mdx`;
  if (fs.existsSync(postFileName)) {
    console.log("Post file already exists");
    return;
  }

  // 获取东八区时间
  const currentTime = dayjs()
    .tz("Asia/Shanghai")
    .format("YYYY-MM-DDTHH:mm:ssZ");
  const template = fs.readFileSync(
    `scripts/template/new-post/index.mdx`,
    "utf-8"
  );
  const content = template
    .replace("{{title}}", title)
    .replace("{{date}}", currentTime);
  fs.writeFileSync(postFileName, content);
  console.log(`Post created successfully: ${postFileName}`);
}

function createPreviewFile(data: { title: string; postPath: string }) {
  const { title, postPath } = data;
  const previewFileName = `${postPath}/preview.html`;
  if (fs.existsSync(previewFileName)) {
    // 删除
    fs.unlinkSync(previewFileName);
  }
  const template = fs.readFileSync(
    `scripts/template/new-post/preview.html`,
    "utf-8"
  );
  const content = template.replace("{{title}}", title);
  fs.writeFileSync(previewFileName, content);
}

function createDataFile(data: { postPath: string }) {
  const srcPath = `${data.postPath}/_src`;
  if (!fs.existsSync(srcPath)) {
    fs.mkdirSync(srcPath, { recursive: true });
  } else {
    fs.rmdirSync(srcPath, { recursive: true });
  }

  const dataFileName = `${srcPath}/data.json`;
  const dataTemplate = fs.readFileSync(
    `scripts/template/new-post/_src/data.json`,
    "utf-8"
  );
  fs.writeFileSync(dataFileName, dataTemplate);

  const indexHtmlFileName = `${srcPath}/index.html`;
  const indexHtmlTemplate = fs.readFileSync(
    `scripts/template/new-post/_src/index.html`,
    "utf-8"
  );
  fs.writeFileSync(indexHtmlFileName, indexHtmlTemplate);

  const indexCssFileName = `${srcPath}/index.css`;
  const indexCssTemplate = fs.readFileSync(
    `scripts/template/new-post/_src/index.css`,
    "utf-8"
  );
  fs.writeFileSync(indexCssFileName, indexCssTemplate);

  const indexJsFileName = `${srcPath}/index.js`;
  const indexJsTemplate = fs.readFileSync(
    `scripts/template/new-post/_src/index.js`,
    "utf-8"
  );
  fs.writeFileSync(indexJsFileName, indexJsTemplate);
}
