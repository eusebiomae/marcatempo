import type { Project } from "../../lib/db";

import ProjectRow from "./ProjectRow";

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
}

export default function ProjectTable({
  projects,
  onEdit,
}: Props) {

  if (!projects.length) {
    return (
      <div className="card-surface p-10 text-center text-muted-foreground">
        Nenhum projeto cadastrado.
      </div>
    );
  }

  return (
    <div className="card-surface overflow-hidden">

      <table className="w-full">

        <thead className="border-b border-border">

          <tr className="text-left text-sm">

            <th className="p-4">Nome</th>

            <th>Cliente</th>

            <th>Valor/h</th>

            <th>Status</th>

            <th></th>

          </tr>

        </thead>

        <tbody>

          {projects.map((project) => (

            <ProjectRow
              key={project.id}
              project={project}
              onEdit={onEdit}
            />

          ))}

        </tbody>

      </table>

    </div>
  );
}