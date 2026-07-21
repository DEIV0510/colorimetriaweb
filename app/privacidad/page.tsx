import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { LegalSection } from "@/components/ui/LegalSection";
import { DeleteDataButtons } from "@/components/ui/DeleteDataButtons";

export const metadata: Metadata = {
  title: "Privacidad — ColorIA",
  description: "Cómo se procesa tu fotografía y tus datos en ColorIA.",
};

export default function PrivacidadPage() {
  return (
    <PageShell>
      <h1 className="mb-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
        Política de privacidad
      </h1>
      <p className="mb-8 text-sm text-ink-muted">
        Esta política describe el funcionamiento real de la aplicación. No constituye
        asesoría legal ni afirma cumplimiento garantizado con ninguna legislación
        específica.
      </p>

      <LegalSection title="Qué información se procesa">
        <p>
          ColorIA procesa una fotografía tipo selfie que tú tomas o subes, y las
          respuestas que das en el cuestionario (color natural de cabello, si está
          teñido, color de ojos, reacción de la piel al sol, preferencia de metal y
          percepción de contraste).
        </p>
        <p>
          Si creas una cuenta, también se almacenan tu correo electrónico y, si lo
          proporcionas, tu nombre.
        </p>
      </LegalSection>

      <LegalSection title="Para qué se utiliza la selfie">
        <p>
          La fotografía se usa exclusivamente para detectar el rostro, medir la calidad
          de la imagen y extraer valores de color de zonas visibles de la piel. Con esos
          valores y tus respuestas se calcula una estimación de colorimetría.
        </p>
        <p>
          La fotografía no se utiliza para reconocimiento de identidad, no se comparte
          con terceros y no se emplea para entrenar modelos.
        </p>
      </LegalSection>

      <LegalSection title="Cuándo se procesa localmente">
        <p>
          Todo el análisis (detección facial con MediaPipe, validación de calidad,
          extracción de color y clasificación) se ejecuta dentro de tu navegador. La
          fotografía no se envía a ningún servidor para realizar el análisis.
        </p>
      </LegalSection>

      <LegalSection title="Cuándo podría enviarse al servidor">
        <p>
          Si usas la aplicación como invitado, nada se envía a ningún servidor: ni la
          fotografía ni el resultado.
        </p>
        <p>
          Si has iniciado sesión, en la pantalla de resultado aparece el botón
          &ldquo;Guardar en mi cuenta&rdquo;. Solo al pulsarlo se envían el resultado y
          tus respuestas del cuestionario, para que puedas consultarlos en tu historial.
        </p>
        <p>
          La fotografía es una decisión aparte: se sube únicamente si además marcas la
          casilla &ldquo;Guardar también mi selfie&rdquo;, que viene desmarcada. Se
          almacena en un espacio privado al que solo accede tu propia cuenta, y se
          consulta mediante enlaces temporales.
        </p>
      </LegalSection>

      <LegalSection title="La fotografía no se guarda por defecto">
        <p>
          Por defecto, la selfie se conserva únicamente en el almacenamiento temporal de
          la sesión de tu navegador y desaparece al cerrar la pestaña o al pulsar
          &ldquo;Borrar mis datos&rdquo;.
        </p>
      </LegalSection>

      <LegalSection title="Cómo eliminar tus datos">
        <p>
          Puedes borrar la selfie temporal y el análisis actual en cualquier momento con
          los botones que aparecen más abajo o desde la pantalla de resultado. Si tienes
          una cuenta, puedes eliminar tu historial completo desde tu perfil.
        </p>
      </LegalSection>

      <LegalSection title="Cookies y almacenamiento local">
        <p>
          La aplicación usa el almacenamiento de sesión del navegador
          (<code className="rounded bg-blush-100 px-1">sessionStorage</code>) para
          mantener tu progreso mientras completas el flujo. Se borra al cerrar la
          pestaña.
        </p>
        <p>
          Si inicias sesión, además se guarda un token de sesión en
          {" "}
          <code className="rounded bg-blush-100 px-1">localStorage</code> (una clave que
          empieza por <code className="rounded bg-blush-100 px-1">sb-</code>) para no
          pedirte la contraseña en cada visita. Ese token contiene tu correo y persiste
          hasta que cierras sesión. El botón &ldquo;Eliminar todos mis datos&rdquo; de
          más abajo también cierra la sesión.
        </p>
        <p>No se utilizan cookies publicitarias ni de seguimiento de terceros.</p>
      </LegalSection>

      <LegalSection title="Edad mínima recomendada">
        <p>
          Se recomienda que el uso de la aplicación sea a partir de los 16 años, o con la
          supervisión de una persona adulta responsable.
        </p>
      </LegalSection>

      <LegalSection title="Limitaciones del análisis">
        <p>
          El resultado es una estimación orientativa. La iluminación, la cámara, la
          pantalla, el maquillaje residual y otros factores pueden alterar los colores
          medidos. No es un diagnóstico, no es un servicio médico y no sustituye una
          asesoría de imagen presencial.
        </p>
      </LegalSection>

      <LegalSection title="Cómo ejercer tus derechos">
        <p>
          Puedes eliminar tus datos tú mismo, sin intermediarios: con los botones que
          aparecen al final de esta página, o desde{" "}
          <strong>Mi cuenta</strong> si quieres borrar el historial completo.
        </p>
        <p>
          Si necesitas contactar con la persona responsable de esta instalación por otro
          motivo, usa el canal por el que llegaste a la aplicación. Al ser un proyecto de
          código abierto, cada despliegue lo administra una persona distinta.
        </p>
      </LegalSection>

      <div className="mt-8 rounded-2xl border border-line bg-white/60 p-5">
        <h2 className="mb-3 font-serif text-lg font-medium text-ink">
          Eliminar mis datos ahora
        </h2>
        <DeleteDataButtons />
      </div>
    </PageShell>
  );
}
