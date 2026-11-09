"use client";

import { useState } from "react";

export default function AddTask({ addTask }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    addTask(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite uma tarefa..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">
        Adicionar
      </button>
    </form>
  );
}