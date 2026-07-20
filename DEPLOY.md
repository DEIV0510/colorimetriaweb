# Guía de publicación de ColorIA

Guía paso a paso pensada para alguien con conocimientos técnicos básicos.

> **Importante:** la cámara **solo funciona bajo HTTPS**. Tanto Vercel como Netlify dan
> HTTPS automáticamente, así que publicar la app es la forma más sencilla de probarla en
> un celular real.

---

## 1. Antes de publicar

Verifica en local que todo esté correcto:

```bash
npm install
npm run lint
npm test
npm run build
```

Los cuatro comandos deben terminar sin errores.

**Nunca subas el archivo `.env.local`.** Ya está excluido en `.gitignore`. Solo se sube
`.env.example`, que no contiene claves reales.

---

## 2. Subir el proyecto a GitHub

Si el proyecto aún no está en GitHub:

```bash
git init
git add .
git commit -m "Primera versión de ColorIA"
```

Crea un repositorio vacío en <https://github.com/new> (sin README, sin .gitignore) y
luego conecta y sube:

```bash
git remote add origin https://github.com/TU-USUARIO/coloria.git
git branch -M main
git push -u origin main
```

---

## 3. Publicar en Vercel (opción recomendada)

Vercel es de los mismos creadores de Next.js, así que no requiere configuración extra.

1. Entra a <https://vercel.com> e inicia sesión con tu cuenta de GitHub.
2. Pulsa **Add New… → Project**.
3. Elige el repositorio `coloria` e **Import**.
4. Vercel detecta Next.js solo. **No cambies** Build Command ni Output Directory.
5. Antes de desplegar, abre **Environment Variables** y agrega (solo si vas a usar
   Supabase):

   | Nombre | Valor |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | La URL de tu proyecto de Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La `anon` key de Supabase |

   Si no configuras nada, la app funciona igual en modo invitado.

   El acceso a `/admin` **no** se configura con variables de entorno: se registra
   en la base de datos con `insert into public.admins (email) values ('tucorreo');`
6. Pulsa **Deploy** y espera 1-2 minutos.

Cada vez que hagas `git push` a `main`, Vercel vuelve a desplegar automáticamente.

### Dominio propio en Vercel

1. En el proyecto → **Settings → Domains → Add**.
2. Escribe tu dominio (por ejemplo `coloria.com`).
3. Vercel te muestra los registros DNS que debes crear en tu proveedor:
   - Dominio raíz → registro `A` apuntando a la IP que indique Vercel.
   - Subdominio `www` → registro `CNAME` apuntando a `cname.vercel-dns.com`.
4. Los cambios de DNS pueden tardar desde minutos hasta 24 horas.
5. El certificado HTTPS se emite solo, sin que hagas nada.

---

## 4. Alternativa: publicar en Netlify

1. Entra a <https://netlify.com> e inicia sesión con GitHub.
2. **Add new site → Import an existing project → GitHub** y elige `coloria`.
3. Confirma la configuración (el archivo `netlify.toml` incluido ya la define):
   - Build command: `npm run build`
   - Publish directory: `.next`
4. En **Site settings → Environment variables**, agrega las mismas variables de la
   tabla anterior si vas a usar Supabase.
5. **Deploy site**.

El plugin `@netlify/plugin-nextjs` (declarado en `netlify.toml`) se instala solo y es lo
que permite que Next.js funcione en Netlify.

---

## 5. Después de publicar

Prueba en un celular real, que es donde vivirá la app:

1. Abre la URL en Chrome (Android) y en Safari (iPhone).
2. Acepta el permiso de cámara y completa un análisis entero.
3. Prueba también **rechazando** el permiso: debe salir un mensaje claro y la opción
   de subir una foto desde la galería.
4. Descarga el PDF y ábrelo desde el celular.
5. Instálala como app:
   - **Android:** aparece el aviso "Instalar" o usa el menú → *Agregar a pantalla
     principal*.
   - **iPhone:** Safari no muestra aviso automático. Hay que usar
     *Compartir → Agregar a pantalla de inicio*. Es una limitación de iOS, no un fallo
     de la app.

---

## 6. Problemas frecuentes

| Síntoma | Causa y solución |
| --- | --- |
| La cámara no abre | Estás en `http://` en vez de `https://`. Publica la app o usa `localhost`. |
| "No detectamos un rostro" siempre | Poca luz o rostro muy lejos. Prueba con luz natural de frente. |
| El panel `/admin` dice acceso restringido | No has iniciado sesión, o tu correo no está en la tabla `admins`. |
| El panel `/admin` dice que no estás registrado como administradora | Ejecuta `insert into public.admins (email) values ('tucorreo');` con el mismo correo con el que inicias sesión. |
| El historial aparece vacío | El guardado es manual: hay que pulsar **Guardar en mi cuenta** en la pantalla de resultado. Como invitado nada se guarda. |
| El build falla en Vercel pero funciona en local | Revisa que las variables de entorno estén configuradas en Vercel. |

---

## 7. Al cambiar las reglas del algoritmo

Si editas los pesos en `data/classification-rules.ts`, sube también la constante
`ALGORITHM_VERSION` del mismo archivo. Así cada análisis guardado queda marcado con la
versión que lo generó y puedes comparar resultados entre versiones desde `/admin`.
