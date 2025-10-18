import fs from "fs";

type Props = {
  postId: string;
  height?: number;
  showNewWindowPreview?: boolean;
};
export const HtmlPreview = async ({
  postId,
  height = 360,
  showNewWindowPreview = false,
}: Props) => {
  const html = fs.readFileSync(
    `src/content/posts/${postId}/preview.html`,
    "utf-8"
  );

  return (
    <div>
      <div className={`w-full rounded-md overflow-hidden`} style={{ height: `${height}px` }}>
        <iframe className="w-full h-full" srcDoc={html}></iframe>
      </div>
      {showNewWindowPreview && (
        <div className="mt-2 flex justify-center gap-2">
          <a href={`/posts/${postId}/preview`} target="_blank">
            新窗口预览
          </a>          
        </div>
      )}
    </div>
  );
};
