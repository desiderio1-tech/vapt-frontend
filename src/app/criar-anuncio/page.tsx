'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Upload, X, MapPin, Tag, DollarSign, FileText } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

export default function CriarAnuncioPage() {
  const router = useRouter();
  const { user, loadUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'Usado',
    location: 'Maputo',
    categoryId: '',
  });

  useEffect(() => {
    loadUser();
    // Carregar categorias do backend
    api
      .get('/categories')
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error('Erro ao carregar categorias:', err));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error('Máximo de 5 imagens por anúncio.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));

    try {
      const res = await api.post('/ads/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages([...images, ...res.data.urls]);
      toast.success(`${res.data.urls.length} imagem(ns) carregada(s)!`);
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao carregar imagens.');
    } finally {
      setUploading(false);
      // Limpar o input para permitir carregar a mesma imagem novamente
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Precisas de estar logado para criar um anúncio.');
      router.push('/login');
      return;
    }

    if (images.length === 0) {
      toast.error('Adiciona pelo menos 1 imagem.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/ads', { ...form, images });
      toast.success('Anúncio publicado com sucesso! 🎉');
      router.push('/painel');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao criar anúncio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-vapt-blue">Vender produto</h1>
        <p className="text-gray-500 mt-1">Preenche os detalhes e publica o teu anúncio.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        {/* IMAGENS */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            Imagens do produto ({images.length}/5)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-vapt-blue transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading || images.length >= 5}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex flex-col items-center ${
                images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload size={32} className="text-vapt-blue mb-2" />
              <span className="font-semibold text-vapt-blue">
                {uploading ? 'A carregar...' : images.length >= 5 ? 'Limite atingido' : 'Clica para adicionar imagens'}
              </span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG ou WEBP — máx 5MB</span>
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`Imagem ${i + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition"
                    title="Remover"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TÍTULO */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Título do anúncio</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue transition">
            <FileText size={18} className="text-gray-400" />
            <input
              type="text"
              required
              maxLength={80}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="flex-1 px-3 py-2.5 outline-none text-sm"
              placeholder="Ex: iPhone 12 128GB em excelente estado"
            />
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Descrição</label>
          <textarea
            required
            rows={4}
            maxLength={1000}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm focus:border-vapt-blue transition"
            placeholder="Descreve o produto, estado de conservação, tempo de uso, se tem garantia, etc."
          />
          <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000</p>
        </div>

        {/* PREÇO + ESTADO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Preço (MT)</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue transition">
              <DollarSign size={18} className="text-gray-400" />
              <input
                type="number"
                required
                min="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="flex-1 px-3 py-2.5 outline-none text-sm"
                placeholder="12000"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Estado</label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm focus:border-vapt-blue transition bg-white"
            >
              <option value="Novo">Novo</option>
              <option value="Como novo">Como novo</option>
              <option value="Usado">Usado</option>
              <option value="Para peças">Para peças</option>
            </select>
          </div>
        </div>

        {/* LOCALIZAÇÃO + CATEGORIA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Localização</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue transition">
              <MapPin size={18} className="text-gray-400" />
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="flex-1 px-3 py-2.5 outline-none text-sm"
                placeholder="Maputo"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Categoria</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue transition">
              <Tag size={18} className="text-gray-400" />
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="flex-1 px-3 py-2.5 outline-none text-sm bg-transparent"
              >
                <option value="">Seleciona...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-vapt-green hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? 'A publicar...' : uploading ? 'A carregar imagens...' : 'Publicar anúncio'}
        </button>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 text-sm text-blue-800">
        <strong>💡 Dica:</strong> Quanto mais detalhes e imagens adicionares, mais rápido consegues vender o teu produto. Tira fotos com boa iluminação!
      </div>
    </div>
  );
}