import { getProducts, getCategories, getSlider } from "@/lib/store";
import MusicProvider from "@/components/MusicProvider";
import CartProvider from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import Navbar from "@/components/Navbar";
import Campaign from "@/components/Campaign";
import Storefront from "@/components/Storefront";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories, slider] = await Promise.all([
    getProducts(),
    getCategories(),
    getSlider(),
  ]);

  return (
    <MusicProvider>
      <CartProvider>
        <main>
          <Navbar />
          <Campaign slides={slider} />

          <Storefront products={products} categories={categories} />

          <Footer />
        </main>
        <CartDrawer />
      </CartProvider>
    </MusicProvider>
  );
}
