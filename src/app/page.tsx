"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [terms, setTerms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetch("/api/terms")
      .then(res => res.json())
      .then(setTerms);
  }, []);

  async function addTerm() {
    const res = await fetch("/api/terms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(",").map(t => t.trim())
      })
    });
    const newTerm = await res.json();
    setTerms([newTerm, ...terms]);
    setTitle(""); setContent(""); setTags("");
  }

  const filtered = terms.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag: any) => tag.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📘 Glosario</h1>

      {/* Formulario */}
      <div className="mb-6 space-y-2">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título"
          className="border p-2 w-full"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Definición"
          className="border p-2 w-full"
        />
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Etiquetas (coma separadas)"
          className="border p-2 w-full"
        />
        <button onClick={addTerm} className="bg-blue-500 text-white px-4 py-2">
          Guardar
        </button>
      </div>

      {/* Búsqueda */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar..."
        className="border p-2 w-full mb-4"
      />

      {/* Lista */}
      <div className="space-y-4">
        {filtered.map(term => (
          <div key={term.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{term.title}</h2>
            <p>{term.content}</p>
            <div className="flex gap-2 mt-2">
              {term.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="bg-gray-200 px-2 py-1 text-sm rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
