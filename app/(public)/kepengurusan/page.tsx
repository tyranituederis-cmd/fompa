import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { KepengurusanList } from "./kepengurusan-list";

export const metadata: Metadata = { title: "Kepengurusan" };

export default function KepengurusanPage() {
  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Kepengurusan"
        title="Pengurus FOMPA"
        subtitle="Orang-orang hebat di balik setiap program FOMPA. Filter berdasarkan generasi dan bidang."
      />
      <KepengurusanList />
    </div>
  );
}
