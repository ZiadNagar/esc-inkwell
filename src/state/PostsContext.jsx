import { useMemo, useState } from "react";
import {
  createPost,
  deletePost,
  getPostById,
  getPostBySlug,
  loadPosts,
  updatePost,
} from "./postsStorage.js";

import { PostsContext } from "./postsContextShared.js";

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState(loadPosts());

  const refresh = () => setPosts(loadPosts());

  const create = (payload) => {
    const p = createPost(payload);
    setPosts(loadPosts());
    return p;
  };

  const update = (id, updates) => {
    const p = updatePost(id, updates);
    setPosts(loadPosts());
    return p;
  };

  const remove = (id) => {
    deletePost(id);
    setPosts(loadPosts());
  };

  const getById = (id) => getPostById(id);
  const getBySlug = (slug) => getPostBySlug(slug);

  const value = useMemo(
    () => ({ posts, refresh, create, update, remove, getById, getBySlug }),
    [posts]
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};

// usePosts moved to postsContextShared.js to avoid Fast Refresh warning
