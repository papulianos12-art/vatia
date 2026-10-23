# Sistema visual de Vatia

## Idea
El mundo de Vatia es el tablero eléctrico: módulos DIN, amperes, cables de colores. El inicio usa "capítulos de color": campos planos de borde a borde, cada uno con un solo contenido, todos alineados al mismo margen izquierdo. La app y el panel CEO son herramientas de trabajo: el mundo solo aporta tipografía, paleta, densidad y un gesto propio.

**Gesto propio:** el tablero dibujado como módulos DIN con la carga de cada circuito en vivo (Mi casa > Resumen).

## Inicio (versión 2)
- Portada en ámbar: titular a la izquierda y, a la derecha, la "casa de ejemplo en vivo" (misma simulación que Mi casa), marcada como datos de ejemplo.
- "Tu boleta, por dentro": campo tinta a la izquierda (entrada) y papel a la derecha (resultado).
- "Lo que ves en la app": mosaico de primeros planos de la app sobre tinta; los fragmentos van en el flujo, no posicionados a mano.
- Precios: los dos planes lado a lado (Hogar destacado en superficie, Pyme con borde sobre azul).
- Preguntas como acordeón; "Pide el piloto" como formulario con tipo (casa o pyme) y comuna.

## En el celular
- Barra de navegación inferior fija; botón "Pedir el piloto" siempre visible arriba.
- Las tablas se convierten en fichas de dos columnas con el nombre de cada dato.
- El tablero DIN pasa a una grilla de 2 × 2.

## Tipografía
- **Barlow Semi Condensed** 600/700: títulos y cifras grandes del inicio.
- **Barlow** 400/500/600: texto.
- **JetBrains Mono** 400/600: solo para mediciones y montos (W, A, kWh, $). Nunca como decoración.
- Texto de párrafo 16 px o más. Ancho de lectura 65 a 75 caracteres.

## Color (tokens en `assets/styles.css`)
- Ámbar `--accent` / `--f-amber`: la marca. Botón principal y un campo del inicio.
- Tinta `--f-ink`: fondo de la barra lateral y campos oscuros.
- Azul `--f-blue`: capítulo de precio y segunda etapa.
- Neutros fríos con leve sesgo al azul: `--bg`, `--surface`, `--line`.
- Estado (separado de la marca): `--good`, `--warn`, `--bad`.
- Series de aparatos fijas: refrigerador `--s1`, hervidor `--s2`, televisor `--s3`, estufa `--s4`, termo `--s5`, otros `--s6`. Un aparato siempre tiene el mismo color en toda la app.
- Claro y oscuro definidos para cada token.

## Movimiento
- Curva `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`; menos de 300 ms en interfaz.
- Botones: `scale(.97)` al presionar.
- Avisos (toasts) entran y salen por el mismo lado.
- Solo se animan `transform` y `opacity`. Se respeta `prefers-reduced-motion`.

## Reglas
- Sin etiquetas pequeñas sobre los títulos ("eyebrows").
- Sin tarjetas iguales de ícono + título + texto como estructura.
- Sin emoji como íconos: los íconos son SVG propios de trazo 1,8.
- Botones dicen exactamente lo que hacen.
- Datos de ejemplo siempre marcados como tales.
