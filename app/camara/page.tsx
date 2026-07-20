"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CameraCapture from "@/components/camera/CameraCapture";
import { PageShell } from "@/components/ui/PageShell";

export default function CamaraPage() {
  return (
    <PageShell>
      <div className="mb-4 flex items-center">
        <Link
          href="/preparacion"
          className="flex items-center gap-1 text-sm text-stone hover:text-clay-dark"
        >
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          Volver
        </Link>
      </div>
      <h1 className="mb-4 font-serif text-2xl font-semibold text-espresso">
        Toma tu selfie
      </h1>
      <CameraCapture />
    </PageShell>
  );
}
