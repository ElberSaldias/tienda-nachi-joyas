import React, { useState, useEffect } from 'react';
import { products } from './data/products';
import CartDrawer from './components/CartDrawer';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';

// ─── HEADER ──────────────────────────────────────────────────────────────────
const Header = ({
  favoritesCount, onCategorySelect, searchTerm, onSearchChange,
  onShowFavorites, showFavoritesOnly, cartCount, onShowCart, onMenuOpen,
  showSearch = true
}) => {
  const navItems = [
    { name: 'Novedades', id: 'All' },
    { name: 'Dijes', id: 'Dijes' },
    { name: 'Pulseras', id: 'Bracelets' },
    { name: 'Collares', id: 'Collares' },
    { name: 'Sobre Nosotras', id: 'sobre' },
  ];

  const handleNavClick = (item) => {
    if (item.id === 'sobre') {
      document.getElementById('sobre-nosotras')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onCategorySelect(item.id);
    onShowFavorites(false);
    setTimeout(() => {
      document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <header className="sticky top-0 z-[100] bg-white/95 dark:bg-dark/95 backdrop-blur-md border-b border-gold/25 px-6 md:px-12 flex items-center justify-between h-[72px] transition-colors">
      <Link
        to="/"
        onClick={() => onCategorySelect('All')}
        className="flex flex-col items-start no-underline leading-none group"
      >
        <span className="font-serif italic text-3xl text-dark dark:text-white tracking-tight">Lúmina</span>
        <span className="font-sans text-[0.55rem] tracking-[0.3em] uppercase text-gold mt-0.5">Accesorios</span>
      </Link>

      <nav className="hidden lg:flex gap-9">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavClick(item)}
            className="nav-link notranslate text-[0.78rem] tracking-wider uppercase text-mid dark:text-slate-300 hover:text-dark dark:hover:text-white font-normal bg-transparent border-none cursor-pointer"
          >
            {item.name}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-5">
        {showSearch && (
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
        )}
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
};

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const MobileMenu = ({ isOpen, onClose, onCategorySelect }) => {
  const navItems = [
    { name: 'Novedades', id: 'All' },
    { name: 'Dijes', id: 'Dijes' },
    { name: 'Pulseras', id: 'Bracelets' },
    { name: 'Collares', id: 'Collares' },
    { name: 'Sobre Nosotras', id: 'sobre' },
  ];

  const handleClick = (item) => {
    if (item.id === 'sobre') {
      onClose();
      setTimeout(() => {
        document.getElementById('sobre-nosotras')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return;
    }
    onCategorySelect(item.id);
    onClose();
    setTimeout(() => {
      document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div
        className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        onClick={onClose}
      />
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
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleClick(item)}
                className="font-sans notranslate text-xs tracking-[0.2em] uppercase text-mid dark:text-slate-300 hover:text-gold transition-colors pb-4 border-b border-gold/5 text-left bg-transparent border-none cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-10 border-t border-gold/10">
            <p className="text-[0.65rem] tracking-widest uppercase text-gold mb-6">Síguenos</p>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-mid dark:text-slate-400 hover:text-gold transition-colors text-[0.78rem] tracking-wider">Instagram</a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-mid dark:text-slate-400 hover:text-gold transition-colors text-[0.78rem] tracking-wider">TikTok</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── HERO ────────────────────────────────────────────────────────────────────
const Hero = ({ onCategorySelect }) => (
  <section className="relative h-[92vh] min-h-[600px] overflow-hidden flex items-center">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/45 to-transparent z-10" />
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
        <a
          href="#coleccion"
          className="bg-gold hover:bg-[#a0804f] text-white px-9 py-4 font-sans text-[0.75rem] tracking-wider uppercase transition-all hover:-translate-y-0.5"
        >
          Ver Colección
        </a>
        <button
          onClick={() => {
            document.getElementById('sobre-nosotras')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-transparent text-white border border-white/50 hover:border-gold hover:bg-gold/10 px-9 py-4 font-sans text-[0.75rem] tracking-wider uppercase transition-all cursor-pointer"
        >
          Saber Más
        </button>
      </div>
    </div>
  </section>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, isFavorite, onToggleFavorite, onAddToCart, isStockReached }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/producto/${product.id}`)}
      className="bg-white dark:bg-[#1f1a14] border border-gold/15 group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(26,23,20,0.15)] hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="aspect-square overflow-hidden bg-gold-pale dark:bg-slate-900 relative">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock === 0 ? 'grayscale opacity-70' : ''}`}
        />
        {product.stock === 0 ? (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[0.55rem] tracking-widest uppercase px-2 py-0.5 z-20 font-bold shadow-sm">
            AGOTADO
          </span>
        ) : product.tag && (
          <span className="absolute top-2.5 left-2.5 bg-dark dark:bg-gold text-gold-light dark:text-white text-[0.55rem] tracking-widest uppercase px-2 py-0.5">
            {product.tag}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
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
        <p className="text-[0.55rem] tracking-[0.15em] uppercase text-gold mb-1">{product.category === 'Bracelets' ? 'Pulseras' : product.category}</p>
        <h3 className="font-serif text-[0.95rem] font-normal text-dark dark:text-white mb-2 leading-tight h-10 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-sm font-medium text-dark dark:text-gold-light">
            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock > 0 && !isStockReached) onAddToCart(product);
            }}
            disabled={product.stock === 0 || isStockReached}
            className={`px-3 py-1.5 font-sans text-[0.6rem] tracking-wider uppercase transition-colors ${product.stock === 0 || isStockReached
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-dark dark:bg-gold text-white hover:bg-gold dark:hover:bg-white dark:hover:text-dark transition-all'
              }`}
          >
            {product.stock === 0 ? 'AGOTADO' : isStockReached ? 'Máximo en bolsa' : '+ Añadir'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PROMO BANNER ─────────────────────────────────────────────────────────────
const PromoBanner = ({ onCategorySelect }) => (
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
      <h2 className="font-serif notranslate text-5xl font-light text-white leading-tight mb-5">
        Dijes que <em className="italic text-gold-light">te</em><br />identifican
      </h2>
      <p className="text-white/70 text-[0.92rem] font-light leading-loose mb-9">
        Cada dije cuenta una historia única. Personaliza tu pulsera con los momentos que más importan.
      </p>
      <button
        onClick={() => {
          onCategorySelect('Dijes');
          setTimeout(() => {
            document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        className="bg-gold notranslate hover:bg-[#a0804f] text-white px-9 py-4 font-sans text-[0.75rem] tracking-wider uppercase transition-all cursor-pointer border-none"
      >
        Ver Dijes
      </button>
    </div>
  </section>
);

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const Footer = ({ onCategorySelect }) => {
  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
      setTimeout(() => {
        document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const collectionLinks = [
    { name: 'Novedades', id: 'All' },
    { name: 'Dijes', id: 'Dijes' },
    { name: 'Pulseras', id: 'Bracelets' },
    { name: 'Collares', id: 'Collares' },
    { name: 'Sets y Regalos', id: 'All' },
  ];

  return (
    <footer id="sobre-nosotras" className="bg-[#0F0D0B] pt-20 pb-10 px-6 md:px-16 text-white/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-14 pb-14 border-b border-white/10">
        <div className="space-y-6">
          <Link to="/" className="flex flex-col items-start no-underline leading-none">
            <span className="font-serif italic text-2xl text-white tracking-tight">Lúmina</span>
            <span className="font-sans text-[0.45rem] tracking-[0.3em] uppercase text-gold-light mt-0.5">Accesorios</span>
          </Link>
          <p className="text-[0.8rem] font-light leading-relaxed text-white/40 max-w-[220px]">
            Joyería artesanal diseñada para capturar tus momentos más especiales.
          </p>
        </div>

        <div>
          <h5 className="text-[0.65rem] tracking-widest uppercase text-gold-light font-normal mb-6">Colecciones</h5>
          <ul className="space-y-3 text-[0.82rem]">
            {collectionLinks.map(item => (
              <li key={item.name}>
                <Link
                  to="/"
                  onClick={() => handleCategoryClick(item.id)}
                  className="hover:text-gold-light transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-[0.65rem] tracking-widest uppercase text-gold-light font-normal mb-6">Información</h5>
          <ul className="space-y-3 text-[0.82rem]">
            <li>
              <button
                onClick={() => document.getElementById('sobre-nosotras')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-gold-light transition-colors bg-transparent border-none cursor-pointer text-inherit text-[0.82rem]"
              >
                Sobre Nosotras
              </button>
            </li>
            <li>
              <a href="https://wa.me/56966791895" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors">
                Blog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-[0.65rem] tracking-widest uppercase text-gold-light font-normal mb-6">Ayuda</h5>
          <ul className="space-y-3 text-[0.82rem]">
            <li>
              <a href="https://wa.me/56966791895" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors">
                Contacto vía WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-[0.72rem]">
        <p>© 2026 Lúmina Accesorios. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          {['Instagram', 'TikTok', 'Pinterest'].map(social => (
            <a key={social} href={`https://www.${social.toLowerCase()}.com/`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors tracking-wider">{social}</a>
          ))}
          <a href="https://wa.me/56966791895" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors tracking-wider">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
};

// ─── WHATSAPP BUTTON ──────────────────────────────────────────────────────────
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

// ─── SUCCESS PAGE ─────────────────────────────────────────────────────────────
const SuccessPage = () => {
  const [hasNotified, setHasNotified] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('mercadopago');

  React.useEffect(() => {
    const notifySale = async () => {
      if (hasNotified) return;
      try {
        const cartData = JSON.parse(localStorage.getItem('last_cart') || '[]');
        const payerData = JSON.parse(localStorage.getItem('last_payer') || '{}');
        const shippingCost = Number(localStorage.getItem('last_shipping') || '0');
        const method = localStorage.getItem('last_payment_method') || 'mercadopago';

        setPaymentMethod(method);

        if (cartData.length > 0) {
          await fetch('/api/notify-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cartData,
              payer: payerData,
              shippingCost,
              paymentMethod: method
            })
          });
          setHasNotified(true);
        }
      } catch (err) {
        console.error('Error matching success notification:', err);
      }
    };
    notifySale();
  }, [hasNotified]);

  const isTransfer = paymentMethod === 'transfer';

  return (
    <div className="min-h-screen bg-light dark:bg-dark flex flex-col items-center justify-center p-6 text-center">
      <div className={`w-20 h-20 ${isTransfer ? 'bg-gold/10' : 'bg-green-100 dark:bg-green-900/30'} rounded-full flex items-center justify-center mb-8 animate-fade-in`}>
        <span className={`material-symbols-outlined notranslate ${isTransfer ? 'text-gold' : 'text-green-600'} !text-5xl`}>
          {isTransfer ? 'pending_actions' : 'check_circle'}
        </span>
      </div>

      <h1 className="font-serif text-4xl md:text-5xl text-dark dark:text-white mb-6 animate-slide-in">
        {isTransfer ? '¡Pedido Registrado!' : '¡Gracias por tu compra!'}
      </h1>

      <div className="max-w-xl bg-white dark:bg-[#1a1714] border border-gold/20 p-8 md:p-10 shadow-xl rounded-sm mb-10 animate-fade-in">
        {isTransfer ? (
          <p className="text-mid dark:text-slate-300 text-lg leading-relaxed font-light italic">
            "¡Gracias por tu compra! Tu pedido ha sido registrado. <br /><br />
            Quedamos a la espera de la recepción del comprobante de transferencia a nuestro correo.
            Una vez validado, confirmaremos tu compra y coordinaremos la entrega de acuerdo a la opción de despacho o retiro que seleccionaste."
          </p>
        ) : (
          <p className="text-mid dark:text-slate-300 text-lg leading-relaxed font-light">
            Tu pedido ha sido procesado con éxito. Pronto recibirás un correo con los detalles de tu envío y la confirmación de tu pago.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
        <Link to="/" className="bg-dark dark:bg-gold text-white px-10 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-gold dark:hover:bg-white dark:hover:text-dark transition-all shadow-lg hover:-translate-y-0.5">
          Volver al Inicio
        </Link>
        {isTransfer && (
          <a href="https://wa.me/56966791895" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-10 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#1da851] transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
            Enviar Comprobante
            <span className="material-symbols-outlined notranslate !text-sm">send</span>
          </a>
        )}
      </div>
    </div>
  );
};

// ─── FAILURE PAGE ─────────────────────────────────────────────────────────────
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

// ─── PENDING PAGE ─────────────────────────────────────────────────────────────
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

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
const ProductDetailPage = ({
  cart, cartCount, addToCart, removeFromCart, updateQuantity,
  favorites, toggleFavorite, isCartOpen, setIsCartOpen
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const product = products.find(p => p.id === Number(id));

  const handleCategorySelect = (categoryId) => {
    navigate('/', { state: { category: categoryId } });
  };

  // Scroll to top when product page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined notranslate text-gold !text-6xl mb-6">search_off</span>
        <h1 className="font-serif text-4xl text-dark dark:text-white mb-4">Producto no encontrado</h1>
        <p className="text-mid dark:text-slate-400 mb-8">El producto que buscas no existe o fue eliminado.</p>
        <Link to="/" className="bg-dark text-white px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-gold transition-all">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const cartItem = cart.find(item => item.id === product.id);
  const isStockReached = cartItem ? cartItem.quantity >= product.stock : false;

  return (
    <>
      <Header
        favoritesCount={favorites.length}
        onCategorySelect={handleCategorySelect}
        searchTerm=""
        onSearchChange={() => {}}
        onShowFavorites={() => {}}
        showFavoritesOnly={false}
        cartCount={cartCount}
        onShowCart={() => setIsCartOpen(true)}
        onMenuOpen={() => setIsMobileMenuOpen(true)}
        showSearch={false}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onCategorySelect={handleCategorySelect}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      <main className="min-h-screen bg-light dark:bg-dark transition-colors">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-[#1a1714] border-b border-gold/10 px-6 md:px-16 py-4">
          <nav className="flex items-center gap-2 text-[0.72rem] font-sans tracking-wider uppercase text-mid dark:text-slate-400 max-w-6xl mx-auto">
            <Link to="/" className="hover:text-gold transition-colors">Inicio</Link>
            <span className="text-gold/40 mx-1">›</span>
            <button
              onClick={() => navigate('/', { state: { category: product.category } })}
              className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer text-inherit text-[0.72rem] tracking-wider uppercase"
            >
              {product.category === 'Bracelets' ? 'Pulseras' : product.category}
            </button>
            <span className="text-gold/40 mx-1">›</span>
            <span className="text-dark dark:text-white truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Product Content */}
        <div className="max-w-6xl mx-auto px-6 md:px-16 py-14 md:py-20 grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left: Image */}
          <div className="relative aspect-square bg-gold-pale dark:bg-slate-900 overflow-hidden group">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.stock === 0 ? 'grayscale opacity-60' : ''}`}
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-dark/30 flex items-center justify-center">
                <span className="bg-dark text-white px-6 py-2 font-sans text-xs tracking-widest uppercase shadow-lg">AGOTADO</span>
              </div>
            )}
            {product.tag && product.stock > 0 && (
              <span className="absolute top-4 left-4 bg-dark dark:bg-gold text-gold-light dark:text-white text-[0.55rem] tracking-widest uppercase px-3 py-1 shadow-sm">
                {product.tag}
              </span>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            {/* Collection label */}
            <span className="text-[0.65rem] tracking-widest uppercase text-gold mb-3">{product.collection}</span>

            {/* Name */}
            <h1 className="font-serif text-4xl md:text-5xl font-light text-dark dark:text-white mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl md:text-3xl font-light text-dark dark:text-gold-light mb-8">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price)}
            </p>

            {/* Divider + Description */}
            <div className="border-t border-gold/15 pt-8 mb-8">
              <p className="text-mid dark:text-slate-400 text-[0.9rem] font-light leading-loose">
                {product.description || 'Pieza artesanal de alta calidad en plata 925. Hipoalergénica, libre de níquel.'}
              </p>
            </div>

            {/* Material badge */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gold/10">
              <span className="material-symbols-outlined notranslate text-gold !text-base">verified</span>
              <span className="text-[0.75rem] tracking-wider text-mid dark:text-slate-400">Plata 925 · Hipoalergénica · Libre de níquel</span>
            </div>

            {/* Stock + Add to cart */}
            {product.stock > 0 ? (
              <>
                <p className="text-[0.72rem] tracking-widest uppercase text-green-600 dark:text-green-400 mb-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined notranslate !text-sm">check_circle</span>
                  En stock
                </p>
                <button
                  onClick={() => { addToCart(product); setIsCartOpen(true); }}
                  disabled={isStockReached}
                  className={`w-full py-5 font-sans text-[0.75rem] tracking-[0.2em] uppercase transition-all mb-4 ${isStockReached
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-dark dark:bg-gold text-white hover:bg-gold dark:hover:bg-white dark:hover:text-dark hover:-translate-y-0.5 shadow-lg'
                    }`}
                >
                  {isStockReached ? 'Máximo en bolsa' : '+ Agregar al Carrito'}
                </button>
              </>
            ) : (
              <p className="text-[0.72rem] tracking-widest uppercase text-red-500 mb-6 flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate !text-sm">cancel</span>
                Agotado — Pronto disponible
              </p>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/56966791895?text=Hola! Me interesa el producto: ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 font-sans text-[0.72rem] tracking-[0.15em] uppercase transition-all mb-6 border border-gold/30 text-mid dark:text-slate-300 hover:border-gold hover:text-gold dark:hover:text-gold flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Consultar por WhatsApp
            </a>

            {/* Back link */}
            <button
              onClick={() => navigate(-1)}
              className="text-[0.72rem] tracking-widest uppercase text-mid dark:text-slate-400 hover:text-gold transition-colors flex items-center gap-2 bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined notranslate !text-sm">arrow_back</span>
              Volver al Catálogo
            </button>
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts
          currentProduct={product}
          cart={cart}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
        />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

// ─── RELATED PRODUCTS ────────────────────────────────────────────────────────
const RelatedProducts = ({ currentProduct, cart, favorites, onToggleFavorite, onAddToCart }) => {
  const related = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id && p.stock > 0)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="bg-white dark:bg-[#1a1714] py-16 px-6 md:px-16 border-t border-gold/15">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl font-light text-dark dark:text-white mb-2">También te puede gustar</h2>
        <p className="text-mid dark:text-slate-400 text-[0.85rem] mb-10">Más piezas de {currentProduct.category === 'Bracelets' ? 'Pulseras' : currentProduct.category}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {related.map(product => {
            const cartItem = cart.find(item => item.id === product.id);
            const isStockReached = cartItem ? cartItem.quantity >= product.stock : false;
            return (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
                onAddToCart={onAddToCart}
                isStockReached={isStockReached}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── STORE FRONT ─────────────────────────────────────────────────────────────
function StoreFront({
  selectedCategory, setSelectedCategory,
  favorites, toggleFavorite,
  searchTerm, setSearchTerm,
  showFavoritesOnly, setShowFavoritesOnly,
  cart, cartCount, addToCart, removeFromCart, updateQuantity,
  isCartOpen, setIsCartOpen
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Read category from navigation state (coming from ProductDetail)
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      window.history.replaceState({}, '', '/');
      setTimeout(() => {
        document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, []);

  const filteredProducts = products.filter(p => {
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else if (selectedCategory === 'Available') {
      matchesCategory = p.stock > 0;
    } else {
      matchesCategory = p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }

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
        showSearch={true}
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

      <Hero onCategorySelect={setSelectedCategory} />

      {/* COLLECTION SECTION */}
      <section id="coleccion" className="bg-white dark:bg-[#1a1714] py-24 px-6 md:px-16 border-t border-gold/25 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 pb-10 border-b border-gold/25">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-dark dark:text-white mb-4">Catálogo de Joyas</h2>
            <p className="text-mid dark:text-slate-400 text-[0.92rem] font-light leading-loose">
              Piezas exclusivas diseñadas para resaltar tu elegancia natural.
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
                <option value="Available">Solo Disponibles</option>
                <option value="Dijes">Dijes</option>
                <option value="Bracelets">Pulseras</option>
                <option value="Collares">Collares</option>
              </select>
              <span className="material-symbols-outlined notranslate absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold !text-lg">expand_more</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {filteredProducts.map(product => {
            const cartItem = cart.find(item => item.id === product.id);
            const isStockReached = cartItem ? cartItem.quantity >= product.stock : false;

            return (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
                isStockReached={isStockReached}
              />
            );
          })}
        </div>
      </section>

      <PromoBanner onCategorySelect={setSelectedCategory} />
      <Footer onCategorySelect={setSelectedCategory} />
      <WhatsAppButton />
    </>
  );
}

// ─── APP (ROOT) ───────────────────────────────────────────────────────────────
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

    const existingInCart = cart.find(item => item.id === product.id);
    if (existingInCart && existingInCart.quantity >= product.stock) {
      console.warn(`Stock limit reached for ${product.name}`);
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) return prev;
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
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const finalQuantity = Math.min(newQuantity, item.stock);
        return { ...item, quantity: finalQuantity };
      }
      return item;
    }));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const sharedProps = {
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    favorites,
    toggleFavorite,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-light dark:bg-dark transition-colors">
        <Routes>
          <Route path="/" element={
            <StoreFront
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showFavoritesOnly={showFavoritesOnly}
              setShowFavoritesOnly={setShowFavoritesOnly}
              {...sharedProps}
            />
          } />
          <Route path="/producto/:id" element={<ProductDetailPage {...sharedProps} />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<FailurePage />} />
          <Route path="/pending" element={<PendingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
