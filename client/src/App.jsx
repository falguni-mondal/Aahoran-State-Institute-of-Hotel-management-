import React from 'react';
import PageRouter from './routes/PageRouter';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

const App = () => {
  return (
    <div className='w-full max-w-[1920px] mx-auto relative'>
      <header className='w-full fixed top-0 left-0 z-50 flex justify-center'>
        <Navbar />
      </header>
      
      <main className='w-full'>
        <PageRouter/>
      </main>

      <Footer />
    </div>
  );
}

export default App;