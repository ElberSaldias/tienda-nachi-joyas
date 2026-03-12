require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const nodemailer = require('nodemailer');
const path = require('path');

const normalizeText = (text) => {
    if (!text) return "";
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .toUpperCase()
        .trim();
};

// Sanitize FRONTEND_URL to avoid double slashes
const rawUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const FRONTEND_URL = rawUrl.replace(/\/$/, '');
console.log('Sanitized FRONTEND_URL:', FRONTEND_URL);

const app = express();
app.use(cors());
app.use(express.json());

// Mercado Pago Configuration
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

// Nodemailer Transporter Configuration
// Note: Transporter is created here, after dotenv.config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Gmail App Password
    }
});

const sendSaleEmail = async (orderData) => {
    const { items, payer, shippingCost, total, external_reference } = orderData;

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.unit_price || item.price).toLocaleString('es-CL')}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: `"Lúmina Accesorios" <${process.env.EMAIL_USER}>`,
        to: 'esaldiashiring@gmail.com',
        subject: `✨ ¡Nueva Venta Confirmada! - ${external_reference}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #d4af37; padding: 20px;">
                <h2 style="color: #1a1714; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Resumen de Venta</h2>
                <p><strong>Cliente:</strong> ${payer.nombre}</p>
                <p><strong>RUT:</strong> ${payer.rut || 'N/A'}</p>
                <p><strong>Teléfono:</strong> ${payer.telefono}</p>
                <p><strong>Email:</strong> ${payer.email}</p>
                
                <h3 style="color: #d4af37; margin-top: 25px;">Detalle de Productos:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    ${itemsHtml}
                </table>
                
                <div style="margin-top: 20px; text-align: right; background: #fdfaf5; padding: 15px;">
                    <p style="margin: 5px 0;"><strong>Envió:</strong> $${shippingCost.toLocaleString('es-CL')}</p>
                    <p style="margin: 5px 0; font-size: 1.2rem;"><strong>Total Pagado:</strong> <span style="color: #d4af37;">$${total.toLocaleString('es-CL')}</span></p>
                </div>
                
                <h3 style="color: #d4af37; margin-top: 25px;">Datos de Despacho:</h3>
                <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37;">
                    ${payer.direccion}, ${payer.comuna}, ${payer.region}<br>
                    <small style="color: #666;">${payer.notas ? `Notas: ${payer.notas}` : ''}</small>
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Sale notification email sent successfully.');
        return true;
    } catch (error) {
        console.error('Error sending sale email:', error);
        return false;
    }
};

// Chilexpress Integration
const RM_COMMUNES = [
    "SANTIAGO", "CERRILLOS", "CERRO NAVIA", "CONCHALÍ", "EL BOSQUE", "ESTACIÓN CENTRAL",
    "HUECHURABA", "INDEPENDENCIA", "LA CISTERNA", "LA FLORIDA", "LA GRANJA", "LA PINTANA",
    "LA REINA", "LAS CONDES", "LO BARNECHEA", "LO ESPEJO", "LO PRADO", "MACUL", "MAIPÚ",
    "ÑUÑOA", "PEDRO AGUIRRE CERDA", "PEÑALOLÉN", "PROVIDENCIA", "PUDAHUEL", "QUILICURA",
    "QUINTA NORMAL", "RECOLETA", "RENCA", "SAN JOAQUÍN", "SAN MIGUEL", "SAN RAMÓN",
    "VITACURA", "PUENTE ALTO", "PIRQUE", "SAN JOSÉ DE MAIPO", "SAN BERNARDO",
    "CALERA DE TANGO", "BUIN", "PAINE", "MELIPILLA", "ALHUÉ", "CURACAVÍ", "MARÍA PINTO",
    "SAN PEDRO", "TALAGANTE", "EL MONTE", "ISLA DE MAIPO", "PADRE HURTADO", "PEÑAFLOR",
    "COLINA", "LAMPA", "TILTIL"
];

app.post('/api/shipping/quote', async (req, res) => {
    const { comuna } = req.body;
    if (!comuna) return res.status(400).json({ error: 'Comuna es requerida' });

    try {
        const originCode = "LA FLORIDA";
        const destCode = normalizeText(comuna);

        const response = await axios.post('https://api.chilexpress.cl/shipping/v1/quotes', {
            originCountyCode: originCode,
            destinationCountyCode: destCode,
            package: { weight: "0.2", height: "5", width: "10", length: "15" },
            productType: 3
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.CHILEXPRESS_API_KEY
            }
        });

        if (response.data?.data?.servicios?.length > 0) {
            const service = response.data.data.servicios[0];
            return res.json({
                cost: service.valor,
                service: service.nombreServicio || 'Chilexpress Estándar',
                deliveryTime: '2-3 días hábiles'
            });
        }
        throw new Error('No services');
    } catch (error) {
        const cleanComuna = normalizeText(comuna);
        const isRM = RM_COMMUNES.includes(cleanComuna);
        const isLocal = cleanComuna === "LA FLORIDA";
        let quote = isLocal ? 2990 : (isRM ? 3990 : 6990);
        res.json({
            cost: quote,
            service: isLocal ? 'Chilexpress Local' : (isRM ? 'Chilexpress RM' : 'Chilexpress Regiones'),
            deliveryTime: '2-3 días hábiles',
            isMock: true
        });
    }
});

app.post('/api/checkout', async (req, res) => {
    const { items, payer, shippingCost } = req.body;
    try {
        // --- LOGICA DE STOCK ---
        // En un proyecto real, esto consultaría una DB. 
        // Aquí simulamos validando contra el estado 'stock' enviado o una lógica interna.
        for (const item of items) {
            // Si el stock viene en el objeto (enviado por el frontend)
            // Validamos que la cantidad pedida no supere el stock disponible.
            if (item.stock !== undefined && item.quantity > item.stock) {
                return res.status(400).json({
                    error: `Stock insuficiente para ${item.name}. Disponible: ${item.stock}`
                });
            }
        }

        const preference = new Preference(client);
        const externalReference = `ORDER-${Date.now()}`;

        const preferenceData = {
            body: {
                items: items.map(p => ({
                    id: String(p.id),
                    title: p.name,
                    quantity: p.quantity,
                    unit_price: Number(p.price),
                    currency_id: 'CLP',
                    picture_url: `${FRONTEND_URL}${p.image}`
                })),
                backUrls: {
                    success: `${FRONTEND_URL}/success`,
                    failure: `${FRONTEND_URL}/failure`,
                    pending: `${FRONTEND_URL}/pending`,
                },
                autoReturn: "approved",
                payer: {
                    name: payer.nombre,
                    email: payer.email,
                    phone: { area_code: "", number: payer.telefono },
                    identification: { type: "RUT", number: payer.rut || "1" },
                    address: { street_name: payer.direccion, zip_code: payer.comuna }
                },
                external_reference: externalReference,
                statement_descriptor: "NACHI JOYAS",
                shipments: {
                    cost: Number(shippingCost),
                    mode: "not_specified"
                }
            }
        };

        console.log('Sending Preference to MP:', JSON.stringify(preferenceData, null, 2));
        const response = await preference.create(preferenceData);
        console.log('MP Response:', response.id);

        res.json({ id: response.id, init_point: response.init_point, external_reference: externalReference });

    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).json({ error: 'Error al procesar el pago. Por favor intenta de nuevo.' });
    }
});

app.post('/api/notify-success', async (req, res) => {
    try {
        const { items, payer, shippingCost } = req.body;
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingCost;
        const success = await sendSaleEmail({ items, payer, shippingCost, total, external_reference: `SUCCESS-${Date.now()}` });
        res.json({ success });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/test-email', async (req, res) => {
    console.log('--- [DEBUG EMAIL CONFIG] ---');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    console.log('EMAIL_PASS starts with:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 3) + '...' : 'NONE');
    console.log('-----------------------------');

    try {
        const success = await sendSaleEmail({
            items: [{ name: "Producto de Prueba", quantity: 1, price: 1000 }],
            payer: {
                nombre: "Usuario de Prueba",
                email: "test@example.com",
                telefono: "12345678",
                direccion: "Calle Falsa 123",
                comuna: "La Florida",
                region: "Metropolitana"
            },
            shippingCost: 3500,
            total: 4500,
            external_reference: "TEST-MAIL"
        });
        res.json({ message: success ? 'Test email sent!' : 'Failed to send test email', debug: { user: process.env.EMAIL_USER } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, () => {
        console.log('--- SERVER INITIALIZED ---');
        console.log(`Server running on port ${PORT}`);
        console.log('Event loop should be active...');
    });

    server.on('error', (error) => {
        console.error('!!! SERVER ERROR EVENT:', error);
    });
}

module.exports = app;

// Diagnostic listeners to catch early exits
process.on('uncaughtException', (err) => {
    console.error('!!! UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!! UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

process.on('exit', (code) => {
    console.log(`--- PROCESS EXITING WITH CODE: ${code} ---`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, closing server...');
    server.close(() => process.exit(0));
});
