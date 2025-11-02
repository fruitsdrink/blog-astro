import Readline from "node:readline";
import fs from "node:fs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);
import inquirer from "inquirer";
import AdmZip from "adm-zip";

const JSFIDDLE_USERNAME = "fruritsdrink";

type PostData = {
  name: string;
  title: string;
  tags: string;
  description: string;
  jsfiddle: string;
  bilibili: string;
  youtube: string;
  preview: boolean;
};

// async function main() {
//   const success = await downloadJsFiddle(
//     "https://jsfiddle.net/fruritsdrink/uthx1bzd/31"
//   );
//   if (success) {
//     console.log(success);
//     console.log("Test download completed successfully");
//   } else {
//     console.error("Test download failed");
//   }
// }
function main() {
  inquirer
    .prompt<PostData>([
      {
        type: "input",
        name: "name",
        message: "请输入文章名称:",
        validate: (input) => {
          if (input.trim() === "") {
            return "文章名称不能为空";
          }
          if (fs.existsSync(getPostPath(input))) {
            return "文章名称已存在";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "title",
        message: "请输入文章标题:",
      },
      {
        type: "input",
        name: "tags",
        message: "请输入文章标签:",
      },
      {
        type: "input",
        name: "description",
        message: "请输入文章描述:",
      },
      {
        type: "confirm",
        name: "preview",
        message: "是否启用预览?",
        default: true,
      },
      {
        type: "input",
        name: "jsfiddle",
        message: "请输入jsfiddle链接:",
      },
      {
        type: "input",
        name: "bilibili",
        message: "请输入bilibili链接:",
      },
      {
        type: "input",
        name: "youtube",
        message: "请输入youtube链接:",
      },
    ])
    .then(async (answers) => {
      const { name, jsfiddle, youtube, bilibili } = answers;
      const postPath = getPostPath(name);
      // 检查目录是否存在
      if (!fs.existsSync(postPath)) {
        fs.mkdirSync(postPath, { recursive: true });
      }

      // 文章文件
      createPostFile(postPath, answers);
      createPreviewFile({
        name,
        postPath,
      });
      if (jsfiddle) {
        const htmlFile = await downloadJsFiddle(jsfiddle);
        if (htmlFile) {
          // 读取内容
          const content = fs.readFileSync(htmlFile, "utf-8");
          createPreviewFile({
            name,
            postPath,
            content,
          });
          // 删除临时文件
          fs.unlinkSync(htmlFile);
        }
      }
      createDataFile({
        postPath,
        jsfiddle,
        youtube,
        bilibili,
      });
    });
}

main();

function getPostPath(name: string) {
  return `src/content/posts/${name.toLowerCase().replace(/ /g, "-")}`;
}

function getCurrentTime() {
  // 获取东八区时间
  const currentTime = dayjs()
    .tz("Asia/Shanghai")
    .format("YYYY-MM-DDTHH:mm:ssZ");
  return currentTime;
}

function getTemplate(templateName: string) {
  return fs.readFileSync(`scripts/template/new-post/${templateName}`, "utf-8");
}

function createPostFile(postPath: string, postData: PostData) {
  const { name, title, tags, description, preview } = postData;

  const postFileName = `${postPath}/index.mdx`;

  // 获取东八区时间
  const currentTime = getCurrentTime();

  // 读取模板
  const template = getTemplate("index.mdx");

  const postTitle = title || name;
  const postTags = tags.split(",").map((tag) => tag.trim());
  const content = template
    .replace("{{title}}", postTitle)
    .replace("{{date}}", currentTime)
    .replace("{{postId}}", name)
    .replace('"{{tags}}"', `${postTags}`)
    .replace("{{description}}", description)
    .replace('"{{preview}}"', preview.toString());

  fs.writeFileSync(postFileName, content);
  console.log(`Post created successfully: ${postFileName}`);
}

/**
 * 下载 JsFiddle 文件
 * @param jsFiddle - JsFiddle URL 或 ID
 * @returns Promise<boolean> - 下载是否成功
 */
async function downloadJsFiddle(jsFiddle: string): Promise<string> {
  const JSFIDDLE_DIR = ".jsfiddle";
  const tempFileName = `${JSFIDDLE_DIR}/jsFiddle.zip`;

  try {
    // 验证输入
    if (!jsFiddle || typeof jsFiddle !== "string" || jsFiddle.trim() === "") {
      throw new Error("Invalid jsFiddle URL or ID");
    }

    // 构建下载 URL
    let downloadUrl: string;
    const urlObj = new URL(jsFiddle);
    // 如果是完整的 URL，提取 ID 部分
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2 && pathParts[0] === JSFIDDLE_USERNAME) {
      const fiddleId = pathParts[1];
      const version = pathParts[2];

      downloadUrl = `https://jsfiddle.net/${fiddleId}/${version}/download`;
    } else {
      throw new Error("Invalid jsFiddle URL format");
    }

    console.log(`Downloading jsFiddle from ${downloadUrl}`);

    // 创建临时目录（如果不存在）
    if (!fs.existsSync(JSFIDDLE_DIR)) {
      fs.mkdirSync(JSFIDDLE_DIR, { recursive: true });
    }

    // 下载文件
    const response = await fetch(downloadUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; jsfiddle-downloader/1.0)",
      },
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(
        `Failed to download jsFiddle: ${response.status} ${response.statusText}`
      );
    }

    // 检查 Content-Type（可选，但有助于调试）
    const contentType = response.headers.get("content-type");
    if (
      contentType &&
      !contentType.includes("zip") &&
      !contentType.includes("octet-stream")
    ) {
      console.warn(`Unexpected content-type: ${contentType}`);
    }

    // 获取文件内容
    const arrayBuffer = await response.arrayBuffer();

    // 检查文件大小（JsFiddle 下载通常至少有几个 KB）
    const fileSize = arrayBuffer.byteLength;
    if (fileSize === 0) {
      throw new Error("Downloaded file is empty");
    }
    if (fileSize < 1024) {
      console.warn(
        `Downloaded file is very small (${fileSize} bytes), might be an error page`
      );
    }

    // 写入文件
    fs.writeFileSync(tempFileName, Buffer.from(arrayBuffer));
    console.log(
      `✓ JsFiddle downloaded successfully: ${tempFileName} (${(
        fileSize / 1024
      ).toFixed(2)} KB)`
    );

    const zip = new AdmZip(tempFileName);
    let htmlFile = "";
    zip.getEntries().forEach((entry) => {
      console.log(entry.name);
      // 如果是html文件，则复制到JSFIDDLE_DIR
      if (entry.name.endsWith(".html")) {
        console.log(`Copying ${entry.name} to ${JSFIDDLE_DIR}/${entry.name}`);
        // 检查文件是否存在，如果存在则删除
        if (fs.existsSync(`${JSFIDDLE_DIR}/${entry.name}`)) {
          fs.unlinkSync(`${JSFIDDLE_DIR}/${entry.name}`);
        }
        // 解压
        zip.extractEntryTo(entry.name, JSFIDDLE_DIR, true);
        htmlFile = entry.name;
      }
    });
    // zip.extractAllTo(JSFIDDLE_DIR, true);
    console.log(`✓ JsFiddle extracted successfully: ${JSFIDDLE_DIR}`);
    // 删除临时文件
    fs.unlinkSync(tempFileName);
    console.log(`✓ JsFiddle deleted successfully: ${tempFileName}`);

    return `${JSFIDDLE_DIR}/${htmlFile}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Failed to download jsFiddle: ${errorMessage}`);

    // 如果下载失败，清理可能创建的部分文件
    if (fs.existsSync(tempFileName)) {
      try {
        fs.unlinkSync(tempFileName);
        console.log(`Cleaned up partial download: ${tempFileName}`);
      } catch (cleanupError) {
        console.warn(`Failed to clean up partial download: ${cleanupError}`);
      }
    }

    return "";
  }
}

function createPreviewFile(data: {
  name: string;
  postPath: string;
  content?: string;
}) {
  const { name, postPath } = data;
  const previewFileName = `${postPath}/preview.html`;
  if (fs.existsSync(previewFileName)) {
    // 删除
    fs.unlinkSync(previewFileName);
  }
  const template = getTemplate("preview.html");

  const content = data.content
    ? data.content
    : template.replace("{{title}}", name);
  fs.writeFileSync(previewFileName, content);
}

function createDataFile(data: {
  postPath: string;
  jsfiddle?: string;
  youtube?: string;
  bilibili?: string;
}) {
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
  let jsonContent = dataTemplate;
  if (data.jsfiddle) {
    jsonContent = jsonContent.replace("{{jsfiddle}}", data.jsfiddle);
  }
  if (data.youtube) {
    jsonContent = jsonContent.replace("{{youtube}}", data.youtube);
  }
  if (data.bilibili) {
    jsonContent = jsonContent.replace("{{bilibili}}", data.bilibili);
  }
  fs.writeFileSync(dataFileName, jsonContent);

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
