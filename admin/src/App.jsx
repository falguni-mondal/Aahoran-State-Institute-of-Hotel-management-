import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkAuthSession,
  selectIsInitializing,
} from './store/features/authSlice.js';
import SmoothScrollProvider from './providers/SmoothScrollProvider.jsx';
import PageRouter from './routes/PageRouter.jsx';

const App = () => {
  const dispatch = useDispatch();
  const isInitializing = useSelector(selectIsInitializing);

  // Trigger silent session recovery once on boot/refresh
  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);

  // Display institutional preloader during the handshake
  if (isInitializing) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F7F5F0] px-4 py-8 text-[#303030] sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 md:h-16 md:w-16 lg:h-18 lg:w-18 xl:h-18 xl:w-18 2xl:h-20 2xl:w-20">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#E6E2D8] border-t-[#E85D04]" />
            <span className="font-serif text-sm font-semibold tracking-wider text-[#303030] sm:text-base 2xl:text-lg">
              SIHM
            </span>
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-medium tracking-tight text-[#303030] sm:text-xl md:text-xl lg:text-2xl 2xl:text-3xl">
              State Institute of Hotel Management
            </h2>
            <p className="font-sans text-xs tracking-wider uppercase text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
              Verifying Security Clearance...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <div className="relative min-h-screen w-full bg-[#F7F5F0] font-sans text-[#303030] antialiased selection:bg-[#E85D04] selection:text-white">
          <PageRouter />
        </div>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
};

export default App;