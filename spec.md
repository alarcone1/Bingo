# Especificaciones Técnicas (Spec)

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura basada en componentes de React, utilizando Hooks para la gestión del estado y lógica de negocio.

### Estructura de Directorios

*   `src/components/game`: Componentes principales de la lógica del juego (Tablero, Balota, Historial).
*   `src/components/ui`: Componentes de interfaz genéricos y reutilizables (Tarjetas, Botones).
*   `src/components/layout`: Componentes estructurales o decorativos (Fondo).
*   `src/hooks`: Lógica de estado encapsulada (`useBingoGame`).
*   `src/utils`: Constantes globales y funciones auxiliares.

## 🧩 Componentes Clave

### 1. `App.tsx`
Componente raíz que orquesta el layout principal de 3 columnas y gestiona el estado global de la UI (Modo Oscuro, Bloqueo de Configuración).

### 2. `GlassCard.tsx` (`src/components/ui`)
Contenedor principal para las secciones de la UI. Implementa el efecto de "vidrio" (backdrop-blur, bordes semitransparentes) y gestiona encabezados con iconos y acciones.

### 3. `BingoBall.tsx` (`src/components/game`)
Renderiza la balota 3D. Utiliza transformaciones CSS (`rotateX`) para simular el giro de los números dentro de una esfera estática con iluminación radial.

### 4. `MasterBoard.tsx` (`src/components/game`)
Muestra la matriz completa de números del 1 al 75. Resalta los números "llamados" y gestiona la visualización por columnas (B-I-N-G-O).

### 5. `PatternGrid.tsx` (`src/components/game`)
Cuadrícula interactiva de 5x5. Permite al usuario definir patrones ganadores. Soporta estados de bloqueo y visualización optimizada para captura.

## 🎣 Hooks Personalizados

### `useBingoGame.ts`
Gestiona toda la lógica del juego de Bingo:
*   `calledNumbers`: Array de números ya sorteados.
*   `lastNumber`: Último número sorteado.
*   `pattern`: Estado de la cuadrícula de patrones (array de booleanos).
*   `drawBall()`: Función para sortear un nuevo número aleatorio no repetido.
*   `resetGame()`: Reinicia el juego.
*   `togglePatternCell()`: Activa/desactiva celdas en la figura.

## 🎨 Sistema de Diseño (Tailwind CSS v4)

*   **Tema Claro**: Gradientes cálidos (Rose, Pink, Amber). Texto oscuro (`slate-800`).
*   **Tema Oscuro**: Gradientes profundos (Slate, Purple). Texto claro (`rose-50`).
*   **Animaciones**:
    *   `animate-tumble`: Para el giro de la balota.
    *   `animate-pulse`: Para indicadores de estado (candado).
    *   Transiciones suaves (`duration-300`, `ease-in-out`) para todos los elementos interactivos.

## 🖼️ Captura de Imagen

Se utiliza la librería `html-to-image` para renderizar nodos del DOM a PNG.
*   **Estrategia**: Se clona el nodo DOM, se aplican estilos específicos para la "foto" (eliminando sombras excesivas o ajustando márgenes) y se genera un Blob.
*   **Limpieza**: Elementos con la clase `.remove-me` son excluidos automáticamente del árbol DOM clonado antes de la captura.

## 📦 Dependencias Principales

*   `react`: ^18.3.1
*   `react-dom`: ^18.3.1
*   `lucide-react`: ^0.468.0 (Iconos)
*   `html-to-image`: ^1.11.11 (Captura)
*   `canvas-confetti`: ^1.9.3 (Efectos de celebración - opcional/futuro)
*   `tailwindcss`: ^4.0.0-alpha.34
