import { useEffect, useMemo, useState } from "react";

import { useApp } from "../lib/store";

import ProjectToolbar from "../components/projects/ProjectToolbar";
import ProjectTable from "../components/projects/ProjectTable";
import ProjectDialog from "../components/projects/ProjectDialog";

export default function Projects() {

  const initialize = useApp((s) => s.initialize);

  const projects = useApp((s) => s.projects);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const filtered = useMemo(() => {

    return projects.filter((p) =>
      p.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [projects, search]);

  return (
    <div className="space-y-6 p-6">

      <ProjectToolbar
        search={search}
        setSearch={setSearch}
        onNew={() => setDialogOpen(true)}
      />

      <ProjectTable
        projects={filtered}
        onEdit={() => setDialogOpen(true)}
      />

      <ProjectDialog
        open={dialogOpen}
      />

    </div>
  );
}