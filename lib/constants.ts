type BookType =
  | "print-book"
  | "photo-book"
  | "comic-book"
  | "magazine"
  | "yearbook"
  | "calendar"
  | "ebook";

type BookInfo = {
  fileType: string;
  pageCount: string;
  fonts: string;
  layers: string;
  pageSize?: string;
};

export const dataAccordingToType: Record<BookType, BookInfo> = {
  "print-book": {
    fileType: "PDF",
    pageCount: "2-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  "photo-book": {
    fileType: "PDF",
    pageCount: "24-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  "comic-book": {
    fileType: "PDF",
    pageCount: "4-800",
    fonts: "Embedded",
    layers: "Flattened",
    pageSize: "6.88 x 10.50 in",
  },
  magazine: {
    fileType: "PDF",
    pageCount: "4-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  yearbook: {
    fileType: "PDF",
    pageCount: "4-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  calendar: {
    fileType: "PDF",
    pageCount: "2-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  ebook: {
    fileType: "EPUB, DOCX, RTF, ODT, PDF",
    pageCount: "2-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
};
