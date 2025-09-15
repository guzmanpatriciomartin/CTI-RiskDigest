# 🚀 Suite Integrada de Gestión de Riesgos de Ciberseguridad con Digest de Noticias (IA-asistido)

Este proyecto es una potente aplicación web diseñada para equipos de seguridad que necesitan gestionar tickets de riesgo de ciberseguridad y, al mismo tiempo, mantenerse al día con el panorama de amenazas. Combina una robusta herramienta de gestión de riesgos con un sistema de agregación de noticias de ciberseguridad, potenciado por inteligencia artificial, permitiendo una rápida identificación y respuesta ante nuevas amenazas.

## ✨ Características Principales

### Gestión de Tickets de Riesgo (Frontend)
*   **Gestión Completa del Ciclo de Vida:** Crea, edita, actualiza estados y elimina tickets de riesgo con facilidad.
*   **Dashboard Interactivo:** Visualiza de un vistazo métricas clave como el total de tickets, tickets abiertos, conteos por estado y por prioridad.
*   **Filtros Dinámicos:** Busca tickets por título, ID o comentarios, y filtra por estado, cliente o tags para encontrar información específica rápidamente.
*   **Historial Detallado:** Cada ticket incluye una línea de tiempo con todos los cambios de estado y comentarios registrados, proporcionando una trazabilidad completa.
*   **Priorización Clara:** Asigna prioridades (Alta, Media, Baja) a los tickets para una mejor gestión de recursos.
*   **Exportación a PDF:** Genera informes profesionales en formato PDF con los datos de los tickets filtrados, incluyendo resúmenes y gráficos.
*   **Persistencia Local:** Los datos de los tickets se guardan de forma segura en el `localStorage` del navegador para acceso rápido.

### Digest de Noticias de Ciberseguridad (Backend & IA)
*   **Agregación RSS Automatizada:** Recopila noticias de diversas fuentes líderes en ciberseguridad (Graham Cluley, Schneier, KrebsOnSecurity, Dark Reading, CSO Online, ESET, Sophos, Cyberbuilders Substack, entre otros).
*   **Scraping Inteligente de Contenido:** Utiliza `cheerio` para extraer de forma eficiente el texto principal de los artículos, eliminando elementos irrelevantes.
*   **Resúmenes Asistidos por IA (Briefs LLM):** Integra la API de OpenRouter con un modelo de lenguaje grande (LLM) para generar resúmenes concisos de cada noticia, enfocándose en su relevancia e impacto en la ciberseguridad.
*   **Filtrado Temporal:** Permite especificar un rango de días para obtener las noticias más recientes.

### Integración Inteligente: Noticias a Tickets de Riesgo
*   **Creación Directa de Tickets:** Cada tarjeta de noticia del digest incluye un botón "Crear Ticket de Riesgo".
*   **Auto-rellenado de Formularios:** Al hacer clic, el formulario de creación de tickets se abre y se pre-rellena automáticamente con:
    *   **Título:** Derivado del título de la noticia.
    *   **Descripción:** Incluye el resumen generado por IA y el enlace al artículo original.
    *   **Tags:** Sugeridos automáticamente basándose en la fuente y palabras clave del título del artículo.

## 🛠️ Tecnologías Utilizadas

*   **Backend (Node.js/Express):**
    *   `Node.js`: Entorno de ejecución de JavaScript.
    *   `Express.js`: Framework web minimalista para la API y el servidor de archivos estáticos.
    *   `rss-parser`: Para la lectura y parseo de feeds RSS.
    *   `node-fetch`: Implementación de la API `fetch` para realizar solicitudes HTTP desde Node.js.
    *   `cheerio`: Un potente y rápido analizador de HTML, ideal para el scraping web.
    *   `openai`: Librería oficial para interactuar con la API de OpenAI (utilizada aquí a través de la pasarela de OpenRouter).
    *   `cors`, `body-parser`: Middlewares para habilitar la comunicación entre frontend y backend y parsear los cuerpos de las solicitudes.
*   **Frontend (HTML/CSS/JavaScript):**
    *   `HTML5`: Estructura semántica y base de la interfaz de usuario.
    *   `CSS3`: Estilos modernos para un diseño oscuro y legible, con elementos interactivos.
    *   `JavaScript (Vanilla JS)`: Toda la lógica del cliente, incluyendo la gestión de tickets, interacción con el digest API y manipulación del DOM.
    *   `jsPDF`, `jspdf-autotable`: Bibliotecas para generar informes PDF directamente desde el navegador.
    *   `Chart.js`: Para la creación de gráficos visuales en el dashboard de riesgos.
    *   `localStorage`: Utilizado para la persistencia de los datos de los tickets de riesgo en el navegador del usuario.

## ⚙️ Instalación y Configuración

1.  **Clonar el Repositorio (o crear la estructura de archivos):**
    Asegúrate de que todos los archivos (`server.js`, `digestGenerator.js`, `index.html`, `package.json`, `README.md`) estén en la misma carpeta raíz de tu proyecto.

2.  **Instalar Dependencias:**
    Abre tu terminal, navega hasta la carpeta de tu proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias:
    ```bash
    npm install express cors body-parser rss-parser node-fetch cheerio openai
    ```

3.  **Configurar la Clave API de OpenRouter:**
    Este paso es **ABSOLUTAMENTE CRÍTICO** para que la generación de resúmenes por IA funcione. Debes obtener una clave API de [OpenRouter.ai](https://openrouter.ai/) y configurarla como una variable de entorno en tu sistema.

    *   **Linux/macOS:**
        ```bash
        export OPENROUTER_API_KEY="sk-or-v1-TU_CLAVE_AQUI"
        ```
    *   **Windows (Command Prompt):**
        ```cmd
        set OPENROUTER_API_KEY="sk-or-v1-TU_CLAVE_AQUI"
        ```
    *   **Windows (PowerShell):**
        ```powershell
        $env:OPENROUTER_API_KEY="sk-or-v1-TU_CLAVE_AQUI"
        ```
    **Reemplaza `"sk-or-v1-TU_CLAVE_AQUI"` con tu clave real de OpenRouter.** Por razones de seguridad, **nunca publiques tu clave API directamente en el código o en repositorios públicos.**

## 🚀 Uso de la Aplicación

1.  **Iniciar el Servidor:**
    Desde la terminal en la carpeta raíz de tu proyecto, ejecuta:
    ```bash
    node server.js
    ```
    La consola te indicará que el servidor está escuchando, por ejemplo:
    `Servidor de Riesgos y Ciberseguridad iniciado en http://localhost:3000`

2.  **Acceder a la Aplicación:**
    Abre tu navegador web preferido y navega a la dirección `http://localhost:3000`.

3.  **Gestión de Tickets de Riesgo:**
    *   Utiliza el botón **"Crear Nuevo Ticket"** para añadir manualmente un nuevo riesgo al sistema.
    *   Explora el **"Dashboard de Riesgos"** para obtener una visión general de tus tickets.
    *   Aplica **"Filtros y Reportes"** para buscar, organizar o exportar tus tickets en formato PDF.
    *   Haz clic en cualquier ticket en la lista para expandir y ver su descripción, cambiar su estado, añadir comentarios o eliminarlo.

4.  **Generar y Explorar el Digest de Noticias:**
    *   Dirígete a la sección **"Digest de Noticias de Ciberseguridad"**.
    *   Introduce el número de días hacia atrás (ej. `7` para la última semana) del que deseas obtener noticias.
    *   Haz clic en **"Generar Digest"**. La aplicación consultará las fuentes RSS, realizará scraping y generará resúmenes con IA. Este proceso puede tardar unos minutos, dependiendo de la cantidad de noticias y la velocidad de las respuestas de las APIs.
    *   Las noticias aparecerán en un formato de tarjeta individual con su título, fuente, fecha y el resumen generado por IA.

5.  **Crear un Ticket de Riesgo desde una Noticia:**
    *   Junto a cada tarjeta de noticia en el digest, encontrarás el botón **"Crear Ticket de Riesgo"**.
    *   Al hacer clic en este botón, el modal de creación de tickets se abrirá automáticamente con el título, una descripción detallada (que incluye el resumen de la IA y el enlace original de la noticia) y tags pre-rellenados.
    *   Podrás revisar, ajustar la información, seleccionar la prioridad y guardar el nuevo ticket de riesgo.

## 📂 Estructura del Proyecto

├── server.js # Backend: Servidor Express, API para el digest de noticias.
├── digestGenerator.js # Lógica central para la agregación RSS, scraping y generación de briefs con IA.
├── ai_studio_code (32).html# Frontend: Interfaz de usuario completa, estilos CSS y lógica JavaScript del cliente.
├── package.json # Metadatos del proyecto y lista de dependencias de Node.js.
├── node_modules/ # Directorio donde npm instala las dependencias.
└── README.md # Este archivo de descripción del proyecto.
