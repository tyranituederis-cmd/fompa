"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Pilcrow,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Tulis konten di sini…" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[240px] rounded-b-xl border border-t-0 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus-visible:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const btn = (active: boolean) =>
    cn(
      "rounded-lg p-1.5 transition-colors",
      active ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    );

  const setLink = () => {
    const url = window.prompt("URL tautan:");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL gambar:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-slate-300 dark:border-slate-700 bg-slate-50 p-2 dark:bg-slate-800">
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="Tebal">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Miring">
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()} title="Coret">
          <Strikethrough className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-600" />
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Subjudul">
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Sub-subjudul">
          <Heading3 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("paragraph"))} onClick={() => editor.chain().focus().setParagraph().run()} title="Paragraf">
          <Pilcrow className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-600" />
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Daftar">
          <List className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Daftar bernomor">
          <ListOrdered className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Kutipan">
          <Quote className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-600" />
        <button type="button" className={btn(editor.isActive("link"))} onClick={setLink} title="Tautan">
          <Link2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(false)} onClick={addImage} title="Gambar">
          <ImageIcon className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-600" />
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
