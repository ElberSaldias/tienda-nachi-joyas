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
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0; font-weight: 600; color: #1a1714; font-size: 14px;">${item.name}</p>
                <p style="margin: 4px 0 0; color: #888; font-size: 12px;">Cantidad: ${item.quantity}</p>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: right; vertical-align: top;">
                <p style="margin: 0; font-weight: 600; color: #d4af37; font-size: 14px;">
                    $${(item.unit_price || item.price).toLocaleString('es-CL')}
                </p>
            </td>
        </tr>
    `).join('');

    const mailOptions = {
        from: `"Charms Lumina" <${process.env.EMAIL_USER}>`,
        to: payer.email,
        bcc: 'esaldiashiring@gmail.com',
        subject: '¡Gracias por tu compra en Charms Lumina! Confirmación de pedido 💖',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600&display=swap');
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Inter', sans-serif;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 20px; text-align: center; background-color: #fff;">
                                        <h1 style="font-family: 'Playfair Display', serif; color: #d4af37; margin: 0; font-size: 28px;">Charms Lumina</h1>
                                    </td>
                                </tr>
                                
                                <!-- Banner -->
                                <tr>
                                    <td style="padding: 0 40px 30px; text-align: center;">
                                        <h2 style="color: #1a1714; margin: 0; font-size: 22px; line-height: 1.4;">¡Hola ${payer.nombre}!</h2>
                                        <p style="color: #666; font-size: 16px; margin: 15px 0 0; line-height: 1.6;">
                                            Tu pago ha sido procesado con éxito. ✨<br>
                                            Estamos preparando tu pedido con mucho cariño y te avisaremos apenas sea despachado.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Order Details -->
                                <tr>
                                    <td style="padding: 0 40px 30px;">
                                        <div style="background-color: #fdfaf5; border: 1px solid #f5e6cc; border-radius: 6px; padding: 25px;">
                                            <h3 style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #d4af37;">Resumen del Pedido</h3>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                ${itemsHtml}
                                                <tr>
                                                    <td style="padding-top: 20px; color: #888; font-size: 14px;">Envío (Chilexpress)</td>
                                                    <td style="padding-top: 20px; text-align: right; color: #1a1714; font-size: 14px;">$${shippingCost.toLocaleString('es-CL')}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 10px; font-weight: 600; color: #1a1714; font-size: 18px;">Total Pagado</td>
                                                    <td style="padding-top: 10px; text-align: right; font-weight: 600; color: #d4af37; font-size: 18px;">$${total.toLocaleString('es-CL')}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Shipping Address -->
                                <tr>
                                    <td style="padding: 0 40px 40px;">
                                        <div style="border: 1px solid #eee; border-radius: 6px; padding: 20px;">
                                            <h3 style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Dirección de Envío</h3>
                                            <p style="margin: 0; color: #1a1714; font-size: 14px; line-height: 1.6; font-weight: 500;">
                                                ${payer.direccion}<br>
                                                ${payer.comuna}, ${payer.region}<br>
                                                ${payer.depto ? `Depto/Casa: ${payer.depto}` : ''}
                                            </p>
                                            <p style="margin: 10px 0 0; color: #d4af37; font-size: 13px; font-style: italic;">
                                                🚚 Despacharemos tu pedido pronto a esta dirección.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background-color: #1a1714; text-align: center;">
                                        <p style="color: #ffffff; margin: 0; font-size: 14px;">Gracias por preferir Charms Lumina</p>
                                        <p style="color: #666; margin: 10px 0 0; font-size: 12px;">Este es un correo automático, por favor no respondas directamente.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Transactional email sent to customer.');
        return true;
    } catch (error) {
        console.error('Error sending transactional email:', error);
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
