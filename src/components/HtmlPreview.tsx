import fs from "fs";

type Props = {
  postId: string;
  height?: number;
  showNewWindowPreview?: boolean;
  jsFiddle?: string;
};
export const HtmlPreview = async ({
  postId,
  height = 360,
  showNewWindowPreview = false,
  jsFiddle,
}: Props) => {
  const html = fs.readFileSync(
    `src/content/posts/${postId}/preview.html`,
    "utf-8"
  );

  return (
    <div>
      <div className={`w-full h-[${height}px] rounded-md overflow-hidden`}>
        <iframe className="w-full h-full" srcDoc={html}></iframe>
      </div>
      {showNewWindowPreview && (
        <div className="mt-2 flex justify-center gap-2">
          <a href={`/posts/${postId}/preview.html`} target="_blank">
            新窗口预览
          </a>
          {jsFiddle && (
            <a href={jsFiddle} target="_blank">
              在线预览
            </a>
          )}
        </div>
      )}
    </div>
  );
};
