import { useAuth } from "../state/AuthContext.jsx";
import { Button } from "../components/ui/button.jsx";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/motion/PageTransition.jsx";
import { VintageBackdrop } from "../components/motion/VintageBackdrop.jsx";
import { DustParticles } from "../components/motion/DustParticles.jsx";

export const HomePage = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  return (
    <PageTransition>
      <div className="relative overflow-hidden min-h-dvh">
        <VintageBackdrop />
        <DustParticles />
        <div className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-accent">
                Welcome, {currentUser?.username}
              </h1>
              <p className="text-sm text-[--color-muted-foreground]">
                Your reading and writing hub
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
          {/* Zigzag divider */}
          <div className="my-8">
            <svg
              className="h-6 w-full text-[--color-border]"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M0 10 L5 0 L10 20 L15 0 L20 20 L25 0 L30 20 L35 0 L40 20 L45 0 L50 20 L55 0 L60 20 L65 0 L70 20 L75 0 L80 20 L85 0 L90 20 L95 0 L100 10"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="grid gap-6 mt-10 md:grid-cols-2">
            <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-6 sketch-border">
              <h2 className="mb-2 text-xl font-accent">Start a new post</h2>
              <p className="mb-4 text-sm text-[--color-muted-foreground]">
                Capture an idea while it’s fresh. Markdown, images, and drafts.
              </p>
              <Button asChild>
                <Link to="/app/new">Create post</Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-6 sketch-border">
              <h2 className="mb-2 text-xl font-accent">Browse your library</h2>
              <p className="mb-4 text-sm text-[--color-muted-foreground]">
                Revisit your writing, sort ideas, and continue where you left
                off.
              </p>
              <Button variant="outline" asChild>
                <Link to="/app/posts">Browse posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
