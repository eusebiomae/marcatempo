import { Plus, Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  onNew: () => void;
}

export default function ProjectToolbar({
  search,
  setSearch,
  onNew,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 justify-between">

      <div className="relative w-full md:w-80">

        <Search className="size-4 absolute left-3 top-3 text-muted-foreground" />

        <input
          className="input-base pl-9"
          placeholder="Pesquisar projeto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <button
        className="btn-primary inline-flex items-center gap-2"
        onClick={onNew}
      >
        <Plus className="size-4" />
        Novo Projeto
      </button>

    </div>
  );
}