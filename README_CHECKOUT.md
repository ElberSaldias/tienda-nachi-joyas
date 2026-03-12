# Guía de Configuración: Mercado Pago & Chilexpress

He actualizado tu tienda para que los cobros sean automáticos y los envíos se coticen en tiempo real.

### 1. Variables de Entorno (.env)

He creado un archivo `server/.env.example`. Debes renombrarlo a `.env` dentro de la carpeta `server/` y completar tus credenciales:

- `MP_ACCESS_TOKEN`: Tu "Access Token" de Mercado Pago (lo obtienes en el Panel de Desarrollador).
- `CHILEXPRESS_API_KEY`: Tu API Key de Chilexpress (si deseas usar la integración real).

### 2. Cómo ejecutar el proyecto

Ahora tienes dos partes que deben correr al mismo tiempo:

#### Frontend (Tu sitio web)

En la terminal principal (Raíz del proyecto):

```bash
npm run dev
```

#### Backend (Procesador de Pagos y Envíos)

Abre una **nueva terminal** y navega a la carpeta server:

```bash
cd server
npm start
```

*(He configurado el comando `npm start` para usar `nodemon` y que se reinicie solo ante cambios).*

### 3. Flujo del Usuario

1. El usuario elige sus productos.
2. En el carrito, ingresa su **Comuna**.
3. Automáticamente, el sistema llama al backend para obtener el costo de envío (Chilexpress).
4. El total se actualiza en tiempo real.
5. Al hacer clic en **"Ir a Pagar"**, se crea una preferencia de Mercado Pago y se redirige al sitio seguro.
6. Tras el pago, el usuario vuelve a tu sitio a una página de **Éxito** o **Error**.

---
**Nota**: Por defecto, el backend está en modo "Simulación" para Chilexpress si no detecta una API Key válida, cobrando $3.500 para Santiago y $5.900 para regiones.
