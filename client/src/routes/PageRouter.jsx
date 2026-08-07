import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Rules from '../pages/Rules'
import ComputerLab from '../pages/ComputerLab'

const PageRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />

        {/* ABOUT ROUTE GROUP */}
        <Route path="/about">
            <Route index element={<About />} />
            <Route path="rules" element={<Rules />} />
        </Route>

        <Route path="/computer-lab" element={<ComputerLab />} />

    </Routes>
  )
}

export default PageRouter