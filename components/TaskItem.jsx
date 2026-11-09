export default function TaskItem({
  task,
  toggleTask,
  deleteTask,
}) {
  return (
    <li className={task.completed ? "done" : ""}>
      <span>{task.text}</span>

      <div className="actions">
        <button
          className="complete-btn"
          onClick={() => toggleTask(task.id)}
        >
          {task.completed ? "↩ Desfazer" : "✔ Concluir"}
        </button>

        <button onClick={() => deleteTask(task.id)}>
          ❌
        </button>
      </div>
    </li>
  );
}