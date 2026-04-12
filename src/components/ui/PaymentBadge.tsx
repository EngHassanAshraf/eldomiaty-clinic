export default function PaymentBadge({ isPaid }: { isPaid: boolean }) {
  if (isPaid) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        مدفوع ✓
      </span>
    );
  }
  return (
    <span className="badge-rose text-xs">
      غير مدفوع
    </span>
  );
}
