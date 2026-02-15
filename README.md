# PortafolioAI

PortafolioAI es una aplicación web de página única (SPA) que actúa como un asesor financiero impulsado por Inteligencia Artificial. Permite a los usuarios registrarse, completar un cuestionario de perfil de riesgo, generar un portafolio de inversión personalizado, y acceder a herramientas como un simulador, recursos educativos, noticias financieras y soporte.

## Estructura del Proyecto

```
/portafolioAI
 ├── backend/
 │   ├── app/
 │   │   ├── main.py
 │   │   ├── database.py
 │   │   ├── models/
 │   │   │   ├── user.py
 │   │   │   └── portfolio.py
 │   │   ├── routes/
 │   │   │   ├── auth.py
 │   │   │   ├── profile.py
 │   │   │   └── portfolio.py
 │   │   ├── services/
 │   │   │   ├── optimizer_service.py
 │   │   │   └── gemini_service.py
 │   │   └── utils/
 │   │       └── jwt_handler.py
 │   ├── requirements.txt
 │   └── .env.example
 │
 ├── frontend/
 │   ├── ... (archivos del frontend)
 │
 └── README.md
```

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

*   **Python 3.11+**
*   **Node.js** (para el frontend)
*   **npm** o **yarn** (para el frontend)
*   **MongoDB Atlas** (o una instancia local de MongoDB) para la base de datos.

## Configuración del Backend

1.  **Navega al directorio `backend`:**

    ```bash
    cd backend
    ```

2.  **Crea un entorno virtual e instálalo (recomendado):**

    ```bash
    python -m venv venv
    # En Windows
    .\venv\Scripts\activate
    # En macOS/Linux
    source venv/bin/activate
    ```

3.  **Instala las dependencias de Python:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Configura las variables de entorno:**

    Crea un archivo `.env` en el directorio `backend` (al mismo nivel que `requirements.txt`) y copia el contenido de `.env.example`.

    ```
    MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portafolioAI?retryWrites=true&w=majority
    ACCESS_TOKEN_SECRET=una_clave_larga_y_segura_de_al_menos_32_caracteres
    API_KEY_GEMINI=tu_api_key_de_gemini_o_equivalente
    FRONTEND_URL=http://localhost:5173
    ```

    *   Reemplaza `<user>` y `<pass>` con tus credenciales de MongoDB Atlas.
    *   Genera una `ACCESS_TOKEN_SECRET` larga y segura.
    *   Si planeas usar la API de Gemini, proporciona tu `API_KEY_GEMINI`. De lo contrario, el servicio de Gemini usará un mock.

5.  **Ejecuta el servidor FastAPI:**

    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

    El backend estará disponible en `http://localhost:8000`.

6.  **Prueba los Endpoints (Swagger UI):**

    Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de la API en `http://localhost:8000/docs`.

## Configuración del Frontend

1.  **Navega al directorio `frontend`:**

    ```bash
    cd frontend
    ```

2.  **Instala las dependencias de Node.js:**

    ```bash
    npm install
    # o si usas yarn
    # yarn
    ```

3.  **Configura las variables de entorno para el Frontend (opcional):**
    Vite utiliza variables de entorno que deben prefijarse con `VITE_`. Puedes crear un archivo `.env` en el directorio `frontend`.

    ```
    VITE_API_URL=http://localhost:8000/api
    # Otras variables específicas del frontend si fueran necesarias
    ```

4.  **Ejecuta la aplicación de React:**

    ```bash
    npm run dev
    # o si usas yarn
    # yarn dev
    ```

    La aplicación frontend estará disponible en `http://localhost:5173` (o un puerto similar configurado por Vite).

## Notas sobre la Integración con Gemini/GenAI

El proyecto está configurado para usar la API de Google Gemini (a través de `@google/genai` en el frontend y `gemini_service.py` en el backend). Si no proporcionas una `API_KEY_GEMINI` en tu archivo `.env`, el `gemini_service.py` del backend utilizará un servicio mock para generar respuestas plausibles, permitiendo el desarrollo y la prueba de la interfaz de usuario sin una clave de API real.

6. Frontend — Google Identity Services

- Añade a `frontend/.env` la variable `VITE_GOOGLE_CLIENT_ID` con tu Client ID de Google:

```dotenv
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
```

- El componente `frontend/src/components/GoogleLoginButton.tsx` usa Google Identity Services para obtener el `id_token` directamente en el cliente y lo envía a `POST /api/auth/google/verify` para que el backend valide la firma y cree/actualice el usuario.

## Comentarios y Claridad del Código

Se han añadido comentarios a las funciones clave del backend y se añadirán a los componentes del frontend para explicar su propósito, entradas y salidas, facilitando la comprensión y el mantenimiento del código.

### Inicio de sesión con Google (OAuth2)

Esta rama incluye soporte para iniciar sesión con Google (obtener perfil: `openid email profile`). Pasos rápidos para configurar y probar localmente:

1. Crear credenciales en Google Cloud Console:
    - Ve a https://console.cloud.google.com/apis/credentials
    - Crea un OAuth 2.0 Client ID (tipo: Web application)
    - Añade `http://localhost:8000/api/auth/google/callback` como Authorized redirect URI
    - Copia `CLIENT_ID` y `CLIENT_SECRET`

2. Actualizar variables de entorno (archivo `backend/.env` basado en `.env.example`):

```dotenv
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

3. Levantar servicios:

```powershell
# Backend (desde carpeta backend)
uvicorn app.main:app --reload --port 8000

# Frontend (desde carpeta frontend)
npm install
npm run dev
```

4. Probar flujo:
    - Abrir frontend en `http://localhost:5173`
    - Abrir modal de autenticación y clicar "Iniciar sesión con Google"
    - Completar el flujo de Google; tras aceptar serás redirigido a `/auth/callback?token=...` y el token será guardado en `localStorage` como `token`.
    - El backend creará/actualizará el documento del usuario en la colección `users` con `email`, `name`, `picture`, `google_id`.
    - Ahora puedes usar rutas protegidas con el JWT.

5. Notas de seguridad:
    - No expongas `GOOGLE_CLIENT_SECRET` en el frontend.
    - Valida siempre `state` y `id_token`.
    - Guarda `refresh_token` solo si realmente lo necesitas y guárdalo cifrado en backend.
