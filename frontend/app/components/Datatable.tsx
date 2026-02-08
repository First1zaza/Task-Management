import { fetcher } from "~/libs/fetcher/indes"
import useSWR from "swr"
import { useEffect } from "react"
import { useTaskStore, type Task } from "~/libs/store/taskStore"

export default function DataTable() {

    const { data, error, isLoading, mutate } = useSWR("http://localhost:4500/tasks", fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: true
    })

    const { tasks, newTask, setTasks, addNewTask, removeNewTask } = useTaskStore()

    async function handleChangeTask(id: number, field: string, value: string) {
        const { updateTask } = useTaskStore.getState();
        updateTask(id, field, value);
        
        const currentTasks = useTaskStore.getState().tasks;
        const result = await fetch(`http://localhost:4500/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentTasks.find((task) => task.id === id))
        });
        if (result.ok) {
            mutate();
        }
    }

    function handleChangeNewInput(id: number, field: string, value: string) {
        const { updateNewTask } = useTaskStore.getState();
        updateNewTask(id, field, value);
    }

    async function handleCreateNewTask(id: number) {
        const { newTask, removeNewTask } = useTaskStore.getState();
        const taskToCreate = newTask.find((task) => task.id === id);
        if (taskToCreate) {
            const result = await fetch("http://localhost:4500/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: taskToCreate.title,
                    description: taskToCreate.description,
                    status: taskToCreate.status
                })
            });
            if (result.ok) {
                mutate();
                removeNewTask(id);
            }
        }
    }

    async function handleDeleteTask(id: number) {
        const result = await fetch(`http://localhost:4500/tasks/${id}`, {
            method: "DELETE"
        });
        if (result.ok) {
            mutate();
        }
    }

    useEffect(() => {
        if (data && data.success && !isLoading) {
            setTasks(data.data)
        }
    }, [data, isLoading, setTasks])

    return (
        <div className="space-y-3">
            <div className="task-group">
                <div className="px-6 py-3 bg-gray-600/30 text-gray-700 font-bold">
                    TODO
                </div>
                <div className="data-table relative overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-100 border border-slate-200 mb-1 border-collapse">
                        <thead className="bg-slate-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 border border-slate-200">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 border border-slate-200">
                                    Description
                                </th>
                                <th className="px-6 py-3 border border-slate-200">
                                    Status
                                </th>
                                <th className="px-6 py-3 border border-slate-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        {
                            isLoading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={4} className="px-6 py-3 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {
                                        tasks.filter((task: Task) => task.status === "todo").map((task: Task) => (
                                            <tr key={task.id} className="border-b border-slate-200 bg-white hover:bg-slate-50 text-slate-500">
                                                <td className="border border-slate-200">
                                                    <input type="text" className="px-6 py-3 w-full focus:outline-slate-200"
                                                        value={task.title} onChange={(e) => handleChangeTask(task.id, "title", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <input type="text" className="px-6 py-3 w-full focus:outline-slate-200"
                                                        value={task.description} onChange={(e) => handleChangeTask(task.id, "description", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <select className="px-6 py-3 w-full bg-white focus:outline-slate-200" value={task.status} onChange={(e) => handleChangeTask(task.id, "status", e.target.value)}>
                                                        <option value="todo">TODO</option>
                                                        <option value="inprogress">IN PROGRESS</option>
                                                        <option value="done">DONE</option>
                                                    </select>
                                                </td>
                                                <td className="border border-slate-200 px-6">
                                                    <button type="button" onClick={() => handleDeleteTask(task.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {
                                        newTask.filter((task: Task) => task.status === "todo").map((task: Task) => (
                                            <tr key={task.id} className="border-b border-slate-200 bg-white hover:bg-slate-50 text-slate-500">
                                                <td className="border border-slate-200">
                                                    <input className="px-6 py-3 w-full focus:outline-slate-200"
                                                        type="text" value={task.title} onChange={(e) => handleChangeNewInput(task.id, "title", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <input className="px-6 py-3 w-full focus:outline-slate-200"
                                                        type="text" value={task.description} onChange={(e) => handleChangeNewInput(task.id, "description", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200 px-6" colSpan={2}>
                                                    <button type="button" onClick={() => handleCreateNewTask(task.id)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                                        Save Task
                                                    </button>
                                                    <button type="button" onClick={() => removeNewTask(task.id)} className="px-4 py-2 ml-2 bg-gray-500 text-gray-100 rounded hover:bg-gray-600 cursor-pointer">
                                                        Cancle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            )
                        }
                    </table>
                    <button type="button" onClick={() => {addNewTask("todo")}} className="w-full text-sm text-slate-500 text-center py-1.5 bg-gray-100 hover:bg-gray-200 border border-slate-200 cursor-pointer">
                        Create New Task
                    </button>
                </div>
            </div>
             <div className="task-group">
                <div className="px-6 py-3 bg-blue-600/30 text-blue-700 font-bold">
                    IN PROGRESS
                </div>
                <div className="data-table relative overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-100 border border-slate-200 mb-1">
                        <thead className="bg-slate-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th className="px-6 py-3">
                                    Status
                                </th>
                                <th className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        {
                            isLoading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={4} className="px-6 py-3 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {
                                        tasks.filter((task: Task) => task.status === "inprogress").map((task: Task) => (
                                            <tr key={task.id} className="border-b border-slate-200 bg-white hover:bg-slate-50 text-slate-500">
                                                <td className="border border-slate-200">
                                                    <input type="text" className="px-6 py-3 w-full focus:outline-slate-200"
                                                        value={task.title} onChange={(e) => handleChangeTask(task.id, "title", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <input type="text" className="px-6 py-3 w-full focus:outline-slate-200"
                                                        value={task.description} onChange={(e) => handleChangeTask(task.id, "description", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <select className="px-6 py-3 w-full bg-white focus:outline-slate-200" value={task.status} onChange={(e) => handleChangeTask(task.id, "status", e.target.value)}>
                                                        <option value="todo">TODO</option>
                                                        <option value="inprogress">IN PROGRESS</option>
                                                        <option value="done">DONE</option>
                                                    </select>
                                                </td>
                                                <td className="border border-slate-200 px-6">
                                                    <button type="button" onClick={() => handleDeleteTask(task.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {
                                        newTask.filter((task: Task) => task.status === "inprogress").map((task: Task) => (
                                            <tr key={task.id} className="border-b border-slate-200 bg-white hover:bg-slate-50 text-slate-500">
                                                <td className="border border-slate-200">
                                                    <input className="px-6 py-3 w-full focus:outline-slate-200"
                                                        type="text" value={task.title} onChange={(e) => handleChangeNewInput(task.id, "title", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <input className="px-6 py-3 w-full focus:outline-slate-200"
                                                        type="text" value={task.description} onChange={(e) => handleChangeNewInput(task.id, "description", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200 px-6" colSpan={2}>
                                                    <button type="button" onClick={() => handleCreateNewTask(task.id)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                                        Save Task
                                                    </button>
                                                    <button type="button" onClick={() => removeNewTask(task.id)} className="px-4 py-2 ml-2 bg-gray-500 text-gray-100 rounded hover:bg-gray-600 cursor-pointer">
                                                        Cancle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            )
                        }
                    </table>
                    <button type="button" onClick={() => {addNewTask("inprogress")}} className="w-full text-sm text-slate-500 text-center py-1.5 bg-gray-100 hover:bg-gray-200 border border-slate-200 cursor-pointer">
                        Create New Task
                    </button>
                </div>
            </div>
             <div className="task-group">
                <div className="px-6 py-3 bg-green-600/30 text-green-700 font-bold">
                    DONE
                </div>
                <div className="data-table relative overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-100 border border-slate-200 mb-1">
                        <thead className="bg-slate-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th className="px-6 py-3">
                                    Status
                                </th>
                                <th className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        {
                            isLoading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {
                                        tasks.filter((task: Task) => task.status === "done").map((task: Task) => (
                                            <tr key={task.id} className="border-b border-slate-200 bg-white hover:bg-slate-50 text-slate-500">
                                                <td className="border border-slate-200">
                                                    <input type="text" className="px-6 py-3 w-full focus:outline-slate-200"
                                                        value={task.title} onChange={(e) => handleChangeTask(task.id, "title", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <input type="text" className="px-6 py-3 w-full focus:outline-slate-200"
                                                        value={task.description} onChange={(e) => handleChangeTask(task.id, "description", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <select className="px-6 py-3 w-full bg-white focus:outline-slate-200" value={task.status} onChange={(e) => handleChangeTask(task.id, "status", e.target.value)}>
                                                        <option value="todo">TODO</option>
                                                        <option value="inprogress">IN PROGRESS</option>
                                                        <option value="done">DONE</option>
                                                    </select>
                                                </td>
                                                <td className="border border-slate-200 px-6">
                                                    <button type="button" onClick={() => handleDeleteTask(task.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                   {
                                        newTask.filter((task: Task) => task.status === "done").map((task: Task) => (
                                            <tr key={task.id} className="border-b border-slate-200 bg-white hover:bg-slate-50 text-slate-500">
                                                <td className="border border-slate-200">
                                                    <input className="px-6 py-3 w-full focus:outline-slate-200"
                                                        type="text" value={task.title} onChange={(e) => handleChangeNewInput(task.id, "title", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200">
                                                    <input className="px-6 py-3 w-full focus:outline-slate-200"
                                                        type="text" value={task.description} onChange={(e) => handleChangeNewInput(task.id, "description", e.target.value)} />
                                                </td>
                                                <td className="border border-slate-200 px-6" colSpan={2}>
                                                    <button type="button" onClick={() => handleCreateNewTask(task.id)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                                        Save Task
                                                    </button>
                                                    <button type="button" onClick={() => removeNewTask(task.id)} className="px-4 py-2 ml-2 bg-gray-500 text-gray-100 rounded hover:bg-gray-600 cursor-pointer">
                                                        Cancle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            )
                        }
                    </table>
                    <button type="button" onClick={() => {addNewTask("done")}} className="w-full text-sm text-slate-500 text-center py-1.5 bg-gray-100 hover:bg-gray-200 border border-slate-200 cursor-pointer">
                        Create New Task
                    </button>
                </div>
            </div>
        </div>
    )
}