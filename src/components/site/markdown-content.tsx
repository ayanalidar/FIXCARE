"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a markdown string using react-markdown + remark-gfm with the
 * `prose-wecare` class so all headings, lists, links, blockquotes, tables
 * and hr are styled consistently across every page.
 */
export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={`prose-wecare ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Render links so internal links use Next.js Link-free anchor (still works fine)
          a: ({ node, ...props }) => <a {...props} />,
          h1: ({ node, ...props }) => <h1 {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto wecare-scroll">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
