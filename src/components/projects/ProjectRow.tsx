import type { Project } from "../../lib/db";

import { Pencil } from "lucide-react";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
}

export default function ProjectRow({
  project,
  onEdit,
}: Props) {

  return (
    <tr className="border-b border-border">

      <td className="p-4">

        <div className="flex items-center gap-3">

          <div
            className="size-3 rounded-full"
            style={{
              background: project.color,
            }}
          />

          {project.name}

        </div>

      </td>

      <td>{project.clientId || "-"}</td>

      <td>

        R$ {project.hourlyRate.toFixed(2)}

      </td>

      <td>

        {project.active ? "Ativo" : "Inativo"}

      </td>

      <td className="text-right pr-4">

        <button
          className="btn-ghost"
          onClick={() => onEdit(project)}
        >
          <Pencil className="size-4" />
        </button>

      </td>

    </tr>
  );
}