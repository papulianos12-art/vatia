/* Vatia alfa · datos de ejemplo.
   Nada de esto viene de clientes reales. Cuando exista backend, este archivo
   se reemplaza por llamadas a la API (ver README.md). */
(function () {
  'use strict';

  // Generador pseudoaleatorio con semilla, para que la demo se vea igual cada vez.
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const TARIFA = 257; // $/kWh, promedio nacional BT1 (julio 2026)

  const DISTRIBUIDORAS = [
    { id: 'cge', name: 'CGE', zona: 'Biobío, Ñuble y gran parte del país', url: 'https://sucursalvirtual.cge.cl/web/guest/pago-en-linea', dominio: 'sucursalvirtual.cge.cl' },
    { id: 'frontel', name: 'Frontel', zona: 'Biobío y La Araucanía rural', url: 'https://www.gruposaesa.cl/frontel/pago-en-linea/', dominio: 'gruposaesa.cl' },
    { id: 'coelcha', name: 'Coelcha', zona: 'Cooperativa, provincia de Biobío', url: 'https://pagos.coelcha.cl/', dominio: 'pagos.coelcha.cl' },
    { id: 'enel', name: 'Enel', zona: 'Región Metropolitana', url: 'https://www.enel.cl/es/clientes/servicios-en-linea/pago-de-cuenta.html', dominio: 'enel.cl' },
    { id: 'saesa', name: 'Saesa', zona: 'Los Ríos, Los Lagos y Aysén', url: 'https://www.gruposaesa.cl/saesa/pago-en-linea/', dominio: 'gruposaesa.cl' },
    { id: 'chilquinta', name: 'Chilquinta', zona: 'Región de Valparaíso', url: 'https://www.chilquinta.cl/', dominio: 'chilquinta.cl' }
  ];

  // Circuitos del tablero del hogar de ejemplo
  const CIRCUITS = [
    { id: 'c1', name: 'Cocina', note: 'Enchufes', amp: 16, protected: true },
    { id: 'c2', name: 'Living y dormitorios', note: 'Enchufes y luces', amp: 16, protected: false },
    { id: 'c3', name: 'Termo', note: 'Circuito propio · con contactor', amp: 16, protected: false, controllable: true }
  ];

  // Aparatos del hogar de ejemplo. w = potencia típica en W, month = gasto proyectado del mes en $
  const APPLIANCES = [
    { id: 'refri', name: 'Refrigerador', circuit: 'c1', w: 150, series: 's1', sig: 'Motor con pico de arranque', conf: 94, month: 7900, always: true },
    { id: 'hervidor', name: 'Hervidor', circuit: 'c1', w: 1950, series: 's2', sig: 'Resistivo, sin potencia reactiva', conf: 97, month: 6800 },
    { id: 'tv', name: 'Televisor', circuit: 'c2', w: 110, series: 's3', sig: 'Fuente conmutada, tercer armónico alto', conf: 91, month: 2100 },
    { id: 'estufa', name: 'Estufa eléctrica', circuit: 'c2', w: 2000, series: 's4', sig: 'Resistiva, 2 kW', conf: 96, month: 32000 },
    { id: 'termo', name: 'Termo eléctrico', circuit: 'c3', w: 1500, series: 's5', sig: 'Resistivo, circuito propio', conf: 99, month: 18500, controllable: true },
    { id: 'otros', name: 'Otros', circuit: 'c2', w: 70, series: 's6', sig: 'Luces y cargadores', conf: null, month: 4300, always: true }
  ];

  const ALERTS = [
    { id: 'a1', kind: 'control', sev: 'info', when: 'Hoy, 20:14', title: 'Termo pausado 10 minutos', body: 'Ibas a llegar a 26,2 A y el automático general es de 25 A. Lo volvimos a encender a las 20:24.', unread: true },
    { id: 'a2', kind: 'falla', sev: 'warn', when: 'Hoy, 18:02', title: 'El refrigerador trabaja 30% más que el mes pasado', body: 'Suele pasar por un sello de puerta gastado o la parrilla de atrás con polvo. Revísalo antes de que falle.', unread: true },
    { id: 'a3', kind: 'consumo', sev: 'info', when: 'Ayer, 04:00', title: 'Consumo fantasma de 180 W durante la noche', body: 'Equivale a unos $3.300 al mes. Los cargadores y el decodificador de TV son los sospechosos habituales.', unread: true },
    { id: 'a4', kind: 'corte', sev: 'bad', when: '14 oct, 03:12', title: 'Corte de luz de 42 minutos', body: 'Quedó registrado con hora y duración. Te sirve como respaldo si necesitas reclamar a tu distribuidora.', unread: false },
    { id: 'a5', kind: 'seguridad', sev: 'warn', when: '12 oct, 16:40', title: 'La plancha quedó encendida 2 horas', body: 'No había otro consumo en la casa. Si sales, revisa los aparatos que generan calor.', unread: false },
    { id: 'a6', kind: 'meta', sev: 'info', when: '10 oct, 09:00', title: 'Vas un 9% sobre tu meta del mes', body: 'Tu meta es $65.000 y la proyección va en $71.600. La estufa explica casi toda la diferencia.', unread: false }
  ];

  const RECS = [
    { id: 'r1', title: 'Programa el termo para que caliente solo antes de la ducha', body: 'Hoy se mantiene caliente las 24 horas. Encendido de 6:30 a 7:30 alcanza para la mañana.', save: 5000, action: 'Programar termo', done: 'Termo programado de 6:30 a 7:30' },
    { id: 'r2', title: 'Baja la estufa a 1.500 W después de las 23:00', body: 'La estufa es el 45% de tu cuenta. En la noche, con la pieza ya temperada, rinde igual en el nivel medio.', save: 10000, action: 'Avisarme a las 23:00', done: 'Te avisaremos a las 23:00' },
    { id: 'r3', title: 'Apaga lo que queda enchufado de noche', body: 'Tu casa gasta 180 W mientras duermes. Una zapatilla con interruptor para TV y decodificador resuelve la mitad.', save: 3300, action: 'Marcar como hecho', done: 'Hecho. Lo mediremos esta noche' },
    { id: 'r4', title: 'Revisa el sello del refrigerador', body: 'Trabaja 30% más que el mes pasado. Cierra la puerta sobre una hoja de papel: si sale sin resistencia, el sello está gastado.', save: 1800, action: 'Marcar como hecho', done: 'Hecho. Seguiremos su consumo' }
  ];

  // ----- Datos para el panel CEO -----
  const COMUNAS = ['Concepción', 'San Pedro de la Paz', 'Talcahuano', 'Chiguayante', 'Hualpén', 'Penco', 'Coronel', 'Los Ángeles'];
  const DIST_BY_COMUNA = { 'Concepción': 'cge', 'San Pedro de la Paz': 'cge', 'Talcahuano': 'cge', 'Chiguayante': 'cge', 'Hualpén': 'cge', 'Penco': 'cge', 'Coronel': 'frontel', 'Los Ángeles': 'coelcha' };
  const ACT = ['Termo pausado para evitar sobrecarga', 'Nuevo aparato reconocido: microondas', 'Revisó recomendaciones', 'Fue a pagar su cuenta', 'Activó programación del termo', 'Aviso de consumo fantasma', 'Equipo actualizado a v0.4.2', 'Aviso de falla: refrigerador'];

  function makeClients() {
    const r = rng(20261015);
    const list = [];
    for (let i = 1; i <= 32; i++) {
      const pyme = i % 6 === 0 || i === 7;
      const comuna = COMUNAS[Math.floor(r() * COMUNAS.length)];
      const kwhDay = pyme ? 18 + r() * 26 : 6 + r() * 7.5;
      const month = Math.round((kwhDay * 30 * TARIFA) / 100) * 100;
      const offline = i === 9 || i === 23;
      const alerts = offline ? 1 : (r() < 0.22 ? 1 : 0) + (r() < 0.08 ? 1 : 0);
      const lastMin = offline ? (i === 9 ? 190 : 75) : Math.floor(r() * 28);
      const saving = pyme ? 6 + r() * 7 : 4 + r() * 9;
      const days = 4 + Math.floor(r() * 50);
      list.push({
        id: 'VT-' + String(i).padStart(3, '0'),
        tipo: pyme ? 'Pyme' : 'Hogar',
        rubro: pyme ? ['Almacén', 'Panadería', 'Taller', 'Peluquería', 'Botillería', 'Minimarket'][i % 6] : null,
        comuna,
        dist: DIST_BY_COMUNA[comuna],
        plan: pyme ? 9990 : 3990,
        kwhDay,
        month,
        online: !offline,
        lastMin,
        alerts,
        saving,
        days,
        fw: offline ? 'v0.4.1' : (r() < 0.8 ? 'v0.4.2' : 'v0.4.1'),
        lastAct: ACT[Math.floor(r() * ACT.length)],
        mix: pyme
          ? [['Refrigeración', 0.46], ['Iluminación', 0.17], ['Hornos y cocina', 0.21], ['Otros', 0.16]]
          : [['Estufa', 0.3 + r() * 0.2], ['Termo', 0.15 + r() * 0.12], ['Refrigerador', 0.11], ['Hervidor', 0.08], ['Otros', 0.12]]
      });
    }
    return list;
  }

  // Demanda agregada de todos los clientes, 24 horas cada 30 min (kW)
  function makeDemand() {
    const r = rng(77);
    const pts = [];
    for (let k = 0; k < 48; k++) {
      const h = k / 2;
      const base = 14
        + 9 * Math.exp(-Math.pow((h - 8) / 1.6, 2))
        + 22 * Math.exp(-Math.pow((h - 20.5) / 2.2, 2))
        + 6 * Math.exp(-Math.pow((h - 13.5) / 2.5, 2));
      pts.push(Math.round((base + (r() - 0.5) * 2.4) * 10) / 10);
    }
    return pts;
  }

  window.VATIA = {
    TARIFA, DISTRIBUIDORAS, CIRCUITS, APPLIANCES, ALERTS, RECS,
    CLIENTS: makeClients(),
    DEMAND: makeDemand(),
    rng
  };
})();
