import EntryRow from "./EntryRow";

export default function EntryList() {
  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Hoje</span>

          <span className="font-mono">00:00:00</span>
        </div>

        <div className="card-surface divide-y divide-border">
          <EntryRow />
        </div>
      </div>
    </section>
  );
}
