import Navbar from './Navbar';
import Contact from './Contact';
import Footer from './Footer';

function ContactPage() {
  return (
    <div className="text-white min-h-screen relative bg-[#090b12] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip">
      {/* Cinematic Lego Movie Backdrop Lighting */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 75% 30%, rgba(255, 213, 0, 0.08), transparent 70%),
            radial-gradient(ellipse 70% 50% at 20% 40%, rgba(0, 85, 191, 0.07), transparent 65%),
            radial-gradient(circle 800px at 50% 100%, rgba(227, 0, 11, 0.04), transparent 70%),
            #090b12
          `
        }}
      />


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
