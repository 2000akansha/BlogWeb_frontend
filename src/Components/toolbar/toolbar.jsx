// src/components/Toolbar.jsx
import React from "react";

const Toolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex gap-2 flex-wrap bg-white/10 p-2 rounded mb-2">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active-btn' : 'btn'}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active-btn' : 'btn'}>Italic</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active-btn' : 'btn'}>Underline</button>
      <button onClick={() => editor.chain().focus().setColor('#f00').run()} className="btn">Red</button>
      <button onClick={() => editor.chain().focus().setColor('#000').run()} className="btn">Black</button>
      <button onClick={() => editor.chain().focus().unsetColor().run()} className="btn">Clear Color</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn">1. List</button>
    </div>
  );
};

export default Toolbar;
