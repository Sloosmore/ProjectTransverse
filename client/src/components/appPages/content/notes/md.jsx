import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./md.css";
import DOMPurify from "dompurify";

const MarkdownElement = ({ element, index, handleDoubleClick }) => {
  // Function to replace ==text== with <mark>text</mark>
  const replaceWithMarkTags = (text) => {
    return text.replace(/==([^==]+)==/g, "<mark>$1</mark>");
  };

  // Sanitize and transform the element content
  const transformedElement = DOMPurify.sanitize(replaceWithMarkTags(element));

  return (
    <div key={index} onDoubleClick={() => handleDoubleClick(element)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        children={transformedElement}
      />
    </div>
  );
};

export default MarkdownElement;
