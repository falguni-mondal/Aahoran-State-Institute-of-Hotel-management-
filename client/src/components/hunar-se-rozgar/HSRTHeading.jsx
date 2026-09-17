import React from "react";

const HSRTHeading = () => {
  return (
    <div className="overview-header flex flex-col items-center text-center my-16 md:my-24">
      <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 block">
        Overview
      </span>
      <h2 className="head-txt text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[var(--text-main)] tracking-tighter">
        Introduction
      </h2>
      <p className="mt-6 text-base md:text-xl lg:text-2xl font-light text-[var(--text-main)]/60 max-w-6xl">
        Hunar Se Rozgar Tak (HSRT) is a skill-development initiative aimed at
        empowering youth with industry-relevant training in hospitality and
        tourism. The programme provides practical, job-oriented training in
        areas such as Food Production, Food & Beverage Service, Housekeeping and
        Front Office, enabling participants to develop professional skills and
        improve their employability. Career Pathways: Graduates can pursue
        employment opportunities in hotels, restaurants, resorts, catering
        establishments, tourism enterprises and other hospitality-related
        sectors.
      </p>
    </div>
  );
};

export default HSRTHeading;
