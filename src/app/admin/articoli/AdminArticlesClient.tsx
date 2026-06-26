'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Check, Loader2, ArrowLeft, Image as ImageIcon, Search, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Article, Category } from '@/lib/types';

type AdminArticlesClientProps = {
  initialArticles: (Article & { categories: Category | null })[];
  categories: Category[];
};

type BodySection = {
  h?: string;
  paras?: string[];
  bullets?: string[];
};

export default function AdminArticlesClient({ initialArticles, categories }: AdminArticlesClientProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState(initialArticles);
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
    title: '',
    slug: '',
    category_id: '',
    excerpt: '',
    body_html: '', // For legacy WP migration edits
    body: [] as BodySection[], // Structured sections
    cover_url: '',
    cover_alt: '',
    author: 'Ufficio Tecnico Rossi Impianti',
    read_time: '',
    keywords: [] as string[],
    takeaways: [] as string[],
    faq: [] as { q: string; a: string }[],
    status: 'draft' as 'draft' | 'published',
    published_at: '',
  });

  // Dynamic router actions trigger
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      handleStartCreate();
    }
  }, [searchParams]);

  // Form helper variables
  const [newKeyword, setNewKeyword] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useHtmlBody, setUseHtmlBody] = useState(false);

  // Structured body helper: Active section editing
  const [sectionHeading, setSectionHeading] = useState('');
  const [sectionParas, setSectionParas] = useState(''); // Textarea with line-breaks representing paragraphs
  const [sectionBullets, setSectionBullets] = useState(''); // Textarea with line-breaks representing bullets

  // Filter calculation
  const filteredArticles = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter ? a.category_id === catFilter : true;
    return matchesSearch && matchesCat;
  });

  const handleTitleChange = (titleVal: string) => {
    const generatedSlug = titleVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    setForm((prev) => ({
      ...prev,
      title: titleVal,
      slug: mode === 'create' ? generatedSlug : prev.slug,
    }));
  };

  const handleStartCreate = () => {
    setForm({
      title: '',
      slug: '',
      category_id: categories[0]?.id || '',
      excerpt: '',
      body_html: '',
      body: [],
      cover_url: '',
      cover_alt: '',
      author: 'Ufficio Tecnico Rossi Impianti',
      read_time: '5 min',
      keywords: [],
      takeaways: [],
      faq: [],
      status: 'draft',
      published_at: new Date().toISOString().substring(0, 16), // datetime-local format
    });
    setUseHtmlBody(false);
    setMode('create');
  };

  const handleStartEdit = (art: Article) => {
    setEditId(art.id);
    setForm({
      title: art.title,
      slug: art.slug,
      category_id: art.category_id || '',
      excerpt: art.excerpt || '',
      body_html: art.body_html || '',
      body: art.body || [],
      cover_url: art.cover_url || '',
      cover_alt: art.cover_alt || '',
      author: art.author || 'Ufficio Tecnico Rossi Impianti',
      read_time: art.read_time || '5 min',
      keywords: art.keywords || [],
      takeaways: art.takeaways || [],
      faq: art.faq || [],
      status: art.status || 'draft',
      published_at: art.published_at
        ? new Date(art.published_at).toISOString().substring(0, 16)
        : new Date().toISOString().substring(0, 16),
    });
    setUseHtmlBody(!!art.body_html);
    setMode('edit');
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

      // Upload directly to Supabase storage bucket named 'articles'
      const { data, error } = await supabase.storage
        .from('articles')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('articles')
        .getPublicUrl(fileName);

      setForm((prev) => ({
        ...prev,
        cover_url: publicUrl,
        cover_alt: prev.cover_alt || prev.title,
      }));
    } catch (err: any) {
      console.error(err);
      alert("Impossibile caricare l'immagine su Supabase Storage. Assicurati che il bucket 'articles' esista e sia pubblico.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl) return;
    setForm((prev) => ({
      ...prev,
      cover_url: customImageUrl,
      cover_alt: prev.cover_alt || prev.title,
    }));
    setCustomImageUrl('');
  };

  // Chip modifiers
  const handleAddKeyword = () => {
    if (!newKeyword) return;
    if (!form.keywords.includes(newKeyword)) {
      setForm((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim().toLowerCase()],
      }));
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== kw),
    }));
  };

  const handleAddTakeaway = () => {
    if (!newTakeaway) return;
    setForm((prev) => ({
      ...prev,
      takeaways: [...prev.takeaways, newTakeaway.trim()],
    }));
    setNewTakeaway('');
  };

  const handleRemoveTakeaway = (index: number) => {
    setForm((prev) => ({
      ...prev,
      takeaways: prev.takeaways.filter((_, i) => i !== index),
    }));
  };

  const handleAddFaq = () => {
    if (!newFaq.q || !newFaq.a) return;
    setForm((prev) => ({
      ...prev,
      faq: [...prev.faq, newFaq],
    }));
    setNewFaq({ q: '', a: '' });
  };

  const handleRemoveFaq = (index: number) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  // Structured body modifiers
  const handleAddBodySection = () => {
    if (!sectionHeading && !sectionParas && !sectionBullets) return;

    const parsedParas = sectionParas
      ? sectionParas.split('\n').map((p) => p.trim()).filter((p) => p !== '')
      : [];
    const parsedBullets = sectionBullets
      ? sectionBullets.split('\n').map((b) => b.trim()).filter((b) => b !== '')
      : [];

    const newSec: BodySection = {};
    if (sectionHeading) newSec.h = sectionHeading.trim();
    if (parsedParas.length > 0) newSec.paras = parsedParas;
    if (parsedBullets.length > 0) newSec.bullets = parsedBullets;

    setForm((prev) => ({
      ...prev,
      body: [...(prev.body || []), newSec],
    }));

    setSectionHeading('');
    setSectionParas('');
    setSectionBullets('');
  };

  const handleRemoveBodySection = (index: number) => {
    setForm((prev) => ({
      ...prev,
      body: (prev.body || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) return;

    setLoading(true);

    const publishedAtVal = form.status === 'published'
      ? (form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString())
      : null;

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        category_id: form.category_id || null,
        excerpt: form.excerpt || null,
        body_html: useHtmlBody ? form.body_html : null,
        body: useHtmlBody ? null : form.body,
        cover_url: form.cover_url || null,
        cover_alt: form.cover_alt || null,
        author: form.author,
        read_time: form.read_time || null,
        keywords: form.keywords,
        takeaways: form.takeaways,
        faq: form.faq,
        status: form.status,
        published_at: publishedAtVal,
        updated_at: new Date().toISOString(),
      };

      if (mode === 'edit' && editId) {
        // UPDATE
        const { data, error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', editId)
          .select('*, categories(*)')
          .single();

        if (error) throw error;
        setArticles((prev) => prev.map((a) => (a.id === editId ? (data as any) : a)));
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('articles')
          .insert(payload)
          .select('*, categories(*)')
          .single();

        if (error) throw error;
        setArticles((prev) => [data as any, ...prev]);
      }
      setMode('list');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante il salvataggio dell\'articolo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Sei sicuro di voler eliminare l'articolo "${title}"? questa operazione è definitiva.`)) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Errore durante l\'eliminazione dell\'articolo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {mode === 'list' ? (
        <>          {/* Header */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <h1 className="font-saira font-extrabold text-3xl md:text-4xl text-text uppercase tracking-tight">
                Articoli Blog
              </h1>
              <p className="text-[14.5px] text-muted mt-1 leading-relaxed">
                Scrivi, modifica e pubblica notizie, normative o guide tecniche per il blog aziendale.
              </p>
            </div>
            <button
              onClick={handleStartCreate}
              className="font-saira font-bold text-[15px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover rounded-btn px-5 py-3 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Nuovo Articolo
            </button>
          </div>

          {/* Search Filters Row */}
          <div className="bg-surface border border-border rounded-card p-4 flex flex-col md:flex-row gap-3 shadow-sm">
            <div className="flex-grow relative flex items-center">
              <Search size={18} className="text-muted absolute left-3.5" />
              <input
                type="text"
                placeholder="Cerca articoli per titolo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-bg-alt border border-border rounded-btn pl-11 pr-4 py-2.5 text-text font-plex text-[14.5px] outline-none"
              />
            </div>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="bg-bg-alt border border-border rounded-btn px-4 py-2.5 text-text font-plex text-[14.5px] outline-none cursor-pointer min-w-[200px]"
            >
              <option value="">Tutte le categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Articles Table */}
          <div className="bg-surface border border-border rounded-card overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="bg-bg-alt border-b border-border text-muted font-saira font-bold tracking-[0.5px] uppercase text-xs">
                  <th className="p-4 w-16">Cover</th>
                  <th className="p-4">Titolo</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Autore</th>
                  <th className="p-4">Pubblicazione</th>
                  <th className="p-4">Stato</th>
                  <th className="p-4 w-28 text-center">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((a) => {
                  return (
                    <tr key={a.id} className="border-b border-border/40 hover:bg-bg-alt/50">
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-btn bg-bg-alt border border-border flex items-center justify-center p-0.5 overflow-hidden">
                          {a.cover_url ? (
                            <img src={a.cover_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-muted-2" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-text truncate max-w-[280px]" title={a.title}>
                          {a.title}
                        </div>
                        <div className="text-[11px] text-faint font-mono mt-0.5">{a.slug}</div>
                      </td>
                      <td className="p-4 text-text-2">
                        {a.categories?.name || <span className="text-faint">—</span>}
                      </td>
                      <td className="p-4 text-text-2 truncate max-w-[150px]">
                        {a.author}
                      </td>
                      <td className="p-4 text-text-2">
                        {a.published_at ? new Date(a.published_at).toLocaleDateString('it-IT') : <span className="text-faint">—</span>}
                      </td>
                      <td className="p-4 uppercase text-xs font-bold font-saira">
                        <span
                          className={`px-2 py-0.5 rounded-btn ${
                            a.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-faint/20 text-muted'
                          }`}
                        >
                          {a.status === 'published' ? 'pubblicato' : 'bozza'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleStartEdit(a)}
                            className="text-muted hover:text-text transition-colors"
                            title="Modifica"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id, a.title)}
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

                {filteredArticles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted">
                      Nessun articolo trovato.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* CREATE / EDIT FORM VIEW */
        <div className="bg-surface border border-border rounded-card p-6 md:p-8 flex flex-col gap-6 max-w-4xl shadow-sm">
          <div className="flex items-center gap-3 mb-2 border-b border-border/40 pb-4">
            <button
              onClick={() => setMode('list')}
              className="text-muted hover:text-text transition-colors p-1"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-saira font-extrabold text-[26px] text-text uppercase leading-none">
              {mode === 'create' ? 'Scrivi Articolo' : 'Modifica Articolo'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Meta Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Titolo Articolo *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Categoria *
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Autore
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso"
                />
              </div>

              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Tempo di Lettura (es. 5 min)
                </label>
                <input
                  type="text"
                  value={form.read_time}
                  onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                  className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Stato Pubblicazione
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                  className="w-full bg-bg-alt border border-border rounded-btn p-3.5 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso cursor-pointer"
                >
                  <option value="published">Pubblicato</option>
                  <option value="draft">Bozza (Draft)</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                  Data Pubblicazione (datetime)
                </label>
                <input
                  type="datetime-local"
                  value={form.published_at}
                  onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso cursor-pointer font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
                Riassunto Breve (Lead Excerpt) *
              </label>
              <textarea
                rows={2}
                required
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-bg-alt border border-border rounded-btn p-3 text-text font-plex text-[14.5px] outline-none focus:bg-white focus:border-rosso resize-none"
              />
            </div>

            {/* Body Editor Selector */}
            <div className="border border-border rounded-btn p-5 bg-bg-alt">
              <div className="flex justify-between items-center mb-4 border-b border-border/40 pb-2.5">
                <h4 className="font-saira font-bold text-[14px] tracking-[1.5px] text-text uppercase">
                  Contenuto Articolo
                </h4>
                <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useHtmlBody}
                    onChange={(e) => setUseHtmlBody(e.target.checked)}
                    className="accent-rosso"
                  />
                  <span>Usa HTML Diretto (WordPress Migrati)</span>
                </label>
              </div>

              {useHtmlBody ? (
                /* RAW HTML BODY */
                <div>
                  <label className="block text-[11px] text-muted uppercase mb-1.5 font-semibold">
                    HTML Post (Wordpress migrato)
                  </label>
                  <textarea
                    rows={8}
                    value={form.body_html}
                    onChange={(e) => setForm({ ...form, body_html: e.target.value })}
                    className="w-full bg-surface border border-border rounded p-3 text-text font-mono text-xs leading-relaxed"
                  />
                </div>
              ) : (
                /* STRUCTURED SECTIONS BUILDER */
                <div className="flex flex-col gap-4">
                  {/* Current sections view */}
                  <div className="flex flex-col gap-3">
                    {form.body && form.body.map((sec, idx) => (
                      <div key={idx} className="bg-surface border border-border p-3.5 rounded flex items-start justify-between gap-3 text-[13.5px]">
                        <div className="flex-grow">
                          {sec.h && <div className="font-saira font-bold text-text uppercase text-base">H2: {sec.h}</div>}
                          {sec.paras && sec.paras.map((p, pIdx) => <p key={pIdx} className="text-muted text-xs mt-1 leading-relaxed">{p}</p>)}
                          {sec.bullets && (
                            <ul className="list-disc pl-4 text-xs text-muted mt-1 leading-relaxed">
                              {sec.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                            </ul>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBodySection(idx)}
                          className="text-faint hover:text-rosso transition-colors p-1"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                    {(!form.body || form.body.length === 0) && (
                      <div className="text-xs text-faint italic py-2 text-center">Nessun blocco di testo aggiunto. Compila i campi sotto per aggiungere un blocco.</div>
                    )}
                  </div>

                  {/* Section inputs */}
                  <div className="bg-surface border border-border rounded p-4.5 p-5 flex flex-col gap-3.5 shadow-sm">
                    <span className="text-xs font-semibold text-text uppercase tracking-[0.5px]">Aggiungi Blocco di Testo</span>
                    <div>
                      <label className="block text-[11px] text-muted mb-1">Titolo Sezione (H2 Ancorato)</label>
                      <input
                        type="text"
                        value={sectionHeading}
                        onChange={(e) => setSectionHeading(e.target.value)}
                        className="w-full bg-bg-alt border border-border rounded p-2 text-text font-plex text-[13.5px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-muted mb-1">Paragrafi (un paragrafo per riga)</label>
                      <textarea
                        rows={3}
                        value={sectionParas}
                        onChange={(e) => setSectionParas(e.target.value)}
                        className="w-full bg-bg-alt border border-border rounded p-2 text-text font-plex text-[13.5px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-muted mb-1">Elenco Puntato (un punto per riga)</label>
                      <textarea
                        rows={2}
                        value={sectionBullets}
                        onChange={(e) => setSectionBullets(e.target.value)}
                        className="w-full bg-bg-alt border border-border rounded p-2 text-text font-plex text-[13.5px]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBodySection}
                      className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-text bg-bg-alt border border-border hover:border-border-2 rounded py-2 w-32 flex items-center justify-center gap-1.5 transition-colors self-end"
                    >
                      <Plus size={14} /> Inserisci
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Takeaway points Repeater */}
            <div className="border border-border rounded-btn p-5 bg-bg-alt">
              <h4 className="font-saira font-bold text-[14px] tracking-[1.5px] text-text uppercase mb-4 pb-2 border-b border-border/40">
                Punti chiave (In Sintesi)
              </h4>
              <div className="flex flex-col gap-2 mb-4">
                {form.takeaways.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 bg-surface p-2.5 rounded border border-border">
                    <span className="text-[13.5px] text-text text-left truncate flex-grow">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(idx)}
                      className="text-faint hover:text-rosso transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {form.takeaways.length === 0 && (
                  <div className="text-xs text-faint italic py-2 text-center">Nessun punto in sintesi inserito.</div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Aggiungi punto chiave..."
                  value={newTakeaway}
                  onChange={(e) => setNewTakeaway(e.target.value)}
                  className="flex-grow bg-surface border border-border rounded p-2 text-text font-plex text-[13.5px]"
                />
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-text bg-bg-alt border border-border hover:border-border-2 rounded py-2 px-4 transition-colors"
                >
                  Aggiungi
                </button>
              </div>
            </div>

            {/* FAQ Repeater */}
            <div className="border border-border rounded-btn p-5 bg-bg-alt">
              <h4 className="font-saira font-bold text-[14px] tracking-[1.5px] text-text uppercase mb-4 pb-2 border-b border-border/40">
                FAQ Ripetibili (Domande Frequenti)
              </h4>
              <div className="flex flex-col gap-3 mb-4">
                {form.faq.map((item, idx) => (
                  <div key={idx} className="bg-surface border border-border p-3 rounded flex items-start justify-between gap-3 text-[13.5px]">
                    <div className="text-left flex-grow">
                      <div className="font-semibold text-text">Q: {item.q}</div>
                      <p className="text-muted text-xs mt-1">{item.a}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-faint hover:text-rosso transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {form.faq.length === 0 && (
                  <div className="text-xs text-faint italic py-2 text-center">Nessuna FAQ aggiunta.</div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="block text-[11px] text-muted mb-1">Domanda</label>
                  <input
                    type="text"
                    value={newFaq.q}
                    onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                    className="w-full bg-surface border border-border rounded p-2 text-text font-plex text-[13.5px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted mb-1">Risposta</label>
                  <input
                    type="text"
                    value={newFaq.a}
                    onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                    className="w-full bg-surface border border-border rounded p-2 text-text font-plex text-[13.5px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-text bg-bg-alt border border-border hover:border-border-2 rounded py-2 px-4 transition-colors"
                >
                  Inserisci
                </button>
              </div>
            </div>

            {/* Keyword tags chips */}
            <div className="border border-border rounded-btn p-5 bg-bg-alt">
              <h4 className="font-saira font-bold text-[14px] tracking-[1.5px] text-text uppercase mb-4 pb-2 border-b border-border/40">
                Parole chiave (SEO keywords)
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {form.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 font-saira font-semibold text-[13px] tracking-[0.5px] uppercase text-text-2 bg-surface border border-border rounded-btn px-2.5 py-1 shadow-sm"
                  >
                    <span>#{kw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-faint hover:text-rosso ml-1.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {form.keywords.length === 0 && (
                  <div className="text-xs text-faint italic py-2">Nessun tag inserito.</div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Parola chiave (es. radiante)"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="flex-grow bg-surface border border-border rounded p-2 text-text font-plex text-[13.5px]"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-text bg-bg-alt border border-border hover:border-border-2 rounded py-2 px-4 transition-colors"
                >
                  Aggiungi
                </button>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="border border-border rounded-btn p-5 bg-bg-alt">
              <h4 className="font-saira font-bold text-[14px] tracking-[1.5px] text-text uppercase mb-4 pb-2 border-b border-border/40">
                Immagine di Copertina
              </h4>
              
              {form.cover_url && (
                <div className="mb-4">
                  <div className="relative w-40 h-24 border border-border bg-surface p-1 rounded overflow-hidden group shadow-sm">
                    <img src={form.cover_url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, cover_url: '', cover_alt: '' }))}
                      className="absolute inset-0 bg-rosso/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Testo alternativo (Alt tag)"
                    value={form.cover_alt}
                    onChange={(e) => setForm({ ...form, cover_alt: e.target.value })}
                    className="w-full max-w-sm mt-3 bg-surface border border-border rounded p-2 text-text font-plex text-[13px]"
                  />
                </div>
              )}

              <div className="flex flex-col gap-4">
                {/* File upload */}
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
                      className="text-xs text-muted border border-border rounded bg-surface p-2 file:bg-bg-alt file:border file:border-border file:text-text file:rounded file:px-3 file:py-1 file:mr-3 hover:file:bg-surface-2 file:transition-colors file:cursor-pointer disabled:opacity-50"
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
                    Oppure URL diretto cover
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://esempio.com/immagine.jpg"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-grow bg-surface border border-border rounded p-2 text-text font-plex text-[13.5px] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="font-saira font-bold text-[13px] tracking-[0.5px] uppercase text-text bg-bg-alt border border-border hover:border-border-2 rounded py-2 px-4 transition-colors"
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
                <span>Salva Articolo</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('list')}
                className="font-saira font-bold text-[16px] tracking-[0.5px] uppercase text-muted hover:text-text bg-bg-alt border border-border hover:border-border-2 rounded-btn px-6 py-3 transition-colors"
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
