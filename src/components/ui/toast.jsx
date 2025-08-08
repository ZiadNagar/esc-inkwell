import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext({ addToast: () => {} });

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, description, variant = "default", duration = 1000 }) => {
      const id = ++idCounter;
      const toast = { id, title, description, variant };
      setToasts((prev) => [...prev, toast]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed inset-x-0 top-4 z-[70] mx-auto w-full max-w-md space-y-3 px-4">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="sketch-border scribble-shadow rounded-xl border border-[--color-border] bg-[--color-card]/90 px-4 py-3 backdrop-blur"
              role="status"
              aria-live="polite"
            >
              {t.title && <p className="text-base font-accent">{t.title}</p>}
              {t.description && (
                <p className="mt-1 text-sm text-[--color-muted-foreground]">
                  {t.description}
                </p>
              )}
              <button
                className="ml-auto mt-2 inline-flex rounded-md border border-[--color-border] px-2 py-1 text-xs hover:bg-[--color-muted]"
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
