import React, { useState } from 'react';
import { products } from './data/products';
import CartDrawer from './components/CartDrawer';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';



const Header = ({ favoritesCount, onCategorySelect, searchTerm, onSearchChange, onShowFavorites, showFavoritesOnly, cartCount, onShowCart, onMenuOpen }) => (
  <header className="sticky top-0 z-[100] bg-white/95 dark:bg-dark/95 backdrop-blur-md border-b border-gold/25 px-6 md:px-12 flex items-center justify-between h-[72px] transition-colors">
    <a href="#" onClick={() => { onCategorySelect('All'); onSearchChange(''); onShowFavorites(false); }} className="flex flex-col items-start no-underline leading-none group">
      <span className="font-serif italic text-3xl text-dark dark:text-white tracking-tight">Lúmina</span>
      <span className="font-sans text-[0.55rem] tracking-[0.3em] uppercase text-gold mt-0.5">Accesorios</span>
    </a>

    <nav className="hidden lg:flex gap-9">
      {[
        { name: 'Novedades', id: 'All' },
        { name: 'Dijes', id: 'Dijes' },
        { name: 'Pulseras', id: 'Bracelets' },
        { name: 'Collares', id: 'Collares' },
        { name: 'Sobre Nosotras', id: 'all' }
      ].map((item) => (
        <a
          key={item.name}
          href="#coleccion"
          onClick={() => {
            if (item.name === 'Sobre Nosotras') return; // Just scroll to footer/placeholder
            onCategorySelect(item.id);
            onShowFavorites(false);
          }}
          className="nav-link text-[0.78rem] tracking-wider uppercase text-mid dark:text-slate-300 hover:text-dark dark:hover:text-white font-normal"
        >
          {item.name}
        </a>
      ))}
    </nav>

    <div className="flex items-center gap-5">
      <div className="hidden sm:flex items-center gap-2 border border-gold/25 px-3.5 py-1.5 rounded-sm bg-white dark:bg-slate-800">
        <span className="material-symbols-outlined notranslate text-slate-400 dark:text-slate-500 !text-sm">search</span>
        <input
          type="text"
          placeholder="Buscar joyas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent border-none outline-none font-sans text-[0.78rem] text-dark dark:text-white w-40 placeholder:text-slate-300 dark:placeholder:text-slate-600"
        />
      </div>
      <button
        onClick={() => onShowFavorites(!showFavoritesOnly)}
        className={`transition-colors relative ${showFavoritesOnly ? 'text-red-500' : 'text-mid dark:text-slate-300 hover:text-red-500'}`}
      >
        <span
          className="material-symbols-outlined notranslate !text-xl"
          style={{ fontVariationSettings: showFavoritesOnly ? "'FILL' 1" : "'FILL' 0" }}
        >
          favorite
        </span>
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-white text-[0.6rem] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold">{favoritesCount}</span>
        )}
      </button>
      <button
        onClick={onShowCart}
        className="text-mid dark:text-slate-300 hover:text-gold transition-colors relative text-inherit"
      >
        <span className="material-symbols-outlined notranslate !text-xl">shopping_bag</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-white text-[0.6rem] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold">{cartCount}</span>
        )}
      </button>
      <button 
        onClick={onMenuOpen}
        className="lg:hidden text-mid dark:text-slate-300 hover:text-gold transition-colors text-inherit"
      >
        <span className="material-symbols-outlined notranslate !text-xl">menu</span>
      </button>
    </div>
  </header>
);

const MobileMenu = ({ isOpen, onClose, onCategorySelect }) => (
  <div 
    className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
  >
    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
      onClick={onClose}
    />
    
    {/* Drawer */}
    <div 
      className={`absolute top-0 right-0 w-80 h-full bg-white dark:bg-dark shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-12">
          <span className="font-serif italic text-2xl text-dark dark:text-white">Lúmina</span>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gold/20 text-mid dark:text-slate-300"
          >
            <span className="material-symbols-outlined notranslate">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-8">
          {[
            { name: 'Novedades', id: 'All' },
            { name: 'Dijes', id: 'Dijes' },
            { name: 'Pulseras', id: 'Bracelets' },
            { name: 'Collares', id: 'Collares' },
            { name: 'Sobre Nosotras', id: 'all' }
          ].map((item) => (
            <a
              key={item.name}
              href="#coleccion"
              onClick={() => {
                if (item.name !== 'Sobre Nosotras') {
                  onCategorySelect(item.id);
                }
                onClose();
              }}
              className="font-sans text-xs tracking-[0.2em] uppercase text-mid dark:text-slate-300 hover:text-gold transition-colors pb-4 border-b border-gold/5"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-gold/10">
          <p className="text-[0.65rem] tracking-widest uppercase text-gold mb-6">Síguenos</p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined notranslate text-mid dark:text-slate-400 !text-lg">brand_awareness</span>
            <span className="material-symbols-outlined notranslate text-mid dark:text-slate-400 !text-lg">podcasts</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);


const Hero = () => (
  <section className="relative h-[92vh] min-h-[600px] overflow-hidden flex items-center">
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/45 to-transparent z-10"
      />
      <img
        src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1600&q=85"
        alt="Lúmina Hero"
        className="w-full h-full object-cover hero-zoom"
      />
    </div>

    <div className="relative z-10 px-6 md:px-20 max-w-[700px] hero-fade">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-[1px] bg-gold-light" />
        <span className="font-sans text-[0.7rem] tracking-widest uppercase text-gold-light">Nueva Colección 2026</span>
      </div>
      <h1 className="font-serif text-6xl md:text-8xl font-light text-white leading-[1.08] mb-7 -tracking-tighter">
        Joyas que <em className="italic text-gold-light">cuentan</em><br />tu historia
      </h1>
      <p className="text-white/75 text-lg font-light leading-relaxed mb-11 max-w-[480px]">
        Descubre nuestra exclusiva selección de dijes, pulseras y collares diseñados para capturar tus momentos más especiales.
      </p>
      <div className="flex flex-wrap gap-4">
        <a href="#coleccion" className="bg-gold hover:bg-[#a0804f] text-white px-9 py-4 font-sans text-[0.75rem] tracking-wider uppercase transition-all hover:-translate-y-0.5">
          Ver Colección
        </a>
        <a href="#" className="bg-transparent text-white border border-white/50 hover:border-gold hover:bg-gold/10 px-9 py-4 font-sans text-[0.75rem] tracking-wider uppercase transition-all">
          Saber Más
        </a>
      </div>
    </div>
  </section>
);



const ProductCard = ({ product, isFavorite, onToggleFavorite, onAddToCart }) => (
  <div className="bg-white dark:bg-[#1f1a14] border border-gold/15 group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(26,23,20,0.15)] hover:-translate-y-0.5">
    <div className="aspect-square overflow-hidden bg-gold-pale dark:bg-slate-900 relative">
      <img
        src={product.image}
        alt={product.name}
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock === 0 ? 'grayscale opacity-70' : ''}`}
      />
      {product.stock === 0 ? (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/90 text-white text-[0.6rem] tracking-widest uppercase px-4 py-1.5 z-20 font-bold shadow-xl">
          Agotado
        </span>
      ) : product.tag && (
        <span className="absolute top-2.5 left-2.5 bg-dark dark:bg-gold text-gold-light dark:text-white text-[0.55rem] tracking-widest uppercase px-2 py-0.5">
          {product.tag}
        </span>
      )}
      <button
        onClick={() => onToggleFavorite(product.id)}
        className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white dark:bg-dark border border-gold/10 flex items-center justify-center transition-all shadow-sm ${isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
      >
        <span
          className="material-symbols-outlined notranslate !text-base"
          style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
        >
          favorite
        </span>
      </button>
    </div>
    <div className="p-3 md:p-4 border-t border-gold/15">
      <p className="text-[0.55rem] tracking-[0.15em] uppercase text-gold mb-1">{product.category}</p>
      <h3 className="font-serif text-[0.95rem] font-normal text-dark dark:text-white mb-2 leading-tight h-10 line-clamp-2">{product.name}</h3>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-sm font-medium text-dark dark:text-gold-light">
          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price)}
        </span>
        <button
          onClick={() => product.stock > 0 && onAddToCart(product)}
          disabled={product.stock === 0}
          className={`px-3 py-1.5 font-sans text-[0.6rem] tracking-wider uppercase transition-colors ${product.stock === 0
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            : 'bg-dark dark:bg-gold text-white hover:bg-gold dark:hover:bg-white dark:hover:text-dark transition-all'
            }`}
        >
          {product.stock === 0 ? 'Fin' : 'Añadir'}
        </button>
      </div>
    </div>
  </div>
);

const PromoBanner = () => (
  <section className="relative h-[420px] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-dark/88 via-dark/40 to-transparent z-10" />
      <img
        src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80"
        alt="Promo Banner"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="relative z-10 px-6 md:px-20 max-w-[580px]">
      <span className="text-[0.68rem] tracking-widest uppercase text-gold mb-3.5 block">Colección Especial</span>
      <h2 className="font-serif text-5xl font-light text-white leading-tight mb-5">
        Dijes que <em className="italic text-gold-light">te</em><br />identifican
      </h2>
      <p className="text-white/70 text-[0.92rem] font-light leading-loose mb-9">
        Cada dije cuenta una historia única. Personaliza tu pulsera con los momentos que más importan.
      </p>
      <a href="#" className="bg-gold hover:bg-[#a0804f] text-white px-9 py-4 font-sans text-[0.75rem] tracking-wider uppercase transition-all">
        Ver Dijes
      </a>
    </div>
  </section>
);



const Footer = () => (
  <footer className="bg-[#0F0D0B] pt-20 pb-10 px-6 md:px-16 text-white/50">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-14 pb-14 border-b border-white/10">
      <div className="space-y-6">
        <a href="#" className="flex flex-col items-start no-underline leading-none">
          <span className="font-serif italic text-2xl text-white tracking-tight">Lúmina</span>
          <span className="font-sans text-[0.45rem] tracking-[0.3em] uppercase text-gold-light mt-0.5">Accesorios</span>
        </a>

      </div>

      <div>
        <h5 className="text-[0.65rem] tracking-widest uppercase text-gold-light font-normal mb-6">Colecciones</h5>
        <ul className="space-y-3 text-[0.82rem]">
          {['Novedades', 'Dijes', 'Pulseras', 'Collares', 'Sets y Regalos'].map(item => (
            <li key={item}><a href="#" className="hover:text-gold-light transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="text-[0.65rem] tracking-widest uppercase text-gold-light font-normal mb-6">Información</h5>
        <ul className="space-y-3 text-[0.82rem]">
          {['Sobre Nosotras', 'Blog', 'Cuidado de Joyas', 'Certificaciones'].map(item => (
            <li key={item}><a href="#" className="hover:text-gold-light transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="text-[0.65rem] tracking-widest uppercase text-gold-light font-normal mb-6">Ayuda</h5>
        <ul className="space-y-3 text-[0.82rem]">
          {['Envíos y Devoluciones', 'Preguntas Frecuentes', 'Contacto'].map(item => (
            <li key={item}><a href="#" className="hover:text-gold-light transition-colors">{item}</a></li>
          ))}
          <li><a href="https://wa.me/56966791895" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors">WhatsApp</a></li>
        </ul>
      </div>
    </div>

    <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-[0.72rem]">
      <p>© 2026 Lúmina Accesorios. Todos los derechos reservados.</p>
      <div className="flex gap-6">
        {['Instagram', 'TikTok', 'Pinterest'].map(social => (
          <a key={social} href="#" className="hover:text-gold-light transition-colors tracking-wider">{social}</a>
        ))}
        <a href="https://wa.me/56966791895" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors tracking-wider">WhatsApp</a>
      </div>
    </div>
  </footer>
);

const WhatsAppButton = () => (
  <a
    href="https://wa.me/56966791895"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
  >
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  </a>
);

const SuccessPage = () => {
  const [hasNotified, setHasNotified] = React.useState(false);

  React.useEffect(() => {
    const notifySale = async () => {
      if (hasNotified) return;
      try {
        const cartData = JSON.parse(localStorage.getItem('last_cart') || '[]');
        const payerData = JSON.parse(localStorage.getItem('last_payer') || '{}');
        const shippingCost = Number(localStorage.getItem('last_shipping') || '0');

        if (cartData.length > 0) {
          await fetch('/api/notify-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartData, payer: payerData, shippingCost })
          });
          setHasNotified(true);
          // Opcional: limpiar localStorage
          // localStorage.removeItem('last_cart');
        }
      } catch (err) {
        console.error('Error matching success notification:', err);
      }
    };
    notifySale();
  }, [hasNotified]);

  return (
    <div className="min-h-screen bg-light dark:bg-dark flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined notranslate text-green-600 !text-4xl">check_circle</span>
      </div>
      <h1 className="font-serif text-4xl text-dark dark:text-white mb-4">¡Gracias por tu compra!</h1>
      <p className="text-mid dark:text-slate-400 max-w-md mb-8">
        Tu pedido ha sido procesado con éxito. Pronto recibirás un correo con los detalles de tu envío por Chilexpress.
      </p>
      <Link to="/" className="bg-gold text-white px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-[#a0804f] transition-all">
        Volver al Inicio
      </Link>
    </div>
  );
};

const FailurePage = () => (
  <div className="min-h-screen bg-light dark:bg-dark flex flex-col items-center justify-center p-6 text-center">
    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
      <span className="material-symbols-outlined notranslate text-red-600 !text-4xl">error</span>
    </div>
    <h1 className="font-serif text-4xl text-dark dark:text-white mb-4">El pago no se pudo procesar</h1>
    <p className="text-mid dark:text-slate-400 max-w-md mb-8">
      Hubo un problema con tu transacción. Por favor, intenta nuevamente o contacta a soporte si el problema persiste.
    </p>
    <Link to="/" className="bg-dark text-white px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-black transition-all">
      Reintentar Compra
    </Link>
  </div>
);

const PendingPage = () => (
  <div className="min-h-screen bg-light dark:bg-dark flex flex-col items-center justify-center p-6 text-center">
    <div className="w-20 h-20 bg-gold-pale dark:bg-gold-pale/10 rounded-full flex items-center justify-center mb-6">
      <span className="material-symbols-outlined notranslate text-gold !text-4xl">hourglass_empty</span>
    </div>
    <h1 className="font-serif text-4xl text-dark dark:text-white mb-4">Pago Pendiente</h1>
    <p className="text-mid dark:text-slate-400 max-w-md mb-8">
      Estamos esperando la confirmación de tu pago. Te avisaremos por correo una vez que todo esté listo.
    </p>
    <Link to="/" className="bg-gold text-white px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-[#a0804f] transition-all">
      Ir al Inicio
    </Link>
  </div>
);

function StoreFront({
  selectedCategory, setSelectedCategory,
  favorites, toggleFavorite,
  searchTerm, setSearchTerm,
  showFavoritesOnly, setShowFavoritesOnly,
  cart, cartCount, addToCart, removeFromCart, updateQuantity,
  isCartOpen, setIsCartOpen
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || favorites.includes(p.id);

    return matchesCategory && matchesSearch && matchesFavorites;
  });

  return (
    <>
      <Header
        favoritesCount={favorites.length}
        onCategorySelect={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onShowFavorites={setShowFavoritesOnly}
        showFavoritesOnly={showFavoritesOnly}
        cartCount={cartCount}
        onShowCart={() => setIsCartOpen(true)}
        onMenuOpen={() => setIsMobileMenuOpen(true)}
      />

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onCategorySelect={setSelectedCategory}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
      <Hero />

      {/* COLLECTION SECTION */}
      <section id="coleccion" className="bg-white dark:bg-[#1a1714] py-24 px-6 md:px-16 border-t border-gold/25 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 pb-10 border-b border-gold/25">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-dark dark:text-white mb-4">Catálogo de Joyas</h2>
            <p className="text-mid dark:text-slate-400 text-[0.92rem] font-light leading-loose">
              Piezas exclusivas diseñadas para resaltar tu elegancia natural. Plata y piedras preciosas que perduran en el tiempo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[0.78rem] text-mid dark:text-slate-400 font-light">{filteredProducts.length} productos encontrados</span>
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-slate-800 border border-gold/25 px-5 py-3 pr-11 font-sans text-[0.78rem] text-dark dark:text-white outline-none cursor-pointer focus:border-gold"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">Todas las Categorías</option>
                <option value="Dijes">Dijes</option>
                <option value="Bracelets">Pulseras</option>
                <option value="Collares">Collares</option>
              </select>
              <span className="material-symbols-outlined notranslate absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold !text-lg">expand_more</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <PromoBanner />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-light dark:bg-dark transition-colors">
        <Routes>
          <Route path="/" element={
            <StoreFront
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showFavoritesOnly={showFavoritesOnly}
              setShowFavoritesOnly={setShowFavoritesOnly}
              cart={cart}
              cartCount={cartCount}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          } />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<FailurePage />} />
          <Route path="/pending" element={<PendingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
