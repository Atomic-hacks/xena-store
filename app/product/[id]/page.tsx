export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      hello world, : this is the id: {id}
    </div>
  );
}
