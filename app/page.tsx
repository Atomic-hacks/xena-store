import Discover from "@/components/Discover";
import { Hero } from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";



export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero  />
      <Discover/>
      <Footer/>
    </div>
  );
}
