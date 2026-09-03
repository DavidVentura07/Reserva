const CACHE = 'reserva-1.12';

/* Todo lo que la app necesita para arrancar sin señal. La tipografía ya no viene
   de Google: vive aquí, por eso entra en la caché como un archivo más. */
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './hanken-grotesk-latin.woff2'
];

/* Cuánto se espera a la red antes de rendirse y servir la copia guardada.
   Con señal intermitente (el Metro) fetch no falla: se queda colgado. Sin este
   tope la app se quedaba en blanco esperando una respuesta que no llegaba. */
const ESPERA_RED = 2500;

/* addAll es todo-o-nada: si un solo archivo falla, no se guarda ninguno y la app
   queda sin caché. Se guarda uno por uno para que un fallo no tumbe el resto. */
async function precargar() {
  const c = await caches.open(CACHE);
  await Promise.all(ASSETS.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
}

self.addEventListener('install', e => {
  e.waitUntil(precargar().then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function conTope(promesa, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('sin respuesta')), ms);
    promesa.then(r => { clearTimeout(t); resolve(r); }, err => { clearTimeout(t); reject(err); });
  });
}

async function guardar(req, res) {
  if (!res || !res.ok) return;
  const copia = res.clone();
  try { const c = await caches.open(CACHE); await c.put(req, copia); } catch (e) {}
}

/* La app se pide primero a la red —así una corrección publicada llega sin
   reinstalar— pero con tope de tiempo: si la red tarda o no hay, sale la copia
   guardada al instante y la red sigue por su cuenta refrescando la caché. */
async function servirApp(req) {
  const guardada = await caches.match('./index.html');

  /* Si el propio teléfono ya sabe que no hay red, no se espera nada:
     sale la copia guardada de inmediato. */
  if (guardada && self.navigator && self.navigator.onLine === false) {
    return guardada;
  }

  const red = fetch(req).then(res => { guardar('./index.html', res); return res; });
  red.catch(() => {});
  try {
    return await conTope(red, guardada ? ESPERA_RED : 20000);
  } catch (e) {
    return guardada || await caches.match('./') || Response.error();
  }
}

/* El resto (iconos, manifiesto, tipografía) es fijo: primero la caché. */
async function servirArchivo(req) {
  const guardada = await caches.match(req);
  if (guardada) return guardada;
  const res = await fetch(req);
  guardar(req, res);
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const esApp = req.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('index.html');

  e.respondWith(esApp ? servirApp(req) : servirArchivo(req));
});
