# Flujo de Trabajo de Desarrollo (Workflow)

Este documento describe los procesos y estándares para contribuir y desarrollar en el proyecto **Bingo ELY**.

## 🔄 Ciclo de Desarrollo

1.  **Ramas (Branches)**:
    *   `main`: Rama principal, siempre debe ser estable y desplegable.
    *   `feature/nombre-feature`: Para nuevas funcionalidades.
    *   `fix/nombre-bug`: Para corrección de errores.
    *   `refactor/nombre-refactor`: Para mejoras de código sin cambios funcionales.

2.  **Commits**:
    *   Usamos **Conventional Commits** para mensajes claros y estructurados.
    *   Formatos:
        *   `feat: descripción` (Nueva funcionalidad)
        *   `fix: descripción` (Corrección de error)
        *   `docs: descripción` (Cambios en documentación)
        *   `style: descripción` (Cambios de formato, espacios, etc.)
        *   `refactor: descripción` (Cambios de código que no arreglan bugs ni añaden features)
        *   `chore: descripción` (Tareas de mantenimiento, dependencias)

## 🛠️ Entorno Local

1.  **Instalación**:
    Asegúrate de tener Node.js instalado.
    ```bash
    npm install
    ```

2.  **Desarrollo**:
    Para trabajar en tiempo real con recarga automática (HMR):
    ```bash
    npm run dev
    ```

3.  **Linting y Formato**:
    El proyecto utiliza la configuración estándar de Vite + ESLint. Revisa la consola para advertencias.

## 📦 Construcción y Despliegue

1.  **Build**:
    Genera los archivos estáticos optimizados en la carpeta `dist/`.
    ```bash
    npm run build
    ```

2.  **Preview**:
    Prueba la versión de producción localmente antes de desplegar.
    ```bash
    npm run preview
    ```

## 🎨 Estándares de UI (Tailwind CSS v4)

*   **Colores**: Usa las variables de tema definidas o las clases utilitarias de Tailwind (ej. `rose-500`, `slate-900`).
*   **Espaciado**: Mantén la consistencia usando la escala de Tailwind (`p-4`, `m-2`, `gap-6`).
*   **Componentes**: Prefiere crear componentes reutilizables en `src/components/ui` (como `GlassCard`) en lugar de repetir estilos complejos.
*   **Iconos**: Usa siempre `lucide-react` para mantener la consistencia visual. Tamaño estándar para encabezados: `20px`.

## 📸 Captura de Imágenes

Para la funcionalidad de captura (`html-to-image`):
*   Asegúrate de que el elemento a capturar tenga un `id` único.
*   Usa la clase `remove-me` en elementos hijos que no deban aparecer en la imagen final.
*   Verifica siempre que el padding y las dimensiones calculadas no corten el contenido.
