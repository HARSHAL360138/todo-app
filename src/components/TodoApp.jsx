import { useEffect, useState } from "react";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error reading tasks from localStorage:", error);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false, id: Date.now() }]);
      setNewTask("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTask = (id, text) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-tr from-sky-50 via-white to-purple-50 rounded-2xl shadow-xl border border-gray-200 md:px-10">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 mb-8 text-center">
        Todo App
      </h1>

      <div className="flex flex-col md:flex-row mb-6 gap-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border border-blue-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button
          onClick={addTask}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6 text-sm">
        {["all", "completed", "pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl transition-all font-medium ${
              filter === f
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-xl p-3 shadow-md"
          >
            <div className="flex items-center gap-3 w-full">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="accent-purple-600 h-5 w-5"
              />
              <input
                type="text"
                value={task.text}
                onChange={(e) => updateTask(task.id, e.target.value)}
                className={`flex-1 rounded-xl p-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                  task.completed ? "line-through text-gray-400 bg-gray-50" : ""
                }`}
              />
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="mt-3 sm:mt-0 sm:ml-3 text-red-500 hover:text-red-700 text-xl font-bold"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
