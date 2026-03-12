import React, { useState } from 'react';
import { regions } from '../data/regions';
import { communesByRegion } from '../data/communes';

const CartDrawer = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        telefono: '',
        email: '',
        direccion: '',
        depto: '',
        comuna: '',
        region: 'Región Metropolitana de Santiago',
        notas: ''
    });
    const [errors, setErrors] = useState({});
    const [shippingCost, setShippingCost] = useState(0);
    const [isQuoting, setIsQuoting] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const totalProducts = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = totalProducts + shippingCost;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'region') {
            setFormData(prev => ({
                ...prev,
                region: value,
                comuna: '' // Reset comuna when region changes
            }));
            setShippingCost(0); // Reset shipping cost
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Auto-quote shipping when comuna changes
        if (name === 'comuna' && value) {
            fetchShippingQuote(value);
        }
    };


    const fetchShippingQuote = async (comuna) => {
        setIsQuoting(true);
        try {
            const response = await fetch('/api/shipping/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comuna })
            });
            const data = await response.json();
            if (data.cost) setShippingCost(data.cost);
        } catch (error) {
            console.error('Error fetching shipping quote:', error);
        } finally {
            setIsQuoting(false);
        }
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
        if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
        if (!formData.comuna.trim()) newErrors.comuna = 'La comuna es obligatoria';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (currentStep === 1 && cart.length > 0) {
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (validateStep2()) setCurrentStep(3);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleCheckout = async () => {
        setIsProcessingPayment(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    payer: formData,
                    shippingCost: shippingCost
                })
            });

            const data = await response.json();
            
            if (response.ok && data.init_point) {
                // Guardamos los datos para que la página de éxito pueda enviar el correo
                localStorage.setItem('last_cart', JSON.stringify(cart));
                localStorage.setItem('last_payer', JSON.stringify(formData));
                localStorage.setItem('last_shipping', String(shippingCost));
                
                window.location.href = data.init_point;
            } else {
                alert(data.error || 'Error al generar el pago');
            }
        } catch (error) {
            console.error('Error creating payment preference:', error);
            alert('Error al conectar con el servidor. Inténtalo de nuevo.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleClose = () => {
        setCurrentStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-dark/40 backdrop-blur-sm animate-fade-in"
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white dark:bg-dark h-screen shadow-2xl flex flex-col animate-slide-in">
                {/* Header & Stepper */}
                <div className="p-6 border-b border-gold/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            {currentStep > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="p-1 hover:bg-gold-pale dark:hover:bg-slate-800 rounded-full transition-colors text-inherit"
                                >
                                    <span className="material-symbols-outlined notranslate">arrow_back</span>
                                </button>
                            )}
                            <h2 className="font-serif text-2xl text-dark dark:text-white">
                                {currentStep === 1 ? 'Mi Bolsa' : currentStep === 2 ? 'Datos de Despacho' : 'Confirmación'}
                            </h2>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-gold-pale dark:hover:bg-slate-800 rounded-full transition-colors text-inherit">
                            <span className="material-symbols-outlined notranslate">close</span>
                        </button>
                    </div>

                    {/* Stepper Visual */}
                    <div className="flex items-center justify-between relative px-2">
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gold/20 -z-10 -translate-y-1/2 mx-8" />
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-1.5 bg-white dark:bg-dark z-10 px-2">
                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-sans text-[0.7rem] font-bold transition-all ${currentStep >= s ? 'border-gold bg-gold text-white' : 'border-gold/30 text-gold/30'
                                    }`}>
                                    {currentStep > s ? (
                                        <span className="material-symbols-outlined notranslate !text-sm">check</span>
                                    ) : s}
                                </div>
                                <span className={`text-[0.55rem] uppercase tracking-widest font-medium ${currentStep >= s ? 'text-gold' : 'text-slate-300 dark:text-slate-600'
                                    }`}>
                                    {s === 1 ? 'Bolsa' : s === 2 ? 'Despacho' : 'Pago'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 cart-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                            <span className="material-symbols-outlined notranslate !text-6xl">shopping_cart</span>
                            <p className="font-sans text-sm tracking-widest uppercase">Tu bolsa está vacía</p>
                            <button
                                onClick={handleClose}
                                className="mt-4 border border-gold text-gold px-8 py-3 text-[0.7rem] uppercase tracking-widest hover:bg-gold hover:text-white transition-all"
                            >
                                Volver a la tienda
                            </button>
                        </div>
                    ) : (
                        <>
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fade-in">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 group">
                                            <div className="w-24 h-24 bg-gold-pale dark:bg-slate-900 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-serif text-[1rem] text-dark dark:text-white leading-tight">{item.name}</h4>
                                                    <button
                                                        onClick={() => onRemoveItem(item.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined notranslate !text-sm">delete</span>
                                                    </button>
                                                </div>
                                                <p className="text-[0.8rem] text-gold font-medium mb-3">
                                                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center border border-gold/30 rounded-full overflow-hidden">
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                            className="px-3 py-1 hover:bg-gold-pale dark:hover:bg-slate-800 text-dark dark:text-white transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined notranslate !text-xs">remove</span>
                                                        </button>
                                                        <span className="px-3 text-xs font-sans text-dark dark:text-white">{item.quantity}</span>
                                                        <button
                                                            onClick={() => item.quantity < item.stock && onUpdateQuantity(item.id, item.quantity + 1)}
                                                            disabled={item.quantity >= item.stock}
                                                            className={`px-3 py-1 text-dark dark:text-white transition-colors ${item.quantity >= item.stock ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gold-pale dark:hover:bg-slate-800'}`}
                                                        >
                                                            <span className="material-symbols-outlined notranslate !text-xs">add</span>
                                                        </button>
                                                    </div>
                                                    <span className="text-sm font-medium text-dark dark:text-white">
                                                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                )}
                                {currentStep === 2 && (
                                <div className="space-y-8 animate-fade-in pb-4">
                                    {/* SECCIÓN 1: INFORMACIÓN DE CONTACTO */}
                                    <div className="bg-light/50 dark:bg-slate-900/30 p-5 border border-gold/10 rounded-sm space-y-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined notranslate text-gold !text-lg">alternate_email</span>
                                            <h3 className="text-[0.75rem] uppercase tracking-[0.2em] text-dark dark:text-gold-light font-bold">Información de Contacto</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">Correo Electrónico <span className="text-red-500">*</span></label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`w-full bg-white dark:bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-gold/20'} p-3.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all text-dark dark:text-white rounded-none shadow-sm`}
                                                    placeholder="ej: nombre@correo.com"
                                                />
                                                {errors.email && <p className="text-red-500 text-[0.6rem] mt-1 ml-0.5 flex items-center gap-1">
                                                    <span className="material-symbols-outlined notranslate !text-[10px]">error</span> {errors.email}
                                                </p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">Teléfono de Contacto <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm border-r border-gold/20 pr-2">+56</span>
                                                    <input
                                                        type="tel"
                                                        name="telefono"
                                                        value={formData.telefono}
                                                        onChange={handleInputChange}
                                                        className={`w-full bg-white dark:bg-slate-800 border ${errors.telefono ? 'border-red-500' : 'border-gold/20'} p-3.5 pl-14 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all text-dark dark:text-white rounded-none shadow-sm`}
                                                        placeholder="9 1234 5678"
                                                    />
                                                </div>
                                                {errors.telefono && <p className="text-red-500 text-[0.6rem] mt-1 ml-0.5 flex items-center gap-1">
                                                    <span className="material-symbols-outlined notranslate !text-[10px]">error</span> {errors.telefono}
                                                </p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECCIÓN 2: DIRECCIÓN DE DESPACHO */}
                                    <div className="bg-light/50 dark:bg-slate-900/30 p-5 border border-gold/10 rounded-sm space-y-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined notranslate text-gold !text-lg">local_shipping</span>
                                            <h3 className="text-[0.75rem] uppercase tracking-[0.2em] text-dark dark:text-gold-light font-bold">Dirección de Envío</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">Nombre Completo <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="nombre"
                                                        value={formData.nombre}
                                                        onChange={handleInputChange}
                                                        className={`w-full bg-white dark:bg-slate-800 border ${errors.nombre ? 'border-red-500' : 'border-gold/20'} p-3.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all text-dark dark:text-white rounded-none shadow-sm`}
                                                        placeholder="Como aparece en tu CI"
                                                    />
                                                    {errors.nombre && <p className="text-red-500 text-[0.6rem] mt-1 ml-0.5 flex items-center gap-1">
                                                        <span className="material-symbols-outlined notranslate !text-[10px]">error</span> {errors.nombre}
                                                    </p>}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">RUT <span className="text-gold/60 font-light italic">(Opcional)</span></label>
                                                    <input
                                                        type="text"
                                                        name="rut"
                                                        value={formData.rut}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white dark:bg-slate-800 border border-gold/20 p-3.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all text-dark dark:text-white rounded-none shadow-sm"
                                                        placeholder="12.345.678-9"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">Región <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            name="region"
                                                            value={formData.region}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-white dark:bg-slate-800 border border-gold/20 p-3.5 pr-10 text-sm focus:outline-none focus:border-gold transition-colors text-dark dark:text-white appearance-none rounded-none"
                                                        >
                                                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                                        </select>
                                                        <span className="material-symbols-outlined notranslate absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold/60 !text-lg">expand_more</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">Comuna <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            name="comuna"
                                                            value={formData.comuna}
                                                            onChange={handleInputChange}
                                                            className={`w-full bg-white dark:bg-slate-800 border ${errors.comuna ? 'border-red-500' : 'border-gold/20'} p-3.5 pr-10 text-sm focus:outline-none focus:border-gold transition-colors text-dark dark:text-white appearance-none rounded-none`}
                                                        >
                                                            <option value="">Seleccionar...</option>
                                                            {communesByRegion[formData.region]?.map(c => (
                                                                <option key={c} value={c}>{c}</option>
                                                            ))}
                                                        </select>
                                                        <span className="material-symbols-outlined notranslate absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold/60 !text-lg">expand_more</span>
                                                    </div>
                                                    {errors.comuna && <p className="text-red-500 text-[0.6rem] mt-1 ml-0.5 flex items-center gap-1">
                                                        <span className="material-symbols-outlined notranslate !text-[10px]">error</span> {errors.comuna}
                                                    </p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="md:col-span-2 space-y-1.5">
                                                    <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">Calle y Número <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="direccion"
                                                        value={formData.direccion}
                                                        onChange={handleInputChange}
                                                        className={`w-full bg-white dark:bg-slate-800 border ${errors.direccion ? 'border-red-500' : 'border-gold/20'} p-3.5 text-sm focus:outline-none focus:border-gold transition-all text-dark dark:text-white rounded-none shadow-sm`}
                                                        placeholder="Av. Providencia 1234"
                                                    />
                                                    {errors.direccion && <p className="text-red-500 text-[0.6rem] mt-1 ml-0.5 flex items-center gap-1">
                                                        <span className="material-symbols-outlined notranslate !text-[10px]">error</span> {errors.direccion}
                                                    </p>}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">Depto / Casa</label>
                                                    <input
                                                        type="text"
                                                        name="depto"
                                                        value={formData.depto}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white dark:bg-slate-800 border border-gold/20 p-3.5 text-sm focus:outline-none focus:border-gold transition-all text-dark dark:text-white rounded-none shadow-sm"
                                                        placeholder="Ej: 402B"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[0.65rem] uppercase tracking-wider text-mid dark:text-slate-400 ml-0.5">Notas adicionales</label>
                                                <textarea
                                                    name="notas"
                                                    value={formData.notas}
                                                    onChange={handleInputChange}
                                                    rows="2"
                                                    className="w-full bg-white dark:bg-slate-800 border border-gold/20 p-3.5 text-sm focus:outline-none focus:border-gold transition-all text-dark dark:text-white resize-none rounded-none shadow-sm"
                                                    placeholder="Ej: Portón café, llamar antes de llegar..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="bg-gold-pale/30 dark:bg-slate-900/40 p-5 border border-gold/10">
                                        <h5 className="text-[0.65rem] uppercase tracking-widest text-gold mb-3 font-bold">Datos de Despacho</h5>
                                        <div className="space-y-2 text-sm text-dark dark:text-white/80 font-light leading-relaxed">
                                            <p className="flex justify-between font-normal"><span>Destinatario:</span> <span className="font-medium text-dark dark:text-white">{formData.nombre}</span></p>
                                            <p className="flex justify-between"><span>Teléfono:</span> <span>+56 {formData.telefono}</span></p>
                                            <p className="flex justify-between"><span>Comuna:</span> <span>{formData.comuna}</span></p>
                                            <p className="flex justify-between"><span>Dirección:</span> <span className="text-right">{formData.direccion}{formData.depto ? `, Depto/Casa ${formData.depto}` : ''}</span></p>
                                            {formData.notas && <p className="text-[0.7rem] italic border-t border-gold/5 pt-2 mt-2 leading-relaxed">"{formData.notas}"</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h5 className="text-[0.65rem] uppercase tracking-widest text-gold font-bold">Resumen del Pedido</h5>
                                        <div className="space-y-3">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex justify-between text-xs text-mid dark:text-slate-400">
                                                    <span>{item.quantity}x {item.name}</span>
                                                    <span className="text-dark dark:text-white font-medium">
                                                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 bg-gold-pale/30 dark:bg-slate-900/50 border-t border-gold/20 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs text-mid dark:text-slate-400 uppercase tracking-widest">
                                <span>Subtotal:</span>
                                <span>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalProducts)}</span>
                            </div>

                            {/* Only show shipping if it's already Quoted or we are beyond step 1 */}
                            {currentStep > 1 && (
                                <div className="flex justify-between items-center text-xs text-mid dark:text-slate-400 uppercase tracking-widest">
                                    <span>Envío (Chilexpress):</span>
                                    <span>
                                        {isQuoting ? (
                                            <span className="animate-pulse text-gold">Calculando...</span>
                                        ) : shippingCost > 0 ? (
                                            new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(shippingCost)
                                        ) : (
                                            <span className="italic text-slate-300">Pendiente</span>
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t border-gold/10">
                                <span className="text-[0.7rem] uppercase tracking-widest text-dark dark:text-gold-light font-bold">Total Final</span>
                                <span className="text-2xl font-serif text-dark dark:text-gold-light">
                                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}
                                </span>
                            </div>
                        </div>

                        {currentStep === 3 ? (
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessingPayment}
                                className={`w-full ${isProcessingPayment ? 'opacity-70 cursor-wait' : ''} bg-dark dark:bg-gold text-gold-light dark:text-white py-4 font-sans text-[0.75rem] tracking-widest uppercase hover:bg-gold dark:hover:bg-white dark:hover:text-dark transition-all flex items-center justify-center gap-2`}
                            >
                                {isProcessingPayment ? 'PROCESANDO...' : 'PAGAR DE FORMA SEGURA'}
                                {!isProcessingPayment && <span className="material-symbols-outlined notranslate !text-sm">security</span>}
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                disabled={isQuoting}
                                className="w-full bg-dark dark:bg-gold text-gold-light dark:text-white py-4 font-sans text-[0.75rem] tracking-widest uppercase hover:bg-gold dark:hover:bg-white dark:hover:text-dark transition-all flex items-center justify-center gap-2 group"
                            >
                                Siguiente
                                <span className="material-symbols-outlined notranslate !text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export default CartDrawer;
