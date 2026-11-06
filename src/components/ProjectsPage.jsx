import React from 'react';
import { useScroll } from 'framer-motion';
import Navbar from './Navbar';
import Projects from './Projects';
import Footer from './Footer';
import ProjectsBackground from './ProjectsBackground';

function ProjectsPage() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="text-white min-h-screen relative bg-[#060a17] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip">
      {/* Cinematic Classic Space Blueprint & Shipyard Telemetry Background */}
      <ProjectsBackground scrollYProgress={scrollYProgress} />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Projects />
        </main>
        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
