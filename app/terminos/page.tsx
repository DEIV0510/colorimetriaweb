import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { LegalSection } from "@/components/ui/LegalSection";

export const metadata: Metadata = {
  title: "Términos — ColorIA",
  description: "Términos y condiciones de uso de ColorIA.",
};

export default function TerminosPage() {
  return (
    <PageShell>
      <h1 className="mb-2 font-serif text-2xl font-semibold text-espresso sm:text-3xl">
        Términos y condiciones
      </h1>
      <p className="mb-8 text-sm text-stone">
        Al usar ColorIA aceptas las condiciones descritas a continuación.
      </p>

      <LegalSection title="Naturaleza del servicio">
        <p>
          ColorIA ofrece una estimación orientativa de colorimetría personal a partir de
          una fotografía y un cuestionario. No es un diagnóstico, no es un servicio
          médico ni de salud, y no sustituye la asesoría de un profesional de imagen.
        </p>
      </LegalSection>

      <LegalSection title="Uso correcto">
        <p>
          Debes usar únicamente fotografías propias o de personas que hayan autorizado
          expresamente su uso. No está permitido usar la aplicación para analizar
          imágenes de terceros sin su consentimiento.
        </p>
      </LegalSection>

      <LegalSection title="Precisión del resultado">
        <p>
          El resultado depende de la calidad de la fotografía, la iluminación, la cámara
          y la sinceridad de las respuestas del cuestionario. No garantizamos exactitud y
          el resultado puede variar entre intentos.
        </p>
      </LegalSection>

      <LegalSection title="Cuenta de usuario">
        <p>
          Puedes usar la aplicación como invitado sin crear cuenta. Si creas una cuenta,
          eres responsable de mantener la confidencialidad de tus credenciales.
        </p>
      </LegalSection>

      <LegalSection title="Propiedad del contenido">
        <p>
          Conservas todos los derechos sobre tus fotografías. La aplicación no reclama
          propiedad sobre las imágenes que procesas.
        </p>
      </LegalSection>

      <LegalSection title="Limitación de responsabilidad">
        <p>
          El servicio se ofrece &ldquo;tal cual&rdquo;. No nos hacemos responsables de
          decisiones de compra, estilo o imagen tomadas con base en el resultado.
        </p>
      </LegalSection>

      <LegalSection title="Cambios en los términos">
        <p>
          Estos términos pueden actualizarse. El uso continuado de la aplicación implica
          la aceptación de la versión vigente.
        </p>
      </LegalSection>
    </PageShell>
  );
}
