import { createPortal } from "react-dom";

export const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  description,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] grid place-items-center bg-black/30 backdrop-blur-sm"
      onClick={onCancel}
      onKeyDown={(e) => e.key === "Escape" && onCancel?.()}
    >
      <div
        className="sketch-border paper-bg sketch-lines w-full max-w-md rounded-xl border border-[--color-border] bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-accent">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[--color-muted-foreground]">
            {description}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="rounded-md border border-[--color-border] px-3 py-2 text-sm hover:bg-[--color-muted]"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="sketch-border rounded-md bg-[--color-primary] px-3 py-2 text-sm font-semibold text-[--color-primary-foreground] hover:-translate-y-px"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
