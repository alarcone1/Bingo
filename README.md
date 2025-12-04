# Bingo ELY 🎱

Una aplicación web moderna y elegante para jugar Bingo, construida con **React**, **TypeScript** y **Tailwind CSS v4**. Diseñada con una interfaz "Glassmorphism" premium y animaciones fluidas.

![Bingo ELY Screenshot](public/icons/Logo-ae1.png)

## ✨ Características Principales

*   **Balotera 3D Realista**: Animación de esfera giratoria con efectos de iluminación y física para el sorteo de balotas.
*   **Tablero Maestro Interactivo**: Visualización clara de todos los números sorteados, organizados por columnas (B-I-N-G-O).
*   **Figura a Jugar Personalizable**: Cuadrícula de 5x5 para definir el patrón de victoria.
    *   **Modo Configuración**: Permite editar la figura (candado abierto).
    *   **Modo Juego**: Bloquea la figura para evitar cambios accidentales (candado cerrado).
*   **Captura de Pantalla Inteligente**: Funcionalidad para exportar el "Tablero Maestro" y la "Figura a Jugar" como imágenes PNG limpias y listas para compartir (sin elementos de UI innecesarios).
*   **Historial Visual**: Tira lateral con las últimas balotas sorteadas para referencia rápida.
*   **Diseño Adaptativo (Responsive)**: Layout optimizado de 3 columnas para pantallas grandes y adaptaciones para móviles.
*   **Modo Oscuro/Claro**: Soporte nativo para temas visuales con paletas de colores cuidadosamente seleccionadas (Rose/Fuchsia para claro, Slate/Purple para oscuro).
*   **Efectos de Sonido y Voz**: (Próximamente) Lectura de balotas.

## 🛠️ Tecnologías Utilizadas

*   **Frontend Framework**: [React](https://react.dev/) (v18+)
*   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) (Alpha/Beta features)
*   **Iconos**: [Lucide React](https://lucide.dev/)
*   **Captura de Imagen**: `html-to-image`

## 🚀 Instalación y Uso

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/alarcone1/Bingo.git
    cd Bingo
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

4.  **Construir para producción**:
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── game/           # Componentes específicos del juego (Balota, Tableros, etc.)
│   ├── layout/         # Componentes de estructura (Fondo animado)
│   └── ui/             # Componentes de UI reutilizables (GlassCard, Botones)
├── hooks/              # Custom Hooks (lógica del juego)
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Constantes y funciones de utilidad
├── App.tsx             # Componente principal
└── main.tsx            # Punto de entrada
```

## 👨‍💻 Autor

Desarrollado por **Edgar Alarcón**.
[LinkedIn](https://www.linkedin.com/in/alarcone1/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
