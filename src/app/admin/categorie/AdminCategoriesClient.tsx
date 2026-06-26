'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';

type AdminCategoriesClientProps = {
  initialCategories: Category[];
};

export default function AdminCategoriesClient({ initialCategories }: AdminCategoriesClientProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);

  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    kind: 'article' as 'article' | 'product',
    color_bg: '#16A34A',
    color_text: '#ffffff',
  });

  const handleNameChange = (nameVal: string) => {
    // Auto-generate slug from name if not in edit mode
    const generatedSlug = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    setForm((prev) => ({
      ...prev,
      name: nameVal,
      slug: editId ? prev.slug : generatedSlug,
    }));
  };

  const handleResetForm = () => {
    setEditId(null);
    setForm({
      name: '',
      slug: '',
      kind: 'article',
      color_bg: '#16A34A',
      color_text: '#ffffff',
    });
  };

  const handleStartEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      kind: cat.kind,
      color_bg: cat.color_bg || '#16A34A',
      color_text: cat.color_text || '#ffffff',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return;

    setLoading(true);

    try {
      if (editId) {
        // UPDATE
        const { data, error } = await supabase
          .from('categories')
          .update({
            name: form.name,
            slug: form.slug,
            kind: form.kind,
            color_bg: form.color_bg,
            color_text: form.color_text,
          })
          .eq('id', editId)
          .select()
          .single();

        if (error) throw error;
        setCategories((prev) => prev.map((c) => (c.id === editId ? (data as Category) : c)));
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: form.name,
            slug: form.slug,
            kind: form.kind,
            color_bg: form.color_bg,
            color_text: form.color_text,
          })
          .select()
          .single();

        if (error) throw error;
        setCategories((prev) => [...prev, data as Category]);
      }
      handleResetForm();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante il salvataggio della categoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Sei sicuro di voler eliminare la categoria "${name}"? Questa operazione potrebbe causare errori se ci sono articoli o prodotti associati ad essa.`)) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editId === id) handleResetForm();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante l\'eliminazione. Assicurati che non ci siano articoli o prodotti associati.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-saira font-extrabold text-3xl md:text-4xl text-text uppercase tracking-tight">
          Gestione Categorie
        </h1>
        <p className="text-[14.5px] text-muted mt-1 leading-relaxed">
          Aggiungi, modifica o elimina le categorie degli articoli del blog e dei prodotti dello shop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* Category List Pane */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-6 shadow-sm">
          {/* Article categories */}
          <div>
            <h3 className="font-saira font-bold text-[18px] tracking-[1.5px] text-text uppercase mb-4 pb-2 border-b border-border/40">
              Categorie Articoli (Blog)
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {categories
                .filter((c) => c.kind === 'article')
                .map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 bg-bg-alt border border-border hover:border-border-2 rounded-btn px-4 py-2"
                  >
                    <span
                      style={{
                        backgroundColor: cat.color_bg || '#16A34A',
                        color: cat.color_text || '#ffffff',
                      }}
                      className="font-saira font-semibold text-[12px] tracking-[0.5px] uppercase rounded-btn px-2.5 py-0.5 shadow-sm"
                    >
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-faint font-mono">( {cat.slug} )</span>
                    <div className="flex items-center gap-1.5 ml-2 border-l border-border/50 pl-2">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="text-muted hover:text-text transition-colors"
                        title="Modifica"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-muted hover:text-rosso transition-colors"
                        title="Elimina"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Product categories */}
          <div className="mt-4">
            <h3 className="font-saira font-bold text-[18px] tracking-[1.5px] text-text uppercase mb-4 pb-2 border-b border-border/40">
              Categorie Prodotti (Shop)
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {categories
                .filter((c) => c.kind === 'product')
                .map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 bg-bg-alt border border-border hover:border-border-2 rounded-btn px-4 py-2"
                  >
                    <span
                      style={{
                        backgroundColor: cat.color_bg || '#2BB3EF',
                        color: cat.color_text || '#ffffff',
                      }}
                      className="font-saira font-semibold text-[12px] tracking-[0.5px] uppercase rounded-btn px-2.5 py-0.5 shadow-sm"
                    >
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-faint font-mono">( {cat.slug} )</span>
                    <div className="flex items-center gap-1.5 ml-2 border-l border-border/50 pl-2">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="text-muted hover:text-text transition-colors"
                        title="Modifica"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-muted hover:text-rosso transition-colors"
                        title="Elimina"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Categories form */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col shadow-sm">
          <h3 className="font-saira font-bold text-[20px] text-text uppercase mb-5 pb-2.5 border-b border-border/60">
            {editId ? 'Modifica Categoria' : 'Nuova Categoria'}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                Nome Categoria *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso"
              />
            </div>

            <div>
              <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                Slug (URL) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso font-mono"
              />
            </div>

            <div>
              <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                Tipo Categoria *
              </label>
              <select
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value as 'article' | 'product' })}
                className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso cursor-pointer"
              >
                <option value="article">Articolo (Blog)</option>
                <option value="product">Prodotto (Shop)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Colore Sfondo
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.color_bg}
                    onChange={(e) => setForm({ ...form, color_bg: e.target.value })}
                    className="w-10 h-10 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={form.color_bg}
                    onChange={(e) => setForm({ ...form, color_bg: e.target.value })}
                    className="w-full bg-bg-alt border border-border rounded-btn p-2 text-text font-plex text-[13.5px] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Colore Testo
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.color_text}
                    onChange={(e) => setForm({ ...form, color_text: e.target.value })}
                    className="w-10 h-10 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={form.color_text}
                    onChange={(e) => setForm({ ...form, color_text: e.target.value })}
                    className="w-full bg-bg-alt border border-border rounded-btn p-2 text-text font-plex text-[13.5px] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Preview Badge */}
            <div className="bg-bg-alt border border-border rounded-btn p-4 text-center mt-2">
              <span className="text-xs text-muted block mb-2 uppercase tracking-[0.5px]">Anteprima Badge:</span>
              <span
                style={{ backgroundColor: form.color_bg, color: form.color_text }}
                className="font-saira font-semibold text-[13px] tracking-[0.5px] uppercase rounded-btn px-4 py-1.5 shadow inline-block"
              >
                {form.name || 'CATEGORIA'}
              </span>
            </div>

            <div className="flex gap-2.5 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-grow font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn py-2.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{editId ? 'Salva' : 'Aggiungi'}</span>
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-muted hover:text-text bg-bg-alt border border-border hover:border-border-2 rounded-btn py-2.5 px-4 transition-colors"
                >
                  Annulla
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
