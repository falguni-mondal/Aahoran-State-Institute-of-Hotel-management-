import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Rules from "../pages/Rules";
import ComputerLab from "../pages/ComputerLab";
import FoodAndBeverage from "../pages/FoodAndBeverage";
import FoodProduction from "../pages/FoodProduction";
import FrontOffice from "../pages/FrontOffice";
import HouseKeeping from "../pages/HouseKeeping";
import ShortTermCourses from "../pages/ShortTermCourses";
import FullTermCourses from "../pages/FullTermCourses";
import HunarSeRozgar from "../pages/HunarSeRozgar";

const PageRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* ABOUT ROUTE GROUP */}
      <Route path="/about">
        <Route index element={<About />} />
        <Route path="rules" element={<Rules />} />
        <Route path="computer-lab" element={<ComputerLab />} />
      </Route>

      <Route path="/food-and-beverage" element={<FoodAndBeverage />} />
      <Route path="/food-production" element={<FoodProduction />} />
      <Route path="/front-office" element={<FrontOffice />} />
      <Route path="/house-keeping" element={<HouseKeeping />} />

      <Route path="/short-term-courses" element={<ShortTermCourses />} />
      <Route path="/full-term-courses" element={<FullTermCourses />} />
      <Route path="/hunar-se-rozgar" element={<HunarSeRozgar />} />
    </Routes>
  );
};

export default PageRouter;
