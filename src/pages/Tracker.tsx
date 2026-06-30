import TimerCard from "../components/tracker/TimerCard";
import EntryList from "../components/tracker/EntryList";

export default function Tracker() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl">

      <header>
        <h1 className="text-2xl font-semibold">
          Time Tracker
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Pressione SPACE para iniciar/parar.
        </p>
      </header>

      <TimerCard />

      <EntryList />

    </div>
  );
}