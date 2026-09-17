import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading } from "@/components/section-heading";
import { AgendaView } from "./agenda-view";

export const metadata: Metadata = { title: "Agenda" };
export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const supabase = await createClient();
  const [agendaRes, settingsRes] = await Promise.all([
    supabase.from("agenda").select("*").order("tanggal"),
    supabase.from("settings").select("value").eq("key", "site").maybeSingle(),
  ]);

  const calendarEmbed = String(
    ((settingsRes.data?.value as Record<string, unknown>) ?? {}).google_calendar_embed ?? ""
  );

  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Agenda"
        title="Kalender Kegiatan"
        subtitle="Event mendatang, deadline, dan lokasi kegiatan FOMPA — lengkap dengan countdown otomatis."
      />
      <AgendaView initial={agendaRes.data ?? []} calendarEmbed={calendarEmbed} />
    </div>
  );
}
