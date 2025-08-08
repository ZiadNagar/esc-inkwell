import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { usePosts } from "../state/postsContextShared.js";
import { useAuth } from "../state/AuthContext.jsx";
import { Button } from "../components/ui/button.jsx";
import { Pencil, Trash2 } from "lucide-react";
import { PageTransition } from "../components/motion/PageTransition.jsx";
import { useToast } from "../components/ui/toast.jsx";
import { ConfirmDialog } from "../components/ui/confirm-dialog.jsx";
import { MarkdownRenderer } from "../components/MarkdownRenderer.jsx";

export const PostViewPage = () => {
  const { slugOrId } = useParams();
  const { getById, getBySlug, remove } = usePosts();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const bySlug = getBySlug(slugOrId);
    const byId = getById(slugOrId);
    setPost(bySlug || byId || null);
  }, [slugOrId, getById, getBySlug]);

  const canEdit = useMemo(() => {
    if (!post || !currentUser) return false;
    return post.author?.toLowerCase() === currentUser.username?.toLowerCase();
  }, [post, currentUser]);

  const handleDelete = () => {
    if (!post) return;
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!post) return;
    remove(post.id);
    addToast({
      title: "Post deleted",
      description: "Your post has been removed.",
    });
    setConfirmOpen(false);
    navigate("/app");
  };

  if (!post) {
    return (
      <div className="container py-10">
        <Button asChild>
          <Link to="/app/posts">Posts list</Link>
        </Button>
        <p className="mt-6 text-sm text-[--color-muted-foreground]">
          Post not found.
        </p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container py-10">
        <ConfirmDialog
          open={confirmOpen}
          title="Delete this post?"
          description="This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link to="/app/posts">Posts list</Link>
            </Button>
          </div>

          <div className="flex gap-2">
            {canEdit && (
              <>
                <Button asChild>
                  <Link to={`/app/edit/${post.id}`}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  aria-label="Delete post"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <article className="prose prose-invert max-w-none">
          <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
          <p className="mb-8 text-sm text-[--color-muted-foreground]">
            By {post.author} •{" "}
            <time dateTime={post.updatedAt}>
              {new Date(post.updatedAt).toLocaleString()}
            </time>
          </p>
          <RenderContent content={post.content} />
        </article>
      </div>
    </PageTransition>
  );
};

const RenderContent = ({ content }) => {
  if (!content) return null;
  const looksHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (looksHtml) {
    return (
      <div
        className="space-y-4 [&_p]:my-2 [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:my-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_img]:max-w-full [&_img]:h-auto [&_pre]:bg-black/40 [&_pre]:text-sm [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return <MarkdownRenderer markdown={content} />;
};
