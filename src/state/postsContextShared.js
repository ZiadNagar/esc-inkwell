import { createContext, useContext } from "react";

export const PostsContext = createContext({
  posts: [],
  refresh: () => {},
  create: () => ({}),
  update: () => ({}),
  remove: () => {},
  getById: () => null,
  getBySlug: () => null,
});

export const usePosts = () => useContext(PostsContext);
