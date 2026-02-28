import DOMPurify from "dompurify";
import {generateHTML, JSONContent} from "@tiptap/react";
import {tiptapExtensions} from "@/component/TextEditor/tiptapExtensions.ts";
import {HTMLAttributes} from "react";

type Props = {
  readonly jsonContent: JSONContent | null,
}

/*用來顯示富文本的組件*/
export default function RichTextShow({jsonContent, className}:Props &  HTMLAttributes<HTMLDivElement>) {

  const html = jsonContent ? DOMPurify.sanitize(generateHTML(jsonContent, tiptapExtensions)) : '（無）';

  return <div className={className}
    dangerouslySetInnerHTML={{
      __html: html
    }}/>
}