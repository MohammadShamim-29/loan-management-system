import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <About />
                {/* Additional sections can be added here (e.g., About, Testimonials) */}
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
