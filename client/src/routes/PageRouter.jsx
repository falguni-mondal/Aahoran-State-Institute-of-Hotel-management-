import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'

const PageRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />

        {/* ABOUT */}
        <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default PageRouter