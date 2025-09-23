"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Tag, BookOpen, Sparkles } from "lucide-react";

interface Term {
  id: number;
  title: string;
  content: string;
  tags: { id: number; name: string }[];
  createdAt: string;
}

export default function Home() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string; tags?: string }>({});

  useEffect(() => {
    fetch("/api/terms")
      .then(res => res.json())
      .then(setTerms);
  }, []);

  function validateForm() {
    const newErrors: { title?: string; content?: string; tags?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = "El título es requerido";
    }
    
    if (!content.trim()) {
      newErrors.content = "La definición es requerida";
    }
    
    const tagList = tags.split(",").map(t => t.trim()).filter(t => t);
    if (tagList.length === 0) {
      newErrors.tags = "Al menos una etiqueta es requerida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function addTerm() {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags: tags.split(",").map(t => t.trim()).filter(t => t)
        })
      });
      const newTerm = await res.json();
      setTerms([newTerm, ...terms]);
      setTitle(""); 
      setContent(""); 
      setTags("");
      setErrors({});
    } catch (error) {
      console.error("Error adding term:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = terms.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag: any) => tag.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Glosario Moderno
            </h1>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-gray-600 text-lg">Organiza y encuentra tus términos favoritos</p>
        </div>

        {/* Add Term Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-600" />
            Agregar Nuevo Término
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({...errors, title: undefined});
                }}
                placeholder="Ingresa el título del término"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Definición *
              </label>
              <textarea
                value={content}
                onChange={e => {
                  setContent(e.target.value);
                  if (errors.content) setErrors({...errors, content: undefined});
                }}
                placeholder="Escribe la definición del término"
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
                  errors.content ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                }`}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas * (separadas por comas)
              </label>
              <input
                value={tags}
                onChange={e => {
                  setTags(e.target.value);
                  if (errors.tags) setErrors({...errors, tags: undefined});
                }}
                placeholder="javascript, programación, web"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.tags ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                }`}
              />
              {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
            </div>

            <button 
              onClick={addTerm}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Guardar Término
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar términos, definiciones o etiquetas..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all bg-white shadow-sm"
          />
        </div>

        {/* Terms List */}
        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {search ? "No se encontraron términos" : "No hay términos aún. ¡Agrega el primero!"}
              </p>
            </div>
          ) : (
            filtered.map(term => (
              <div key={term.id} className="bg-white rounded-2xl shadow-lg p-6 border border-purple-50 hover:shadow-xl transition-all duration-200 hover:border-purple-200">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex-1">{term.title}</h2>
                  <div className="text-sm text-gray-400">
                    {new Date(term.createdAt).toLocaleDateString('es-ES')}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">{term.content}</p>
                
                <div className="flex flex-wrap gap-2">
                  {term.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200"
                    >
                      <Tag className="w-3 h-3" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {terms.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">
                {terms.length} término{terms.length !== 1 ? 's' : ''} en tu glosario
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}