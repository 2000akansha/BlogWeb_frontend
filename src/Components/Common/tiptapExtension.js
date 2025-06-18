import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Typography from "@tiptap/extension-typography";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import {Extension} from "@tiptap/core";

// Custom FontSize Extension using inline styles
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

// Custom FontWeight Extension
const FontWeight = Extension.create({
  name: "fontWeight",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (element) => element.style.fontWeight?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontWeight) return {};
              return {
                style: `font-weight: ${attributes.fontWeight}`,
              };
            },
          },
        },
      },
    ];
  },
});

export const commonTiptapExtensions = [
  // Base setup, disabling built-in heading and lists
  StarterKit.configure({
    heading: false,
    bulletList: false,
    orderedList: false,
  }),

  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  Paragraph,
  Bold,
  Italic,
  Underline,
  Typography,

  BulletList.configure({
    keepMarks: true,
    keepAttributes: true,
  }),

  OrderedList.configure({
    keepMarks: true,
    keepAttributes: true,
  }),

  TextStyle, // Enables dynamic inline styles like font, size, etc.
  Color.configure({ types: ["textStyle"] }),
  FontFamily.configure({ types: ["textStyle"] }),
  FontSize,
  FontWeight,

  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right", "justify"],
  }),
];
