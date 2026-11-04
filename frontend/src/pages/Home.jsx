import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import OpsTicker from '../components/sections/OpsTicker';
import AboutSnapshot from '../components/sections/AboutSnapshot';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Certifications from '../components/sections/Certifications';
import Blogs from '../components/sections/Blogs';
import Videos from '../components/sections/Videos';
import Architecture from '../components/sections/Architecture';
import Contact from '../components/sections/Contact';

export default function Home() {
  const { hash } = useLocation();

  // Deep links like /#contact or /#architecture (from other pages, or CloudShell's `goto`)
  useEffect(() => {
    document.title = 'Nimesha Yasith | Cloud & DevOps Engineer';
    if (!hash) return undefined;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 350);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <OpsTicker />
      <AboutSnapshot />
      <Skills />
      <Projects />
      <Experience />
      <Certifications />
      <Blogs />
      <Videos />
      <Architecture />
      <Contact />
      <Footer />
    </div>
  );
}
