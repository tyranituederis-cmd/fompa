"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/particle-background";

interface HeroProps {
  title: string;
  subtitle: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-dark dark:from-primary-dark dark:via-[#7f1d1d] dark:to-slate-950">
      <ParticleBackground />
      {/* Ornamen lingkaran blur */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />

      <div className="container relative z-10 flex flex-col items-center py-24 text-center">
        <motion.img
          src="/logo.jpg"
          alt="Logo FOMPA"
          className="mb-8 h-36 w-36 rounded-full object-contain shadow-2xl ring-4 ring-white/30 md:h-44 md:w-44"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        <motion.h1
          className="max-w-3xl text-4xl font-extrabold tracking-tight text-white drop-shadow-md md:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Link href="/tentang">
            <Button size="lg" variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto">
              Tentang Kami
            </Button>
          </Link>
          <Link href="/daftar">
            <Button size="lg" className="w-full bg-dark text-white hover:bg-slate-800 sm:w-auto">
              Gabung FOMPA <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-14 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Users className="h-4 w-4" />
          Menghubungkan puluhan sekolah se-Kabupaten Purwakarta
        </motion.div>
      </div>
    </section>
  );
}
