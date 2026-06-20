'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Loader2, ArrowLeft, Image as ImageIcon, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Product, Category } from '@/lib/types';

type AdminProductsClientProps = {
  initialProducts: (Product & { categories: Category | null })[];
  categories: Category[];
};

export default function AdminProductsClient({ initialProducts, categories }: AdminProductsClientProps) {
  const supabase = createClient();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Search & filter
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  // Mode: 'list' | 'create' | 'edit'
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category_id: '',
    price: '', // EUR as string (e.g. "890.00")
    short: '',
    description: '',
    in_stock: true,
    status: 'published' as 'draft' | 'published',
    specs: [] as { k: string; v: string }[],
    image_urls: [] as string[],
  });

  // Spec helper states
  const [newSpec, setNewSpec] = useState({ k: '', v: '' });
  // Custom image URL state
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Filters calculation
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter ? p.category_id === catFilter : true;
    return matchesSearch && matchesCat;
  });

  const handleNameChange = (nameVal: string) => {
    const generatedSlug = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    setForm((prev) => ({
      ...prev,
      name: nameVal,
      slug: mode === 'create' ? generatedSlug : prev.slug,
    }));
  };

  const handleStartCreate = () => {
    setForm({
      name: '',
      slug: '',
      category_id: categories[0]?.id || '',
      price: '',
      short: '',
      description: '',
      in_stock: true,
      status: 'published',
      specs: [],
      image_urls: [],
    });
    setMode('create');
  };

  const handleStartEdit = (prod: Product) => {
    setEditId(prod.id);
    setForm({
      name: prod.name,
      slug: prod.slug,
      category_id: prod.category_id || '',
      price: (prod.price_cents / 100).toFixed(2),
      short: prod.short || '',
      description: prod.description || '',
      in_stock: prod.in_stock,
      status: prod.status || 'published',
      specs: prod.specs || [],
      image_urls: prod.image_urls || [],
    });
    setMode('edit');
  };

  // Image Upload helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

      // Upload directly to Supabase storage bucket named 'products'
      // Note: We use public bucket upload
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      setForm((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, publicUrl],
      }));
    } catch (err: any) {
      console.error(err);
      alert("Impossibile caricare il file su Supabase Storage. Assicurati che il bucket 'products' esista e sia pubblico.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl) return;
    setForm((prev) => ({
      ...prev,
      image_urls: [...prev.image_urls, customImageUrl],
    }));
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
    }));
  };

  // Specs helper
  const handleAddSpec = () => {
    if (!newSpec.k || !newSpec.v) return;
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, newSpec],
    }));
    setNewSpec({ k: '', v: '' });
  };

  const handleRemoveSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.price) return;

    setLoading(true);
    const priceCents = Math.round(parseFloat(form.price) * 100);

    try {
      if (mode === 'edit' && editId) {
        // UPDATE
        const { data, error } = await supabase
          .from('products')
          .update({
            name: form.name,
            slug: form.slug,
            category_id: form.category_id || null,
            price_cents: priceCents,
            short: form.short || null,
            description: form.description || null,
            in_stock: form.in_stock,
            status: form.status,
            specs: form.specs,
            image_urls: form.image_urls,
          })
          .eq('id', editId)
          .select('*, categories(*)')
          .single();

        if (error) throw error;
        setProducts((prev) => prev.map((p) => (p.id === editId ? (data as any) : p)));
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: form.name,
            slug: form.slug,
            category_id: form.category_id || null,
            price_cents: priceCents,
            short: form.short || null,
            description: form.description || null,
            in_stock: form.in_stock,
            status: form.status,
            specs: form.specs,
            image_urls: form.image_urls,
          })
          .select('*, categories(*)')
          .single();

        if (error) throw error;
        setProducts((prev) => [...prev, data as any]);
      }
      setMode('list');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante il salvataggio del prodotto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Sei sicuro di voler eliminare il prodotto "${name}"? questa operazione è irreversibile.`)) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante l\'eliminazione del prodotto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {mode === 'list' ? (
        <>
          {/* Header */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <h1 className="font-saira font-extrabold text-3xl md:text-4xl text-white uppercase tracking-tight">
                Catalogo Prodotti
              </h1>
              <p className="text-[14.5px] text-muted mt-1 leading-relaxed">
                Gestisci i prodotti dello shop online. Modifica i dettagli, le specifiche e la disponibilità in stock.
              </p>
            </div>
            <button
              onClick={handleStartCreate}
              className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn px-5 py-3 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Add Prodotto
            </button>
          </div>

          {/* Search Filters Row */}
          <div className="bg-surface border border-border rounded-card p-4 flex flex-col md:flex-row gap-3">
            <div className="flex-grow relative flex items-center">
              <Search size={18} className="text-muted absolute left-3.5" />
              <input
                type="text"
                placeholder="Cerca prodotti per nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#101214] border border-[#2c3137] rounded-btn pl-11 pr-4 py-2.5 text-white font-plex text-[14.5px] outline-none"
              />
            </div>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="bg-[#101214] border border-[#2c3137] rounded-btn px-4 py-2.5 text-white font-plex text-[14.5px] outline-none cursor-pointer min-w-[200px]"
            >
              <option value="">Tutte le categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Table/List */}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="bg-[#101214] border-b border-border text-muted font-saira font-bold tracking-[0.5px] uppercase text-xs">
                  <th className="p-4 w-16">Foto</th>
                  <th className="p-4">Prodotto</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Prezzo</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Stato</th>
                  <th className="p-4 w-28 text-center">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const imageSrc = p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : '';
                  return (
                    <tr key={p.id} className="border-b border-border/40 hover:bg-surface/50">
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-btn bg-[#101214] border border-border flex items-center justify-center p-0.5 overflow-hidden">
                          {imageSrc ? (
                            <img src={imageSrc} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <ImageIcon size={18} className="text-muted2" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-[12px] text-faint font-mono mt-0.5">{p.slug}</div>
                      </td>
                      <td className="p-4 text-text2">
                        {p.categories?.name || <span className="text-faint">—</span>}
                      </td>
                      <td className="p-4 text-white font-medium">
                        {(p.price_cents / 100).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${p.in_stock ? 'text-green-500' : 'text-rosso'}`}
                        >
                          {p.in_stock ? 'Disponibile' : 'Esaurito'}
                        </span>
                      </td>
                      <td className="p-4 uppercase text-xs font-bold font-saira">
                        <span
                          className={`px-2 py-0.5 rounded-btn ${
                            p.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-faint/20 text-muted'
                          }`}
                        >
                          {p.status === 'published' ? 'pubblicato' : 'bozza'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="text-muted hover:text-white transition-colors"
                            title="Modifica"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="text-muted hover:text-rosso transition-colors"
                            title="Elimina"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted">
                      Nessun prodotto trovato.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* CREATE / EDIT FORM VIEW */
        <div className="bg-surface border border-border rounded-card p-6 md:p-8 flex flex-col gap-6 max-w-4xl">
          <div className="flex items-center gap-3 mb-2 border-b border-border/40 pb-4">
            <button
              onClick={() => setMode('list')}
              className="text-muted hover:text-white transition-colors p-1"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-saira font-extrabold text-[26px] text-white uppercase leading-none">
              {mode === 'create' ? 'Aggiungi Prodotto' : 'Modifica Prodotto'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Nome Prodotto *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso"
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
                  className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Categoria *
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso cursor-pointer"
                >
                  <option value="">Nessuna</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Prezzo in EUR (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="890.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2.5 p-3.5 bg-[#101214] border border-border rounded-btn select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                  className="accent-rosso w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-[14.5px] text-white">Disponibilità Stock</span>
                  <p className="text-[12px] text-muted">Controlla se il prodotto è ordinabile online</p>
                </div>
              </label>

              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Stato Pubblicazione
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                  className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3.5 text-white font-plex text-[14.5px] outline-none focus:border-rosso cursor-pointer"
                >
                  <option value="published">Pubblicato (Visibile)</option>
                  <option value="draft">Bozza (Nascosto)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                Descrizione Breve (Short Excerpt)
              </label>
              <textarea
                rows={2}
                value={form.short}
                onChange={(e) => setForm({ ...form, short: e.target.value })}
                className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso resize-none"
              />
            </div>

            <div>
              <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                Descrizione Dettagliata
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3 text-white font-plex text-[14.5px] outline-none focus:border-rosso"
              />
            </div>

            {/* Spec Repeater Panel */}
            <div className="border border-border rounded-btn p-5 bg-[#101214]">
              <h4 className="font-saira font-bold text-[14px] tracking-[1.5px] text-white uppercase mb-4 pb-2 border-b border-border/40">
                Specifiche Tecniche (Tabella K/V)
              </h4>
              <div className="flex flex-col gap-2.5 mb-4">
                {form.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 bg-surface p-2.5 rounded border border-border">
                    <span className="font-semibold text-[13.5px] text-muted w-1/3 truncate text-left">{spec.k}</span>
                    <span className="text-[13.5px] text-white text-left flex-grow truncate">{spec.v}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-faint hover:text-rosso transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {form.specs.length === 0 && (
                  <div className="text-xs text-faint italic py-2 text-center">Nessuna specifica tecnica aggiunta.</div>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="block text-[11px] text-muted uppercase mb-1">Proprietà (es. Potenza)</label>
                  <input
                    type="text"
                    value={newSpec.k}
                    onChange={(e) => setNewSpec({ ...newSpec, k: e.target.value })}
                    className="w-full bg-surface border border-border rounded p-2 text-white font-plex text-[13.5px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted uppercase mb-1">Valore (es. 24 kW)</label>
                  <input
                    type="text"
                    value={newSpec.v}
                    onChange={(e) => setNewSpec({ ...newSpec, v: e.target.value })}
                    className="w-full bg-surface border border-border rounded p-2 text-white font-plex text-[13.5px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-white bg-border border border-border hover:border-text2 rounded py-2 px-4 flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={14} /> Aggiungi
                </button>
              </div>
            </div>

            {/* Images Upload / Direct URL Pane */}
            <div className="border border-border rounded-btn p-5 bg-[#101214]">
              <h4 className="font-saira font-bold text-[14px] tracking-[1.5px] text-white uppercase mb-4 pb-2 border-b border-border/40">
                Immagini Prodotto
              </h4>
              
              {/* Image previews list */}
              <div className="flex flex-wrap gap-3 mb-4">
                {form.image_urls.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 border border-border bg-surface p-1 rounded overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-rosso/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {form.image_urls.length === 0 && (
                  <div className="text-xs text-faint italic py-2">Nessuna immagine inserita.</div>
                )}
              </div>

              {/* Upload input & URL input */}
              <div className="flex flex-col gap-4">
                {/* File Upload */}
                <div>
                  <label className="block text-[12px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                    Carica file immagine
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="text-xs text-muted border border-border rounded bg-surface p-2 file:bg-[#101214] file:border file:border-border file:text-white file:rounded file:px-3 file:py-1 file:mr-3 hover:file:bg-[#20242a] file:transition-colors file:cursor-pointer disabled:opacity-50"
                    />
                    {uploadingImage && (
                      <span className="flex items-center gap-1.5 text-xs text-azzurro font-semibold">
                        <Loader2 size={14} className="animate-spin" /> Caricamento in corso...
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-border/30 my-1" />

                {/* Direct URL */}
                <div>
                  <label className="block text-[12px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                    Oppure inserisci URL immagine
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://esempio.com/immagine.jpg"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-grow bg-surface border border-border rounded p-2 text-white font-plex text-[13.5px] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-white bg-border border border-border hover:border-text2 rounded py-2 px-4 transition-colors"
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-3 mt-4 border-t border-border/40 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="font-saira font-bold text-[16px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn px-6 py-3 flex items-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>Salva Prodotto</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('list')}
                className="font-saira font-bold text-[16px] tracking-[0.5px] uppercase text-muted hover:text-white bg-[#101214] border border-border hover:border-border2 rounded-btn px-6 py-3 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
