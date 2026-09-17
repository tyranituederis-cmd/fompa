import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { PendaftaranForm } from "./pendaftaran-form";

export const metadata: Metadata = { title: "Gabung FOMPA" };

export default function DaftarPage() {
  return (
    <div className="container max-w-2xl py-16">
      <SectionHeading
        eyebrow="Open Recruitment"
        title="Gabung FOMPA"
        subtitle="Isi formulir di bawah ini untuk mendaftar menjadi pengurus FOMPA. Status pendaftaran dapat dipantau melalui email."
      />
      <PendaftaranForm />
    </div>
  );
}
