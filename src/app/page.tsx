"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Tag, BookOpen, Sparkles, X, Edit2, Trash2, ChevronUp, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface Term {
  id: number;
  title: string;
  content: string;
  tags: { id: number; name: string }[];
  createdAt: string;
}

interface FilterOptions {
  searchType: 'all' | 'title' | 'content' | 'tags';
  sortBy: 'newest' | 'oldest' | 'title';
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchType: 'all',
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetch("/api/terms")
      .then(res => res.json())
      .then(setTerms);
  }, []);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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

  // Advanced filtering and sorting
  const getFilteredAndSortedTerms = () => {
    let filtered = terms;

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = terms.filter(t => {
        switch (filterOptions.searchType) {
          case 'title':
            return t.title.toLowerCase().includes(searchLower);
          case 'content':
            return t.content.toLowerCase().includes(searchLower);
          case 'tags':
            return t.tags.some(tag => tag.name.toLowerCase().includes(searchLower));
          case 'all':
          default:
            return t.title.toLowerCase().includes(searchLower) ||
                   t.content.toLowerCase().includes(searchLower) ||
                   t.tags.some(tag => tag.name.toLowerCase().includes(searchLower));
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  };

  const filteredTerms = getFilteredAndSortedTerms();

  // Pagination logic
  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTerms = filteredTerms.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterOptions]);

  const getSearchTypeLabel = (type: string) => {
    switch (type) {
      case 'title': return 'Títulos';
      case 'content': return 'Definiciones';
      case 'tags': return 'Etiquetas';
      default: return 'Todo';
    }
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'oldest': return 'Más antiguos';
      case 'title': return 'Alfabético';
      default: return 'Más recientes';
    }
  };

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

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Buscar en ${getSearchTypeLabel(filterOptions.searchType).toLowerCase()}...`}
              className="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all bg-white shadow-sm"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                showFilters ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-sm animate-slideIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar en:
                  </label>
                  <select
                    value={filterOptions.searchType}
                    onChange={e => setFilterOptions({
                      ...filterOptions,
                      searchType: e.target.value as FilterOptions['searchType']
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300"
                  >
                    <option value="all">Todo</option>
                    <option value="title">Solo títulos</option>
                    <option value="content">Solo definiciones</option>
                    <option value="tags">Solo etiquetas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por:
                  </label>
                  <select
                    value={filterOptions.sortBy}
                    onChange={e => setFilterOptions({
                      ...filterOptions,
                      sortBy: e.target.value as FilterOptions['sortBy']
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="title">Alfabético</option>
                  </select>
                </div>
              </div>

              {/* Filter Summary */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <Search className="w-3 h-3" />
                  {getSearchTypeLabel(filterOptions.searchType)}
                </span>
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <Filter className="w-3 h-3" />
                  {getSortLabel(filterOptions.sortBy)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {filteredTerms.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredTerms.length)} de {filteredTerms.length} término{filteredTerms.length !== 1 ? 's' : ''}
              {search && ` para "${search}"`}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Terms List */}
        <div className="space-y-6 mb-8">
          {currentTerms.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {search ? "No se encontraron términos" : "No hay términos aún. ¡Agrega el primero!"}
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterOptions({ searchType: 'all', sortBy: 'newest' });
                  }}
                  className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            currentTerms.map(term => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    page === currentPage
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats */}
        {terms.length > 0 && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">
                {terms.length} término{terms.length !== 1 ? 's' : ''} en tu glosario
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 z-40"
          title="Subir arriba"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

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
    </div>
  );
}