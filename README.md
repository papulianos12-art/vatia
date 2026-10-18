# Vatia

Monitoreo eléctrico no invasivo para tableros y tarifas chilenas. Sensor NILM que identifica qué artefacto está encendido y muestra el consumo en pesos, en tiempo real.

Proyecto para Gearbox.

## Páginas

- `index.html` — sitio público / vista cliente (producto, cómo funciona, precio, seguridad).
- `ceo.html` — panel interno (clientes, ingresos, instalaciones, alertas).

Ambas comparten `styles.css` y tienen un selector de tema claro/oscuro (`theme.js`).

## Ejecutar localmente

Cualquier servidor estático sirve, por ejemplo:

```bash
npx serve .
```

Los datos de consumo, precios e instalaciones que se muestran son de ejemplo, con fines de demostración.
