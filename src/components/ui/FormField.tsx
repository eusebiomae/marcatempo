interface Props {
  label: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  children,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      {children}
    </div>
  );
}