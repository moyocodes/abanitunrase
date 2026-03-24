export default function Logo({ className = "" }) {
  return (
    <img
      src="/image copy.png"
      alt="logo"
      className={`object-cover w-64 h-12 ${className}`}
    />
  );
}
