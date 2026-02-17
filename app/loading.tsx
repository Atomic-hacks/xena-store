export default function Loading() {
  return (
    <main
      className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[1px]"
      aria-busy="true"
      aria-live="polite"
    />
  );
}
