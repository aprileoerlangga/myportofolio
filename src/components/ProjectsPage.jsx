import React from 'react';
import Navbar from './Navbar';
import Projects from './Projects';
import Footer from './Footer';

function ProjectsPage() {
  return (
    <div className="text-white min-h-screen relative bg-[#060a17] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip">
      {/* Subtle Studio Deep Space Lighting Backdrop (0% CPU, pure CSS) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 65% at 75% 35%, rgba(0, 85, 191, 0.12), transparent 70%),
            radial-gradient(ellipse 70% 55% at 20% 30%, rgba(255, 213, 0, 0.07), transparent 65%),
            radial-gradient(circle 850px at 50% 115%, rgba(14, 165, 233, 0.08), transparent 70%)
          `,
        }}
      />
      
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
