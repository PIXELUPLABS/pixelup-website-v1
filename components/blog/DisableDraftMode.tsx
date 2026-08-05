export function DisableDraftMode() {
  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed right-4 bottom-4 z-[100] rounded-[2px] bg-accent px-3 py-[11.5px] font-button text-[12px] font-semibold text-white"
    >
      EXIT PREVIEW
    </a>
  );
}
