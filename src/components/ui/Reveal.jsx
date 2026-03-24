import useReveal from "../../hooks/useReveal";

export default function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, vis] = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.95s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.95s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}