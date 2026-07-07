import type { Project } from "../../lib/db";

import { Pencil } from "lucide-react";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
}

export default function ProjectRow({ project, onEdit }: Props) {
  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="p-4">
        <span
          className="inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold"
          style={{
            color: project.color,
            backgroundColor: `${project.color}20`,
            border: `1px solid ${project.color}40`,
          }}
        >
          {project.name}
        </span>
      </td>

      <td>{project.clientId || "-"}</td>

      <td>R$ {project.hourlyRate.toFixed(2)}</td>

      <td>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            project.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {project.active ? "Ativo" : "Inativo"}
        </span>
      </td>

      <td className="text-right pr-4">
        <button className="btn-ghost" onClick={() => onEdit(project)}>
          <Pencil className="size-4" />
        </button>
      </td>
    </tr>
  );
}
