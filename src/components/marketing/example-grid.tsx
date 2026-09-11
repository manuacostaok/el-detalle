"use client";

import Link from "next/link";
import { GiftCard } from "@/components/gift/gift-card";
import { RevealSection } from "@/components/motion/reveal-section";
import { encodePayload } from "@/lib/payload";
import type { GiftPagePayload } from "@/lib/domain";

const EXAMPLES: GiftPagePayload[] = [
  {
    occasion: "pareja",
    from: "Juan",
    to: "Cande",
    date: "2019-06-14",
    title: "Nuestra historia",
    message: "Desde que te conocí, cada día tiene algo mejor.",
    song: "",
    photo: "",
    theme: "romantico",
    plan: "premium",
  },
  {
    occasion: "amistad",
    from: "Mica",
    to: "León",
    date: "2014-03-02",
    title: "Diez años de código compartido",
    message: "De todas las personas que pude cruzarme, me alegra que hayas sido vos.",
    song: "",
    photo: "",
    theme: "divertido",
    plan: "premium",
  },
  {
    occasion: "familia",
    from: "Los Rossi",
    to: "la familia",
    date: "1998-11-20",
    title: "Nuestra familia",
    message: "Esta familia empezó hace un tiempo y no para de crecer.",
    song: "",
    photo: "",
    theme: "boho",
    plan: "free",
  },
  {
    occasion: "mascota",
    from: "Fede",
    to: "Simón",
    date: "2022-01-08",
    title: "Para vos, con patas",
    message: "Llegaste a esta casa y la cambiaste para siempre.",
    song: "",
    photo: "",
    theme: "minimal",
    plan: "free",
  },
  {
    occasion: "aniversario",
    from: "Ana",
    to: "Tomás",
    date: "2015-09-27",
    title: "Once años juntos",
    message: "Hoy cumplimos otro año de historia juntos.",
    song: "",
    photo: "",
    theme: "nocturno",
    plan: "premium",
  },
  {
    occasion: "pareja",
    from: "Sole",
    to: "Fran",
    date: "2021-02-14",
    title: "Nuestra historia",
    message: "Cada día con vos es una razón más para seguir escribiendo esto.",
    song: "",
    photo: "",
    theme: "minimal",
    plan: "free",
  },
];

export function ExampleGrid() {
  return (
    <RevealSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {EXAMPLES.map((payload, i) => (
        <Link
          key={i}
          href={`/r/${encodePayload(payload)}`}
          target="_blank"
          className="block transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1"
        >
          <GiftCard payload={payload} compact />
        </Link>
      ))}
    </RevealSection>
  );
}
