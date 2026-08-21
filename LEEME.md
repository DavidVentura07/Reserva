# Reserva

Control de tu fondo de emergencia repartido en bancos digitales. Funciona sin conexión y sin servidor: todos los datos viven en tu teléfono.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa: interfaz y motor de cálculo |
| `sw.js` | Permite que funcione sin internet |
| `manifest.webmanifest` | Hace que se instale como app en la pantalla de inicio |
| `icon-192.png`, `icon-512.png` | Icono de la app |

Los cinco archivos van juntos en la raíz del repositorio. No los metas en una subcarpeta.

## Subirla a GitHub Pages

1. Crea un repositorio nuevo en GitHub. Puede llamarse `reserva`. Tiene que ser **público** para que Pages funcione en cuentas gratuitas.
2. Sube los cinco archivos a la rama principal (`main`).
3. Entra a **Settings → Pages** dentro del repositorio.
4. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
5. Espera un par de minutos. GitHub te dará una dirección tipo `https://tuusuario.github.io/reserva/`.

Que el repositorio sea público significa que se ve el código, no tus datos. Tus saldos nunca salen del teléfono: no hay servidor al que enviarlos.

## Instalarla en el iPhone

1. Abre la dirección en **Safari** (tiene que ser Safari; desde Chrome no se instala).
2. Toca el botón de compartir.
3. Elige **Añadir a pantalla de inicio**.
4. Ábrela desde el icono, no desde Safari. Así funciona a pantalla completa y sin conexión.

Importante: si abres la app desde Safari y desde el icono, cada una guarda sus propios datos. Usa siempre el icono.

## Respaldo

El botón de respaldo en Ajustes descarga un archivo `reserva-AAAA-MM-DD.json`. Guárdalo en Archivos o iCloud.

Es la única copia de tu historial. Si borras la app o cambias de teléfono sin haber exportado, no hay forma de recuperarlo. La app te muestra en la pantalla principal cuántos días llevas sin respaldar, y te avisa en amarillo pasadas dos semanas.

Al importar, la app reemplaza todo lo que tiene. Antes de hacerlo descarga sola una copia de lo que había, por si el archivo era el equivocado.

## Cómo calcula

**Devenga y congela.** Cada día que pasa, la app calcula el interés de ese día con la tasa vigente y lo suma al saldo. Lo ya ganado no se recalcula: si mañana editas la tasa, el cambio solo afecta hacia adelante.

**Conciliación.** Cuando escribes el saldo real que ves en el banco, la app corrige su proyección, registra la diferencia como un ajuste visible y deduce a qué tasa está rindiendo la cuenta de verdad. Necesita al menos siete días entre conciliaciones para que la cifra tenga sentido; con menos, no la calcula.

**Tasa real observada.** Es el promedio de las últimas tres mediciones. Como el saldo del banco ya viene con el ISR descontado, esta tasa es neta: suele salir por debajo de la declarada, y esa diferencia es información útil para decidir dónde dejar el dinero.

**Disponible contra patrimonio.** Lo que está a plazo no se suma a lo disponible. La cifra grande es lo que puedes usar hoy.
