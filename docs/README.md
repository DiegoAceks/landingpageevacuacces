# EvacuAcces: landing page interactiva

Demostración académica del curso HCI for UX Design (1ASI0784, ciclo 202620, UPC). Simula los flujos principales de EvacuAcces con HTML, CSS y JavaScript. No usa servidores: todo ocurre en el navegador.

## Estructura
- `index.html`: redirige a `pages/index.html`.
- `pages/index.html`: landing page (una sola página responsive).
- `css/styles.css`: estilos (Desktop, Tablet y Mobile con el mismo código).
- `js/main.js`: interacciones de las 30 historias de usuario core.
- `assets/`: imágenes, íconos, fuentes y videos (por ahora vacío; la página no los necesita).
- `docs/`: documentación.

## Cómo probarla
Abre `pages/index.html` en el navegador. Código de demostración para el rol de brigadista (HU03): `BRIG-2026`.

## Publicar en GitHub Pages
1. Sube esta carpeta a un repositorio de GitHub.
2. En Settings > Pages, elige la rama `main` y la carpeta `/ (root)`.
3. Abre la URL pública que GitHub muestra y verifica Desktop y móvil.

## Historias de usuario implementadas (30)
| Sección | HU |
|---|---|
| Perfil | HU01, HU03, HU08 |
| Alerta | HU09, HU10, HU11, HU14 |
| Guiado | HU06, HU13, HU17, HU18, HU19, HU20, HU21, HU22, HU24 |
| Ayuda humana | HU15, HU25, HU26, HU27, HU29 |
| Panel de brigadistas | HU32, HU33, HU34, HU35, HU36, HU37 |
| Edificio | HU07, HU41, HU44 |

Cada control muestra la etiqueta de su HU en la página.

## Accesibilidad aplicada
Contraste mínimo de 4.5:1, etiquetas en todos los campos, navegación completa por teclado con foco visible, enlace para saltar al contenido, avisos con `role="status"` o `aria-live`, objetivos táctiles de 48 px y estados que no dependen solo del color.
