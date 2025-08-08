import { Link } from "react-router-dom";
import { usePosts } from "../state/postsContextShared.js";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { PenSquare, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
const MotionDiv = motion.div;

export const PostsListPage = () => {
  const { posts } = usePosts();

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/app">
              <ArrowLeft className="w-4 h-4 mr-2" /> Home
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Posts</h1>
        </div>
        <Button asChild>
          <Link to="/app/new">
            <PenSquare className="w-4 h-4 mr-2" /> New post
          </Link>
        </Button>
      </div>

      <MotionDiv
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {posts.length === 0 && (
          <div className="text-sm text-[--color-muted-foreground]">
            No posts yet. Create your first one.
          </div>
        )}
        {posts.map((post) => (
          <MotionDiv
            key={post.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Card className="flex flex-col">
              <CardHeader className="space-y-1">
                <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <span>{post.author}</span>
                  <span>•</span>
                  <time dateTime={post.updatedAt}>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </time>
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" asChild className="w-full">
                  <Link to={`/app/post/${post.slug}`}>Read</Link>
                </Button>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </MotionDiv>
    </div>
  );
};
