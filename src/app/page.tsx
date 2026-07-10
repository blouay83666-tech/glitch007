import { getProducts, getCategories, getSlider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Campaign from "@/components/Campaign";
import Storefront from "@/components/Storefront";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const stats = [
  { value: "260 GSM", label: "Heavyweight cotton" },
  { value: "Hand-finished", label: "Gold broderie" },
  { value: "48h", label: "Nationwide delivery" },
  { value: "2026", label: "Neo-street capsule" },
];

export default async function Home() {
  const [products, categories, slider] = await Promise.all([
    getProducts(),
    getCategories(),
    getSlider(),
  ]);

  return (
    <main>
      <Navbar />
      <Hero />
      <Campaign slides={slider} />

      {/* marquee stats */}
      <section id="about" className="border-y border-neutral-900 bg-black py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="serif-title text-2xl text-gold md:text-3xl">{s.value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-neutral-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Storefront products={products} categories={categories} />

      <Footer />
    </main>
  );
}
