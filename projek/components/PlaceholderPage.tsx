import ComingSoon from "@/components/ComingSoon";

export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <div className="mt-6">
        <ComingSoon title="Segera hadir" description={description} />
      </div>
    </div>
  );
}
