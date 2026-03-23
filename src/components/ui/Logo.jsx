export default function Logo({ className = "" }) {
  return (
    <img
      src="/image copy.png"
      alt="logo"
      className={`block object-cover w-72 h-24 ${className}`}
    />
  );
}
