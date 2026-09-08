import React from "react";
import Hero from "../components/home/hero/Hero";
import About from "../components/home/About";
import Pillars from "../components/home/Pillars";
import Departments from "../components/home/Departments";
import PrincipalMessage from "../components/home/PrincipalMessage";
import Facilities from "../components/home/Facilities";
import Partners from "../components/home/Partners";
import Placements from "../components/home/Placements";
import Placements2 from "../components/home/Placements2";
import Placements3 from "../components/home/Placements3";
import Placements4 from "../components/home/Placements4";
import Markers from "../components/home/Markers";

const Home = () => {
  return (
    <div id="homepage" className="w-full min-h-screen relative overflow-x-clip">
      <Hero />
      <About />
      <Pillars />
      <Departments />
      <PrincipalMessage />
      <Facilities />
      {/* <Markers /> */}
      {/* <Placements />
      <Placements2 />
      <Placements3 /> */}
      {/* <Placements4 /> */}
      <Partners />
    </div>
  );
};

export default Home;