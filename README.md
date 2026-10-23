# Vatia · sitio web

Sitio de Vatia: página de inicio, portal del cliente ("Mi casa"), panel de operación ("Panel CEO") y página de seguridad. Todo funciona con **datos de ejemplo**. No hay clientes reales, inicio de sesión ni base de datos.

Es un sitio estático (HTML, CSS y JavaScript, sin compilar nada) pensado para GitHub Pages con el dominio `vatia.cl`.

## Cómo verlo

```bash
python3 -m http.server 8000
# o
npx serve .
```

y abre `http://localhost:8000`.

Rutas (se pueden compartir como enlace):

| Ruta | Qué muestra |
| --- | --- |
| `#inicio` | Página principal. También `#precios` y `#piloto` |
| `#casa` | Portal del cliente. Subsecciones: `#casa-aparatos`, `#casa-ahorro`, `#casa-avisos`, `#casa-pagar`, `#casa-ajustes` |
| `#ceo` | Panel de operación. Subsecciones: `#ceo-clientes`, `#ceo-equipos`, `#ceo-negocio` |
| `#seguridad` | Seguridad y privacidad |

## Estructura

```
index.html            Marcado de las cuatro vistas
404.html              Página para enlaces que no existen
CNAME                 Dominio de GitHub Pages (vatia.cl)
.nojekyll             Le dice a GitHub Pages que publique los archivos tal cual
assets/styles.css     Tokens de diseño (claro y oscuro) y estilos
assets/data.js        Datos de ejemplo: aparatos, avisos, clientes, distribuidoras
assets/app.js         Rutas, simulación en vivo, gráficos, panel CEO
assets/favicon.svg    Ícono del sitio
PRODUCT.md            Qué es Vatia y para quién (contexto para diseñar)
DESIGN.md             Sistema visual: colores, tipografías, reglas
versiones/anterior/   Copia de la versión anterior del sitio (se publica en /versiones/anterior/)
```

## Publicar en GitHub Pages con vatia.cl

1. **Activar Pages.** En el repositorio: *Settings → Pages*. En *Build and deployment* elige *Deploy from a branch*, la rama `master` (o la que uses para publicar) y la carpeta `/ (root)`. Guarda.
2. **Dominio.** En la misma página, en *Custom domain*, escribe `vatia.cl` y guarda (el archivo `CNAME` ya lo trae).
3. **DNS (donde compraste vatia.cl, por ejemplo NIC Chile o tu proveedor de DNS):**
   - Cuatro registros `A` para `vatia.cl` (o `@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Opcional, IPv6: registros `AAAA` con `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
   - Un registro `CNAME` para `www` que apunte a `<tu-usuario>.github.io`.
4. **Esperar y asegurar.** El DNS puede tardar desde minutos hasta 24 horas. Cuando GitHub muestre el dominio como verificado, marca *Enforce HTTPS*.
5. **Recomendado:** en *Settings → Pages* verifica el dominio para tu cuenta u organización, así nadie más puede usarlo en otro repositorio.

Antes de publicar, revisa que los enlaces de pago de cada distribuidora sigan funcionando (están en `assets/data.js`).

## Siguiente etapa (beta)

- Backend con base de datos y API para mediciones del ESP32 (MQTT o HTTPS).
- Inicio de sesión: clientes con correo, equipo Vatia con doble verificación.
- Permisos por cuenta: cada cliente ve solo su casa; el panel CEO ve códigos de cliente.
- Reemplazar `assets/data.js` por llamadas a la API.
- Checklist de seguridad de la página `#seguridad` antes de conectar la primera casa real.

## Notas

- Los enlaces de pago llevan a los sitios oficiales de cada distribuidora (verificados en octubre 2026). Revisarlos antes de lanzar.
- Tarifa de referencia: $257/kWh, promedio nacional BT1 (julio 2026).
- Los ajustes de la demo y el tema se guardan solo en el navegador (`localStorage`).
