"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MessageCircle, Sparkles } from "lucide-react";
import { HELP_CATEGORIES, FAQ_BY_CATEGORY } from "@/lib/help/data";
import FaqAccordion from "@/components/help/FaqAccordion";
import ContactModal from "@/components/help/ContactModal";

export default function BantuanPage() {
  const [query, setQuery] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredByCategory = useMemo(() => {
    if (!normalizedQuery) return FAQ_BY_CATEGORY;

    const result: typeof FAQ_BY_CATEGORY = {};
    for (const category of HELP_CATEGORIES) {
      const items = FAQ_BY_CATEGORY[category.slug].filter((item) =>
        item.question.toLowerCase().includes(normalizedQuery),
      );
      if (items.length > 0) result[category.slug] = items;
    }
    return result;
  }, [normalizedQuery]);

  const hasResults = Object.keys(filteredByCategory).length > 0;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Pusat Bantuan</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Temukan jawaban seputar pesanan, pembayaran, retur, akun, dan kebijakan produk BelanjAI.
      </p>

      <div className="relative mt-6">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari topik bantuan..."
          className="w-full rounded-2xl border border-line bg-card py-3.5 pl-11 pr-4 text-sm text-ink shadow-sm focus:border-brand focus:outline-none"
        />
      </div>

      {!normalizedQuery && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HELP_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                className="group rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.badge}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
                <p className="mt-4 text-base font-semibold text-ink">{category.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{category.description}</p>
              </a>
            );
          })}
        </div>
      )}

      <div className="mt-10 space-y-10">
        {!hasResults && (
          <p className="rounded-2xl border border-line bg-card p-6 text-center text-sm text-ink-soft">
            Tidak ada FAQ yang cocok dengan &quot;{query}&quot;. Coba kata kunci lain atau hubungi tim
            kami di bawah.
          </p>
        )}

        {HELP_CATEGORIES.map((category) => {
          const items = filteredByCategory[category.slug];
          if (!items || items.length === 0) return null;

          return (
            <section key={category.slug} id={category.slug} className="scroll-mt-20">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${category.badge}`}
                >
                  <category.icon size={16} aria-hidden="true" />
                </span>
                <h2 className="text-lg font-semibold text-ink">{category.name}</h2>
              </div>
              <div className="mt-4">
                <FaqAccordion items={items} />
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-12 rounded-2xl border border-line bg-card p-6 text-center">
        <h2 className="text-lg font-semibold text-ink">Masih butuh bantuan?</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Tim kami atau asisten AI kami siap membantu pertanyaan Anda lebih lanjut.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            <MessageCircle size={16} aria-hidden="true" /> Hubungi Kami
          </button>
          <Link
            href="/fitur/chatbot"
            className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <Sparkles size={16} aria-hidden="true" /> Chat dengan Asisten AI
          </Link>
        </div>
      </section>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
