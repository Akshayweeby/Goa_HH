export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = variant === 'secondary'
    ? 'border border-white/15 bg-white/[0.06] text-white hover:bg-white/10'
    : 'bg-[#d8ff44] text-[#101215] hover:bg-[#e2ff73]';
  return <button className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`} {...props}>{children}</button>;
}
