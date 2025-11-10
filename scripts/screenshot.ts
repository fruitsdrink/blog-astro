import { chromium, type Browser, type Page } from "playwright";
import inquirer from "inquirer";
import { URL } from "node:url";

type ScreenshotOptions = {
  url: string;
  outputPath: string;
  height: number;
};

function validateUrl(input: string): boolean | string {
  if (input.trim() === "") {
    return "URL 不能为空";
  }
  try {
    new URL(input);
    return true;
  } catch {
    return "请输入有效的 URL（例如: https://example.com）";
  }
}

function generateFileName(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, "");
    const pathname = urlObj.pathname
      .replace(/^\//, "")
      .replace(/\//g, "-")
      .replace(/\.html?$/, "");
    const filename = pathname ? `${hostname}-${pathname}` : hostname;
    return `${filename}.png`;
  } catch {
    return "screenshot.png";
  }
}

function validateHeight(input: string): boolean | string {
  if (input.trim() === "") {
    return true; // 允许为空，表示全页面截图
  }
  const height = parseInt(input, 10);
  if (isNaN(height) || height < 0) {
    return "请输入有效的数字（0 表示全页面截图）";
  }
  return true;
}

async function promptUser(): Promise<ScreenshotOptions> {
  const { url } = await inquirer.prompt<{ url: string }>([
    {
      type: "input",
      name: "url",
      message: "请输入要截图的网址:",
      default: "https://typescale.com",
      validate: validateUrl,
    },
  ]);

  const defaultOutputPath = generateFileName(url);
  const { outputPath } = await inquirer.prompt<{ outputPath: string }>([
    {
      type: "input",
      name: "outputPath",
      message: "请输入输出文件路径（留空自动生成）:",
      default: defaultOutputPath,
    },
  ]);

  const { heightInput } = await inquirer.prompt<{ heightInput: string }>([
    {
      type: "input",
      name: "heightInput",
      message: "请输入截图高度（留空或0表示全页面截图，默认680）:",
      default: "680",
      validate: validateHeight,
    },
  ]);

  const height =
    heightInput.trim() === "" || heightInput === "0"
      ? 0
      : parseInt(heightInput, 10);

  return {
    url,
    outputPath: outputPath.trim() || defaultOutputPath,
    height,
  };
}

async function captureScreenshot(
  url: string,
  outputPath: string,
  height: number
): Promise<void> {
  const browser: Browser = await chromium.launch();
  const page: Page = await browser.newPage();

  // 设置视口大小
  const viewportHeight = height > 0 ? height : 1080;
  await page.setViewportSize({ width: 1920, height: viewportHeight });

  // 访问网页
  console.log(`正在访问 ${url}...`);
  await page.goto(url, { waitUntil: "networkidle" });

  // 等待页面完全加载
  await page.waitForTimeout(2000);

  // 截图
  console.log("正在截图...");
  if (height > 0) {
    // 截取指定高度
    await page.screenshot({
      path: outputPath,
      fullPage: false, // 只截取视口
    });
  } else {
    // 截取全页面
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });
  }

  await browser.close();
  console.log(`截图已保存到: ${outputPath}`);
}

async function main(): Promise<void> {
  try {
    const { url, outputPath, height } = await promptUser();
    await captureScreenshot(url, outputPath, height);
  } catch (error) {
    if (error instanceof Error) {
      console.error("截图失败:", error.message);
    } else {
      console.error("截图失败:", error);
    }
    process.exit(1);
  }
}

main();
