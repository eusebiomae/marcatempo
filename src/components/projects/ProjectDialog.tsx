import { uid } from "../../lib/db";

import { useState } from "react";

import type { Project } from "../../lib/db";

import { useApp } from "../../lib/store";

import FormField from "../ui/FormField";

interface Props {
  open: boolean;
  project?: Project | null;
  onClose: () => void;
}

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#14b8a6",
  "#eab308",
  "#ec4899",
];

export default function ProjectDialog({ open, project, onClose }: Props) {
  const createProject = useApp((s) => s.createProject);
  const updateProject = useApp((s) => s.updateProject);
  const { clients } = useApp();
  const [form, setForm] = useState({
    name: project?.name ?? "",
    clientId: project?.clientId ?? "",
    color: project?.color ?? COLORS[0],
    hourlyRate: project?.hourlyRate ?? 0,
    description: project?.description ?? "",
    active: project?.active ?? true,
  });

  if (!open) return null;

  function updateField<K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert("Informe o nome do projeto.");

      return;
    }

    const data: Project = {
      id: project?.id ?? uid(),

      name: form.name.trim(),

      clientId: form.clientId || undefined,

      color: form.color,

      hourlyRate: form.hourlyRate,

      description: form.description,

      active: form.active,

      createdAt: project?.createdAt ?? Date.now(),
    };

    if (project) {
      await updateProject(project.id, data);
    } else {
      await createProject(data);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="card-surface w-full max-w-xl p-6 space-y-5">
        <h2 className="text-xl font-semibold">
          {project ? "Editar Projeto" : "Novo Projeto"}
        </h2>

        <FormField label="Nome">
          <input
            className="input-base font-semibold text-lg transition-colors duration-200"
            style={{
              color: form.color,
            }}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Ex.: Sistema Financeiro"
          />
        </FormField>

        <FormField label="Cliente">
          <select
            className="input-base"
            value={form.clientId}
            onChange={(e) => updateField("clientId", e.target.value)}
          >
            <option value="">Sem cliente</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Cor">
          <div className="flex gap-3 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateField("color", c)}
                className={`
                    w-8
                    h-8
                    rounded-full
                    border-4
                    transition
                    ${
                      form.color === c
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    }
                `}
                style={{
                  background: c,
                }}
              />
            ))}
          </div>
        </FormField>

        <FormField label="Valor por hora">
          <input
            className="input-base"
            type="number"
            value={form.hourlyRate}
            onChange={(e) => updateField("hourlyRate", Number(e.target.value))}
          />
        </FormField>

        <FormField label="Descrição">
          <textarea
            rows={4}
            className="input-base resize-none"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </FormField>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => updateField("active", e.target.checked)}
          />
          Projeto ativo
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-primary" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
