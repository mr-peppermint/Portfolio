import Navbar from "@/components/Navbar";import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Work from "@/components/Work";
import Certificates from "@/components/Certificates";
import GithubSection from "@/components/GithubSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Ticker />
        <About />
        <Work />
        <Certificates />
        <GithubSection />
        <Contact />
      </main>

      <Footer />

      <noscript>
        <p className="noscript">
          This portfolio uses JavaScript for the particle intro and GitHub feed. Everything essential
          still reads without it.
        </p>
      </noscript>
    </>
  );
}
