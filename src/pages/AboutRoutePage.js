import React from 'react';
import { Helmet } from 'react-helmet-async';
import About from '../components/AboutPage'; // Assuming AboutPage.js exports About

const AboutRoutePage = () => {
  return (
    <>
      <Helmet>
        <title>About WWJD2025 - Confronting Project 2025 & Christian Nationalism</title>
        <meta name="description" content="Learn about WWJD2025, its mission to contrast the radical love of Jesus with Project 2025 policies and Christian Nationalism. What Would Jesus Do?" />
        <meta name="keywords" content="wwjd, w.w.j.d, project 2025, wwjd2025, Jesus, christian nationalism, about, mission" />
        {/* Add other meta tags like canonical, og:tags if needed, similar to your example */}
        <link rel="canonical" href="https://wwjd2025.com/about" /> {/* Assuming your domain */}
        <meta property="og:title" content="About WWJD2025 - Confronting Project 2025 & Christian Nationalism" />
        <meta property="og:description" content="Learn about WWJD2025, its mission to contrast the radical love of Jesus with Project 2025 policies and Christian Nationalism." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wwjd2025.com/about" /> {/* Assuming your domain */}
        {/* <meta property="og:image" content="your-og-image-for-about-page.jpg" /> */}
      </Helmet>
      <About />
    </>
  );
};

export default AboutRoutePage; 