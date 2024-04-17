import { cn } from "@/lib/utils";
import { EditorBubbleItem, useEditor } from "novel";
import { Play, Speech } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Playback = ({ setglobalSeek }) => {
  const { editor } = useEditor();
  if (!editor) return null;
  const items = [
    {
      name: "speak",
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.commands.speak(),
      icon: Speech,
    },
    {
      name: "play",
      isActive: (editor) => editor.isActive("highlight"),
      command: (editor) => {
        const time = editor.commands.getTime();
        setglobalSeek(time / 1000);
      },
      icon: Play,
    },
  ];
  return (
    <div className="flex border-l">
      {items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor);
          }}
        >
          <Button size="icon" className="rounded-none" variant="ghost">
            <item.icon className={cn("h-4 w-4", {})} />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};

export default Playback;
