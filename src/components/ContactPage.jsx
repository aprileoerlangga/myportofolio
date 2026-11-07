import Navbar from './Navbar';
import Contact from './Contact';
import Footer from './Footer';

function ContactPage() {
  return (
    <div className="text-white min-h-screen relative bg-[#060a17] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip">
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CLASSIC SPACE COSMIC BACKDROP (HARMONIZED WITH ABOUT & LOADING)        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 1. Deep Orbital Void & Nebula Lighting (Royal Blue, Cosmic Violet & Solar Amber) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle 950px at 80% 20%, rgba(0, 85, 191, 0.30), transparent 70%),
              radial-gradient(circle 850px at 15% 45%, rgba(121, 40, 202, 0.22), transparent 65%),
              radial-gradient(circle 1000px at 50% 90%, rgba(255, 213, 0, 0.12), transparent 70%),
              linear-gradient(180deg, #060a17 0%, #0a0e22 55%, #040711 100%)
            `
          }}
        />

        {/* 2. Universal Twinkling Space Stars Field */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 25px 35px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 120px 80px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 240px 190px, #ffd500, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 380px 120px, #61dafb, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 490px 310px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 620px 220px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 750px 90px, #ffd500, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 890px 270px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 1020px 150px, #61dafb, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 1180px 320px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 1310px 180px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 1410px 70px, #ffd500, rgba(0,0,0,0))
            `,
            backgroundSize: '1440px 420px'
          }}
        />

        {/* 3. Stylized Classic Space Celestial Planet (Top-Right) */}
        <div 
          className="absolute top-8 -right-20 md:right-4 w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none opacity-75"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.85) 0%, rgba(0, 85, 191, 0.8) 45%, rgba(121, 40, 202, 0.85) 75%, rgba(255, 0, 128, 0.7) 100%)',
            boxShadow: '0 0 55px rgba(0, 240, 255, 0.32), inset -20px -20px 40px rgba(0, 0, 0, 0.85), inset 15px 15px 30px rgba(255, 255, 255, 0.35)',
            transform: 'translateZ(0)',
          }}
        >
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)'
            }}
          />
        </div>

        {/* 4. Classic Space Perspective Cyber Launchpad Grid on Floor */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[420px] pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.35) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(255, 213, 0, 0.25) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '54px 54px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
            transform: 'perspective(550px) rotateX(52deg)',
            transformOrigin: 'bottom center'
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default ContactPage;
