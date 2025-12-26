# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.0.0] - 2025-12-04

### ✨ Nuevas Características (Features)
- **Generador de Cartones Completo**:
  - Algoritmo de generación para N cartones únicos.
  - Generación automática de 50 cartones al iniciar.
  - Persistencia de estado al cerrar/abrir el panel.
- **Descarga Individual de Cartones**:
  - Botón "Al portapapeles" para compartir rápido (WhatsApp Web).
  - Botón "Al computador" para guardar PNG en alta resolución.
  - Corrección de sincronización de ID (espera de renderizado).
  - Estilo visual unificado (Verde Esmeralda) para todas las acciones de descarga.

### [1.0.0] - 2025-12-04 ([Legacy])
- **Balotera 3D**: Implementación de una esfera 3D con animación de rotación interna para el sorteo de números.
- **Captura de Imagen**: Funcionalidad "Enviar Tablero" y "Enviar Figura" utilizando `html-to-image` para generar imágenes limpias y recortadas.
- **Figura a Jugar**: Nueva sección con cuadrícula 5x5 interactiva para definir patrones de victoria.
- **Modo Bloqueo**: Sistema de candado (Abierto/Cerrado) para proteger la configuración de la figura durante el juego.
- **Créditos Interactivos**: Logo en la esquina inferior derecha con animación hover y enlace al perfil de LinkedIn.
- **Contador de Balotas**: Nuevo diseño tipo "Badge" para el conteo de balotas sorteadas.

### 🎨 Mejoras de UI/UX (Refactor)
- **Migración a Tailwind CSS v4**: Actualización completa del sistema de estilos para usar la última versión de Tailwind.
- **Diseño Glassmorphism**: Implementación de tarjetas con efecto de vidrio esmerilado (`backdrop-blur`), bordes sutiles y sombras profundas.
- **Layout de 3 Columnas**: Reorganización de la interfaz principal para maximizar el espacio y la usabilidad en escritorio.
- **Tipografía Premium**: Uso de fuentes con `tracking-widest` y gradientes de texto para títulos y encabezados.
- **Iconografía Unificada**: Estandarización de todos los iconos de encabezado a un tamaño de `20px` usando `lucide-react`.
- **Feedback Visual**: Mejoras en el contraste de la cuadrícula de patrones y estados de hover/active en botones.

### 🐛 Correcciones (Bug Fixes)
- **Captura de Imagen**: Solucionado el problema de corte en la última fila del tablero al agregar un buffer de padding en el cálculo de dimensiones.
- **Compatibilidad CSS**: Reemplazo de `html2canvas` por `html-to-image` para resolver conflictos con el formato de color `oklab` de Tailwind v4.
- **Alineación**: Centrado vertical y horizontal corregido en múltiples componentes (Botones, Títulos).

### ⚙️ Técnico
- Reestructuración completa del directorio `src` en `components`, `hooks`, `types` y `utils`.
- Separación de la lógica del juego en el hook personalizado `useBingoGame`.
