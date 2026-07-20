# ColorIA

Web app móvil de **análisis preliminar de colorimetría personal**. El usuario se toma
una selfie, responde seis preguntas rápidas y recibe una estimación de su estación de
color con una paleta recomendada.

> El resultado es una **estimación orientativa**, no un diagnóstico. La iluminación, la
> cámara y la pantalla pueden alterar los colores medidos.

## Cómo funciona

Todo el análisis se ejecuta **dentro del navegador**. La fotografía no se envía a ningún
servidor para procesarla.

1. **Calidad de imagen** — brillo, exposición, nitidez (varianza del laplaciano),
   simetría de iluminación y detección de sombras fuertes.
2. **Detección facial** — MediaPipe Face Landmarker (468 puntos) valida encuadre,
   distancia, centrado y frontalidad en tiempo real.
3. **Extracción de color** — máscaras poligonales sobre mejillas, frente y mandíbula.
   Se descartan valores extremos y se toma la **mediana** por región (no un promedio
   simple, que sería sensible a brillos y sombras).
4. **Clasificación** — sistema de **reglas configurables** (no hay un modelo de IA
   entrenado). Estima temperatura, profundidad, intensidad y contraste, y las compara
   contra las 12 subestaciones.

La pregunta sobre oro/plata **no interviene en la clasificación**: solo ajusta el nivel
de confianza según coincida o no con la temperatura medida. Cualquier peso, por pequeño
que fuera, podía cruzar un umbral de banda cuando el valor base caía justo en el borde,
así que se dejó fuera del cálculo. Un test lo verifica sobre 35 perfiles distintos.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- MediaPipe Tasks Vision (detección facial, local)
- Culori (conversión RGB / CIELAB / LCH)
- Zustand (estado de sesión, `sessionStorage`)
- jsPDF (informe descargable)
- Supabase (opcional: cuentas e historial)
- Vitest (pruebas unitarias)

## Requisitos

- Node.js 20 o superior
- Un navegador moderno con soporte de `getUserMedia`

## Puesta en marcha

```bash
npm install     # el postinstall copia los assets WASM de MediaPipe a public/
npm run dev
```

Abre <http://localhost:3000>.

> **La cámara solo funciona bajo HTTPS o en `localhost`.** Si pruebas desde el celular
> apuntando a la IP de tu PC, el navegador bloqueará la cámara. Usa un túnel HTTPS
> (por ejemplo `npx localtunnel --port 3000`) o despliega la app.

### Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la compilación |
| `npm run lint` | ESLint |
| `npm test` | Pruebas unitarias (Vitest) |

## Estructura

```
app/              Rutas (App Router)
components/       camera · results · admin · layout · ui
lib/
  mediapipe/        Inicialización del modelo y validación facial
  image-processing/ Compresión y métricas de calidad
  color-analysis/   Regiones de piel y conversión de color
  classification/   Cálculo de características y estaciones
  pipeline/         Orquestación del análisis
  report/           Generación del PDF
  store/            Estado de sesión
  supabase/         Cliente, auth, análisis, métricas
data/             Estaciones, paletas, reglas y cuestionario
types/            Tipos compartidos
supabase/migrations/  SQL del esquema
```

## Ajustar el algoritmo

Los pesos viven en [`data/classification-rules.ts`](data/classification-rules.ts) y las
paletas en [`data/palettes.ts`](data/palettes.ts). Cada análisis guardado registra su
`algorithm_version`, así que al cambiar las reglas conviene subir esa constante para
poder distinguir resultados generados con distintas versiones.

## Supabase (opcional)

La app funciona **completa en modo invitado sin Supabase**. Configurarlo solo habilita
cuentas e historial.

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Copia `.env.example` a `.env.local` y rellena la URL y la `anon key`
   (Project Settings → API). **Nunca uses la `service_role` key en el cliente.**
3. Ejecuta [`supabase/migrations/0001_initial_schema.sql`](supabase/migrations/0001_initial_schema.sql)
   en el **SQL Editor** del panel de Supabase.

Esto crea `profiles` y `analyses` con Row Level Security (cada usuario solo ve lo suyo)
y un bucket privado `selfies` limitado a 5 MB e imágenes. Nada se envía al servidor
salvo que el usuario pulse **Guardar en mi cuenta**; la selfie necesita además marcar
una casilla aparte, que viene desmarcada.

4. Para acceder a `/admin`, registra tu correo como administrador:

```sql
insert into public.admins (email) values ('tucorreo@ejemplo.com');
```

Las métricas se sirven mediante la función `admin_stats()` (`security definer`), que
valida al administrador **en el servidor**. Consultar la tabla directamente desde el
navegador devolvería solo las filas del propio usuario por RLS, es decir, cifras
verosímiles pero falsas.

## Privacidad

- La selfie se guarda únicamente en `sessionStorage` y desaparece al cerrar la pestaña.
- No se sube a ningún servidor salvo autorización explícita.
- No se usa para reconocimiento de identidad ni para entrenar modelos.
- El usuario puede borrar sus datos desde `/privacidad` o desde el resultado.

## Publicación

Consulta la guía paso a paso en [`DEPLOY.md`](DEPLOY.md).

## Pruebas manuales pendientes

Estas requieren dispositivos reales y **no** se pueden verificar automáticamente:

- [ ] Captura real en Android (Chrome) y iPhone (Safari)
- [ ] Distintos tonos de piel
- [ ] Luz natural, luz artificial cálida, contraluz
- [ ] Rechazo del permiso de cámara
- [ ] Dos personas en el encuadre
- [ ] Rostro fuera de posición / demasiado cerca / demasiado lejos
- [ ] Uso de gafas (debe pedir retirarlas)
- [ ] Instalación como PWA en Android e iOS
