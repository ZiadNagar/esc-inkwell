import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "inkwell_posts";

export const loadPosts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const savePosts = (posts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const generateSlug = (title) => {
  const base = String(title || "post")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return base || `post-${Date.now()}`;
};

export const ensureUniqueSlug = (desiredSlug, posts, ignoreId = null) => {
  const base = desiredSlug || "post";
  let slug = base;
  let counter = 1;
  const isTaken = (s) =>
    posts.some((p) => p.slug === s && (ignoreId ? p.id !== ignoreId : true));
  while (isTaken(slug)) {
    slug = `${base}-${counter++}`;
  }
  return slug;
};

export const createPost = ({ title, content, author, slug }) => {
  const posts = loadPosts();
  const now = new Date().toISOString();
  const id = uuidv4();
  const computedSlug = ensureUniqueSlug(
    slug?.trim() || generateSlug(title),
    posts
  );
  const post = {
    id,
    title: title?.trim() || "Untitled",
    content: content || "",
    author: author?.trim() || "Anonymous",
    slug: computedSlug,
    createdAt: now,
    updatedAt: now,
  };
  posts.unshift(post);
  savePosts(posts);
  return post;
};

export const updatePost = (id, updates) => {
  const posts = loadPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = {
    ...posts[idx],
    ...updates,
    title: updates?.title?.trim() ?? posts[idx].title,
    author: updates?.author?.trim() ?? posts[idx].author,
    slug: updates?.slug
      ? ensureUniqueSlug(updates.slug.trim(), posts, id)
      : posts[idx].slug,
    updatedAt: new Date().toISOString(),
  };
  posts[idx] = updated;
  savePosts(posts);
  return updated;
};

export const deletePost = (id) => {
  const posts = loadPosts();
  const filtered = posts.filter((p) => p.id !== id);
  savePosts(filtered);
};

export const getPostById = (id) => loadPosts().find((p) => p.id === id) || null;
export const getPostBySlug = (slug) =>
  loadPosts().find((p) => p.slug === slug) || null;
