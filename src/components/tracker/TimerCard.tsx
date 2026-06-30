import { Play, Square, DollarSign } from "lucide-react";

export default function TimerCard() {
  return (
    <div className="card-surface p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">

      <input
        className="input-base flex-1"
        placeholder="No que você está trabalhando?"
      />

      <select className="input-base lg:w-44">
        <option>Sem projeto</option>
      </select>

      <select className="input-base lg:w-40">
        <option>Sem cliente</option>
      </select>

      <input
        className="input-base lg:w-44"
        placeholder="tags"
      />

      <button
        className="btn-ghost border border-border"
        title="Faturável"
      >
        <DollarSign className="size-4" />
      </button>

      <div className="font-mono text-lg tabular-nums w-28 text-center">
        00:00:00
      </div>

      <button className="btn-primary inline-flex items-center gap-2">
        <Play className="size-4" />
        Iniciar
      </button>

    </div>
  );
}