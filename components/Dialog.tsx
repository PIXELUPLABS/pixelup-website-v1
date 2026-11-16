"use client";

import { useEffect, useRef } from "react";

/**
 * The site's shared modal shell, on the native <dialog>: showModal() puts it
 * in the top layer (above the sticky Navbar) and gives focus containment,
 * Escape-to-close and an inert page without any hand-rolled trap.
 *
 * - Below desk it's a bottom sheet (full width, 24px short of the top).
 * - From desk it's a centred panel; the caller sets its size via panelClass.
 * - Backdrop is color.neutral.scrim with a blur, the ExplorationGallery
 *   lightbox treatment. The panel is flat black with square corners and no
 *   shadow; on a scrimmed black page it needs its 0.5px hairline edge to read
 *   as a panel at all.
 * - Page scroll is locked while open (inert pages still scroll on touch).
 *
 * AuditLeadMagnet predates this and still carries its own scrim and focus
 * trap; move it here the next time it's touched.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  className = "",
  onKeyDown,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  /** Desk sizing for the panel, e.g. "desk:h-[…] desk:w-[…]". */
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDialogElement>) => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      // Escape fires "cancel": route it through onClose so React state stays
      // the one source of truth for whether the dialog is open.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // A click on the backdrop lands on the <dialog> element itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
      className={`m-0 mt-auto h-[calc(100dvh-24px)] max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-white backdrop:bg-scrim backdrop:backdrop-blur-md desk:m-auto ${className}`}
    >
      {open && (
        <div className="fade-up flex h-full flex-col border-t-[0.5px] border-hairline bg-base [animation-duration:0.25s] desk:border-[0.5px]">
          {children}
        </div>
      )}
    </dialog>
  );
}
