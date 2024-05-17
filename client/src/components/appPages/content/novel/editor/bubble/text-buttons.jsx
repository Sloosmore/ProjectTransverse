import { cn } from "@/lib/utils";
import { EditorBubbleItem, useEditor } from "novel";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  HighlighterIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;
  const items = [
    {
      name: "bold",
      isActive: (editor) => editor.isActive("bold"),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: (editor) => editor.isActive("italic"),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: (editor) => editor.isActive("underline"),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: (editor) => editor.isActive("strike"),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
    {
      name: "Highlight",
      isActive: (editor) => editor.isActive("highlight"),
      command: (editor) => editor.chain().focus().toggleHighlight().run(),
      icon: HighlighterIcon,
    },
    {
      name: "Wiki",
      command: (editor) => {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        window.open(`https://en.wikipedia.org/wiki/${selectedText}`, "_blank");
      },
      icon: "Wiki",
    },
  ];
  return (
    <div className="flex border-l	">
      {items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor);
          }}
          className="flex"
        >
          <Button size="icon" className="rounded-none " variant="ghost">
            {item.icon === "Wiki" ? (
              <i className="bi bi-wikipedia h-4 w-4"></i>
            ) : (
              <item.icon
                className={cn("h-4 w-4", {
                  "text-blue-500": item.isActive(editor),
                })}
              />
            )}
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
