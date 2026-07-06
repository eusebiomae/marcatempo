import { useEffect, useState } from "react";
import { DollarSign, Play, Square } from "lucide-react";

import { useApp } from "../../lib/store";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");

  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");

  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${h}:${m}:${s}`;
}

export default function TimerCard() {
  const running = useApp((s) => s.running);
  const startTimer = useApp((s) => s.startTimer);
  const stopTimer = useApp((s) => s.stopTimer);
  const updateRunning = useApp((s) => s.updateRunning);
  const projects = useApp((s) => s.projects);
  const clients = useApp((s) => s.clients);

  const [elapsed, setElapsed] = useState(0);

  const [draft, setDraft] = useState({
    description: "",
    projectId: "",
    clientId: "",
    tags: "",
    billable: true,
  });

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - running.startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    useApp.getState().initialize();
  }, []);

  function handleStartStop() {
    if (running) {
      stopTimer();
      return;
    }

    startTimer({
      description: draft.description,
      projectId: draft.projectId || undefined,
      clientId: draft.clientId || undefined,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      billable: draft.billable,
    });

    setDraft({
      description: "",
      projectId: "",
      clientId: "",
      tags: "",
      billable: true,
    });
  }

  return (
    <div className="card-surface p-4 flex flex-col lg:flex-row gap-3 items-center">
      <input
        className="input-base flex-1"
        placeholder="No que você está trabalhando?"
        value={running ? running.description : draft.description}
        onChange={(e) =>
          running
            ? updateRunning({
                description: e.target.value,
              })
            : setDraft({
                ...draft,
                description: e.target.value,
              })
        }
      />

      <select
        className="input-base lg:w-44"
        value={running ? running.projectId || "" : draft.projectId}
        onChange={(e) =>
          running
            ? updateRunning({
                projectId: e.target.value || undefined,
              })
            : setDraft({
                ...draft,
                projectId: e.target.value,
              })
        }
      >
        <option value="">Sem projeto</option>

        {projects
          .filter((p) => p.active)
          .map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
      </select>

      <select
        className="input-base lg:w-40"
        value={running ? running.clientId || "" : draft.clientId}
        onChange={(e) =>
          running
            ? updateRunning({
                clientId: e.target.value || undefined,
              })
            : setDraft({
                ...draft,
                clientId: e.target.value,
              })
        }
      >
        <option value="">Sem cliente</option>

        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <input
        className="input-base lg:w-44"
        placeholder="tags"
        value={running ? running.tags.join(", ") : draft.tags}
        onChange={(e) =>
          running
            ? updateRunning({
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            : setDraft({
                ...draft,
                tags: e.target.value,
              })
        }
      />

      <button
        className="btn-ghost border border-border"
        onClick={() =>
          running
            ? updateRunning({
                billable: !running.billable,
              })
            : setDraft({
                ...draft,
                billable: !draft.billable,
              })
        }
      >
        <DollarSign
          className={`size-4 ${
            (running ? running.billable : draft.billable) ? "text-primary" : ""
          }`}
        />
      </button>

      <div className="font-mono text-lg w-28 text-center">
        {formatDuration(elapsed)}
      </div>

      <button
        onClick={handleStartStop}
        className="btn-primary inline-flex items-center gap-2"
      >
        {running ? (
          <>
            <Square className="size-4" />
            Parar
          </>
        ) : (
          <>
            <Play className="size-4" />
            Iniciar
          </>
        )}
      </button>
    </div>
  );
}
