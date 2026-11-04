import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import AwsCertCard from '../components/ui/AwsCertCard';
import LiveBadge from '../components/ui/LiveBadge';
import { CertGrid } from '../components/sections/Certifications';
import useCertifications from '../hooks/useCertifications';
import { ACHIEVEMENTS } from '../data/profile';

export default function CertificationsPage() {
  const { data, status } = useCertifications();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Certifications | Nimesha Yasith';
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-wrap">
        <SectionHeading as="h1" label="Credentials" title={<>My <span className="gradient-text">Certifications</span></>}
          lead={<>Professional certifications and credentials validating expertise across cloud, networking and security.</>}
          aside={<LiveBadge status={status} />}
          animate={false}
        />
      </div>

      <div className="page-wrap pb-20">
        <div className="max-w-5xl mx-auto mb-12">
          <AwsCertCard />
        </div>

        <CertGrid certs={data.filter((c) => !c.featured)} />

        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="section-title mb-5 text-center">
            Competitions &amp; <span className="gradient-text">Achievements</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.title} className="glass p-5">
                <h3 className="t-h3 mb-2">{a.title}</h3>
                <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
