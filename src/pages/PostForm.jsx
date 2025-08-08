import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePosts } from "../state/postsContextShared.js";
import { useAuth } from "../state/AuthContext.jsx";
import { Button } from "../components/ui/button.jsx";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Input } from "../components/ui/input.jsx";
import { generateSlug } from "../state/postsStorage.js";

export const PostFormPage = ({ mode = "create" }) => {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const { getById, create, update } = usePosts();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const existing = isEdit ? getById(id) : null;
  const [title, setTitle] = useState(existing?.title || "");
  const [slug, setSlug] = useState(existing?.slug || "");
  const [author, setAuthor] = useState(
    existing?.author || currentUser?.username || ""
  );
  const [content, setContent] = useState(existing?.content || "");
  const textareaRef = useRef(null);
  const editorRef = useRef(null);
  const [editorHtml, setEditorHtml] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const draftKey = useMemo(
    () => (isEdit ? `inkwell_draft_edit_${id}` : "inkwell_draft_create"),
    [isEdit, id]
  );

  useEffect(() => {
    if (isEdit && !existing) return;
    if (!isEdit && currentUser && !author) setAuthor(currentUser.username);
  }, [isEdit, existing, currentUser, author]);

  // Initialize WYSIWYG editor content from existing content if it's HTML
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const initial = content || "";
    const looksHtml = /<\/?[a-z][\s\S]*>/i.test(initial);
    if (looksHtml) {
      el.innerHTML = initial;
      setEditorHtml(initial);
    } else {
      // fallback: show plain text
      el.textContent = initial;
      setEditorHtml(el.innerHTML);
    }
    // ensure paragraphs are created as <p>
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {}
  }, []);

  // Load saved draft (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d?.title) setTitle(d.title);
      if (d?.slug) setSlug(d.slug);
      if (d?.author) setAuthor(d.author);
      if (editorRef.current && d?.html) {
        editorRef.current.innerHTML = d.html;
        setEditorHtml(d.html);
      }
    } catch {}
  }, [draftKey]);

  // Autosave draft
  useEffect(() => {
    const data = { title, slug, author, html: editorHtml };
    try {
      localStorage.setItem(draftKey, JSON.stringify(data));
    } catch {}
  }, [title, slug, author, editorHtml, draftKey]);

  const handleAutoSlug = () => {
    const auto = generateSlug(title);
    setSlug(auto);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = (editorHtml && editorHtml.trim()) || content;
    const payload = { title, content: body, author, slug };
    if (isEdit && existing) {
      const updated = update(existing.id, payload);
      localStorage.removeItem(draftKey);
      navigate(`/app/post/${updated.slug}`);
    } else {
      const created = create(payload);
      localStorage.removeItem(draftKey);
      navigate(`/app/post/${created.slug}`);
    }
  };

  const focusAndExec = (cmd, value = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(cmd, false, value);
    setEditorHtml(editorRef.current.innerHTML);
  };

  const insertAtCursor = (text) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((prev) => `${prev}${text}`);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const next = `${before}${text}${after}`;
    setContent(next);
    requestAnimationFrame(() => {
      const caret = start + text.length;
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  const wrapSelection = (prefix, suffix = "") => {
    const el = textareaRef.current;
    if (!el) return insertAtCursor(`${prefix}${suffix}`);
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const hasSelection = end > start;
    const selected = content.slice(start, end);
    const before = content.slice(0, start);
    const after = content.slice(end);
    const replacement = hasSelection
      ? `${prefix}${selected}${suffix}`
      : `${prefix}${suffix}`;
    const next = `${before}${replacement}${after}`;
    setContent(next);
    requestAnimationFrame(() => {
      let selStart = hasSelection
        ? start + prefix.length
        : start + prefix.length;
      let selEnd = hasSelection ? selStart + selected.length : selStart;
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  };

  const toggleHeadingForSelection = (level = 1) => {
    const el = textareaRef.current;
    const marker = "#".repeat(Math.max(1, Math.min(level, 6))) + " ";
    if (!el) return insertAtCursor(`${marker}`);
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const beforeAll = content.slice(0, start);
    const selected = content.slice(start, end) || content.slice(start, end);
    const afterAll = content.slice(end);
    // Determine lines to modify
    const preBreak = beforeAll.lastIndexOf("\n") + 1;
    const postBreak = content.indexOf("\n", end);
    const sliceStart = preBreak < 0 ? 0 : preBreak;
    const sliceEnd = postBreak === -1 ? content.length : postBreak;
    const block = content.slice(sliceStart, sliceEnd);
    const updatedBlock = block
      .split("\n")
      .map((line) => {
        const trimmed = line.replace(/^\s+/, "");
        // toggle if the same heading already present
        const headingRegex = /^(#{1,6})\s+/;
        if (headingRegex.test(trimmed)) {
          // replace existing with the new level
          return line.replace(headingRegex, marker);
        }
        return marker + trimmed;
      })
      .join("\n");
    const next = `${content.slice(0, sliceStart)}${updatedBlock}${content.slice(
      sliceEnd
    )}`;
    setContent(next);
    requestAnimationFrame(() => {
      const newStart = sliceStart;
      const newEnd = sliceStart + updatedBlock.length;
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    });
  };

  const wrapAsLink = () => {
    const el = textareaRef.current;
    if (!el) return insertAtCursor("[text](https://)\n\n");
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = content.slice(start, end) || "text";
    const before = content.slice(0, start);
    const after = content.slice(end);
    const replacement = `[${selected}](https://)`;
    const next = `${before}${replacement}${after}`;
    setContent(next);
    requestAnimationFrame(() => {
      // place caret inside url
      const urlStart = before.length + 2 + selected.length + 2; // rough position after ']( '
      const caret = before.length + replacement.length - 1; // before closing paren
      el.focus();
      el.setSelectionRange(caret - 1, caret - 1);
    });
  };

  const wrapAsCodeBlock = () => {
    const el = textareaRef.current;
    if (!el) return insertAtCursor("```\ncode\n```\n\n");
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = content.slice(start, end) || "code";
    const before = content.slice(0, start);
    const after = content.slice(end);
    const replacement = "```\n" + selected + "\n```\n\n";
    const next = `${before}${replacement}${after}`;
    setContent(next);
    requestAnimationFrame(() => {
      const caretStart = before.length + 4; // after ```\n
      const caretEnd = caretStart + selected.length;
      el.focus();
      el.setSelectionRange(caretStart, caretEnd);
    });
  };

  const handleInsertImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    const alt = imageAlt.trim() || "image";
    // insert into contentEditable editor
    if (editorRef.current) {
      document.execCommand("insertImage", false, url);
      // set alt by wrapping the last inserted image if possible
      const el = editorRef.current;
      const imgs = el.querySelectorAll("img");
      if (imgs.length) imgs[imgs.length - 1].alt = alt;
      setEditorHtml(el.innerHTML);
    } else {
      insertAtCursor(`![${alt}](${url})\n\n`);
    }
    setImageUrl("");
    setImageAlt("");
  };

  const handleUploadImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const alt = imageAlt.trim() || file.name || "image";
    if (editorRef.current) {
      document.execCommand("insertImage", false, dataUrl);
      const el = editorRef.current;
      const imgs = el.querySelectorAll("img");
      if (imgs.length) imgs[imgs.length - 1].alt = alt;
      setEditorHtml(el.innerHTML);
    } else {
      insertAtCursor(`![${alt}](${dataUrl})\n\n`);
    }
    setImageAlt("");
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit post" : "New post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-end gap-2">
                <div className="grow">
                  <label htmlFor="slug" className="text-sm">
                    Slug
                  </label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-title-slug"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAutoSlug}
                  aria-label="Generate slug"
                >
                  Auto
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="author" className="text-sm">
                Author
              </label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm">
                Content (Markdown)
              </label>
              {/* Formatting toolbar (limited set per request) */}
              <div className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-[--color-border] bg-[--color-muted] p-2">
                {/* Headings/P dropdown */}
                <div className="relative">
                  <select
                    className="h-9 rounded-md border border-[--color-border] bg-transparent px-2 text-sm"
                    defaultValue="p"
                    aria-label="Text style"
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "p") focusAndExec("formatBlock", "p");
                      if (v === "h1") focusAndExec("formatBlock", "h1");
                      if (v === "h2") focusAndExec("formatBlock", "h2");
                      if (v === "h3") focusAndExec("formatBlock", "h3");
                    }}
                  >
                    <option value="p">P</option>
                    <option value="h1">H1</option>
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                  </select>
                </div>

                {/* Bold */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => focusAndExec("bold")}
                  aria-label="Bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                {/* Italic */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => focusAndExec("italic")}
                  aria-label="Italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                {/* Underline */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => focusAndExec("underline")}
                  aria-label="Underline"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </Button>

                {/* Alignment dropdown */}
                <div className="relative">
                  <select
                    className="h-9 rounded-md border border-[--color-border] bg-transparent px-2 text-sm"
                    defaultValue="left"
                    aria-label="Alignment"
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "left") focusAndExec("justifyLeft");
                      if (v === "center") focusAndExec("justifyCenter");
                      if (v === "right") focusAndExec("justifyRight");
                      if (v === "justify") focusAndExec("justifyFull");
                    }}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justified</option>
                  </select>
                </div>

                {/* Unordered list */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => focusAndExec("insertUnorderedList")}
                  aria-label="Bullet list"
                >
                  <List className="w-4 h-4" />
                </Button>
                {/* Ordered list */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => focusAndExec("insertOrderedList")}
                  aria-label="Numbered list"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>

                <div className="ml-auto inline-flex items-center gap-2 text-xs text-[--color-muted-foreground]">
                  <ImageIcon className="w-4 h-4" />
                  Images: use the panel below
                </div>
              </div>
              {/* ContentEditable WYSIWYG */}
              <div
                id="content"
                ref={editorRef}
                contentEditable
                role="textbox"
                aria-multiline="true"
                className="min-h-[240px] max-h-[60vh] w-full overflow-auto rounded-2xl border border-[--color-border] bg-transparent p-3 text-base leading-relaxed break-words whitespace-pre-wrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]
                [&_p]:my-2 [&_strong]:font-semibold [&_em]:italic [&_u]:underline
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:my-3
                [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:my-3
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:my-2
                [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1
                [&_img]:max-w-full [&_img]:h-auto [&_pre]:bg-black/40 [&_pre]:text-sm [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto"
                placeholder="Write your post..."
                onInput={(e) => setEditorHtml(e.currentTarget.innerHTML)}
                onBlur={(e) => setEditorHtml(e.currentTarget.innerHTML)}
              />
              <div className="grid gap-2 rounded-xl border border-[--color-border] p-3">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="grow">
                    <label htmlFor="imageUrl" className="text-xs">
                      Image URL
                    </label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... or data:image/..."
                    />
                  </div>
                  <div className="w-40">
                    <label htmlFor="imageAlt" className="text-xs">
                      Alt text
                    </label>
                    <Input
                      id="imageAlt"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="optional"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleInsertImageUrl}
                    aria-label="Insert image by URL"
                  >
                    Insert
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="imageFile"
                    className="text-xs text-[--color-muted-foreground]"
                  >
                    Or upload an image file
                  </label>
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadImageFile(e.target.files?.[0])}
                    className="text-xs"
                    aria-label="Upload image file"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Save changes" : "Publish"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
