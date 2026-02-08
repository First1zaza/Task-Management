import type { Route } from "./+types/home";
import DataTable from "~/components/Datatable";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Management" },
    { name: "description", content: "Task management application" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-10 px-3">
        <h1 className="font-semibold text-2xl">Task Management</h1>
        <p className="text-slate-400 mb-5">Welcome to the Task Management Application!</p>
        <DataTable />
      </div>
    </main>
  );
}
