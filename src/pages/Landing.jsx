import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { PenLine, LogIn } from "lucide-react";
import { PageTransition } from "../components/motion/PageTransition.jsx";
import { VintageBackdrop } from "../components/motion/VintageBackdrop.jsx";
import { DustParticles } from "../components/motion/DustParticles.jsx";
import { motion } from "framer-motion";
import { InkIllustration } from "../components/illustrations/InkIllustration.jsx";

export const LandingPage = () => {
  const [username, setUsername] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e?.preventDefault?.();
    const trimmed = username.trim();
    if (!trimmed) return;
    login(trimmed);
    navigate("/app", { replace: true });
  };

  const handleFocusLogin = () => setShowLogin(true);

  return (
    <PageTransition>
      <div className="relative overflow-hidden min-h-dvh">
        <VintageBackdrop />
        <DustParticles />

        <header className="container grid h-20 place-items-center">
          <div className="inline-flex items-center gap-3 rotate-[-2deg] rounded-xl bg-[--color-secondary] px-4 py-2 sketch-border">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-[--color-muted] text-[--color-foreground]">
              <PenLine className="w-5 h-5" aria-hidden />
            </div>
            <span className="text-2xl font-semibold tracking-tight font-accent">
              InkWell
            </span>
          </div>
        </header>

        <main className="container grid min-h-[calc(100dvh-8rem)] items-stretch gap-20 py-20 md:grid-cols-2">
          <section className="flex flex-col justify-center max-w-3xl space-y-7">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-accent leading-[1.05]">
              Write beautifully.
              <br />
              Publish instantly.
            </h1>
            <p className="max-w-prose text-pretty text-lg md:text-xl text-[--color-muted-foreground]">
              A timeless workspace for ideas — designed with hand-drawn warmth,
              smooth motion, and editorial clarity.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-12 px-6 text-base"
                onClick={handleFocusLogin}
                aria-label="Start writing"
              >
                Start writing
              </Button>
            </div>
          </section>

          <section aria-hidden className="hidden md:block">
            <div className="relative flex items-center justify-center h-full">
              <InkIllustration className="scribble-shadow w-[780px] md:w-[880px] lg:w-[1040px] max-w-[min(94vw,1100px)] h-auto" />
            </div>
          </section>
        </main>

        {showLogin &&
          createPortal(
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-title"
              className="fixed inset-0 z-50 grid place-items-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              onKeyDown={(e) => e.key === "Escape" && setShowLogin(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 8, opacity: 0.98 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="w-full max-w-md px-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="relative p-2 bg-white paper-bg sketch-lines md:p-4">
                  <CardHeader>
                    <CardTitle
                      id="login-title"
                      className="text-3xl font-accent"
                    >
                      Welcome back
                    </CardTitle>
                    <CardDescription>
                      Enter a name to continue to your workspace.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleLogin}>
                      <label htmlFor="username" className="sr-only">
                        Username
                      </label>
                      <Input
                        id="username"
                        type="text"
                        inputMode="text"
                        autoComplete="nickname"
                        placeholder="Your name (e.g., alex)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        aria-label="Username"
                        required
                        className="h-12 text-base"
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-base"
                      >
                        <LogIn className="w-4 h-4 mr-2" /> Continue
                      </Button>
                    </form>
                    <p className="mt-4 text-center text-xs text-[--color-muted-foreground]">
                      By continuing you agree to our terms. No accounts are
                      created; data stays in your browser.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>,
            document.body
          )}

        <footer className="fixed z-40 -translate-x-1/2 bottom-6 left-1/2">
          <p className="mx-auto inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-[--color-border] bg-[--color-card]/80 px-4 py-2 text-xs text-[--color-muted-foreground] backdrop-blur sketch-border">
            <span>© 2025 InkWell</span>
            <span className="hidden md:inline">—</span>
            <span>
              Designed and built by
              <a
                href="https://ziadelnagar-portfolio.vercel.app/"
                target="_blank"
                rel="noreferrer noopener"
                className="ml-1 font-medium text-[--color-accent] underline-offset-4 hover:underline"
                aria-label="Ziad Elnaagr portfolio"
              >
                Ziad Elnaagr
              </a>
            </span>
          </p>
        </footer>
      </div>
    </PageTransition>
  );
};
