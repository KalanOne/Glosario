"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Tag, BookOpen, Sparkles, X, Edit2, Trash2 } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ title?: string; content?: string; tags?: string }>({});

  useEffect(() => {
    fetch("/api/terms")
      .then(res => res.json())
      .then(setTerms);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  function openModal() {
    setIsModalOpen(true);
    setIsModalClosing(false);
    // Reset form when opening for new term
    if (!editingTerm) {
      setTitle("");
      setContent("");
      setTags("");
    }
    setErrors({});
  }

  function openEditModal(term: Term) {
    setEditingTerm(term);
    setTitle(term.title);
    setContent(term.content);
    setTags(term.tags.map(tag => tag.name).join(", "));
    setIsModalOpen(true);
    setIsModalClosing(false);
    setErrors({});
  }

  function closeModal() {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
      setEditingTerm(null);
    }, 300); // Match animation duration
  }

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
      if (editingTerm) {
        // Update existing term
        const res = await fetch(`/api/terms/${editingTerm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            tags: tags.split(",").map(t => t.trim()).filter(t => t)
          })
        });
        const updatedTerm = await res.json();
        setTerms(terms.map(t => t.id === editingTerm.id ? updatedTerm : t));
      } else {
        // Create new term
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
      }
      closeModal();
    } catch (error) {
      console.error("Error adding term:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteTerm(id: number) {
    try {
      await fetch(`/api/terms/${id}`, {
        method: "DELETE"
      });
      setTerms(terms.filter(t => t.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting term:", error);
    }
  }

  const filtered = terms.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag: any) => tag.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className={`container mx-auto px-4 py-8 max-w-4xl transition-all duration-300 ${isModalOpen ? 'blur-sm' : ''}`}>
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

        {/* Add Term Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => {
              setEditingTerm(null);
              openModal();
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Agregar Nuevo Término
          </button>
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
                  <h2 className="text-xl font-bold text-gray-800 flex-1 mr-4">{term.title}</h2>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-400 mr-2">
                      {new Date(term.createdAt).toLocaleDateString('es-ES')}
                    </div>
                    <button
                      onClick={() => openEditModal(term)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                      title="Editar término"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(term.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Eliminar término"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${isModalClosing ? 'animate-fadeOut' : 'animate-fadeIn'
            }`}
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isModalClosing ? 'animate-slideOut' : 'animate-slideIn'
              }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                {editingTerm ? <Edit2 className="w-6 h-6 text-purple-600" /> : <Plus className="w-6 h-6 text-purple-600" />}
                {editingTerm ? "Editar Término" : "Agregar Nuevo Término"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    value={title}
                    onChange={e => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: undefined });
                    }}
                    placeholder="Ingresa el título del término"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
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
                      if (errors.content) setErrors({ ...errors, content: undefined });
                    }}
                    placeholder="Escribe la definición del término"
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${errors.content ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
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
                      if (errors.tags) setErrors({ ...errors, tags: undefined });
                    }}
                    placeholder="javascript, programación, web"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.tags ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                      }`}
                  />
                  {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addTerm}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingTerm ? "Actualizando..." : "Guardando..."}
                  </>
                ) : (
                  <>
                    {editingTerm ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingTerm ? "Actualizar Término" : "Guardar Término"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Eliminar Término</h3>
              </div>

              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar este término? Esta acción no se puede deshacer.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => deleteTerm(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideOut {
          from { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideOut {
          animation: slideOut 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}