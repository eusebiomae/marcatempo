interface Props {
  open: boolean;
}

export default function ProjectDialog({
  open,
}: Props) {

  if (!open) return null;

  return (
    <div
      className="
      fixed inset-0
      bg-black/40
      flex
      items-center
      justify-center
      "
    >
      <div className="card-surface w-125 p-6">

        <h2 className="text-xl font-semibold">

          Projeto

        </h2>

        <p className="text-muted-foreground mt-2">

          O formulário será criado no próximo passo.

        </p>

      </div>

    </div>
  );
}