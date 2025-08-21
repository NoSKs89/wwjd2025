import React from 'react';
import { Helmet } from 'react-helmet-async';
import Print from '../components/PrintPage'; // Assuming PrintPage.js exports Print

// The Print component expects an isMobile prop. 
// We need to decide how to pass this. For now, let's assume it's passed down or determined here.
// For simplicity, let's replicate the logic from App.js or make it a fixed value if appropriate.
// This might need adjustment based on how `isMobile` is truly determined for this route.

const PrintRoutePage = ({ isMobile }) => { // Added isMobile prop
  return (
    <>
      <Helmet>
        <title>WWJD2025 Printables - DIY Merch for Project 2025 Awareness</title>
        <meta name="description" content="Download printable WWJD2025 designs (buttons, bracelets, 3D keychain) for DIY merch. Raise awareness about Project 2025 and Christian Nationalism." />
        <meta name="keywords" content="wwjd, w.w.j.d, project 2025, wwjd2025, print, download, merch, diy, christian nationalism, Jesus, awareness" />
        <link rel="canonical" href="https://wwjd2025.com/print" /> {/* Assuming your domain */}
        <meta property="og:title" content="WWJD2025 Printables - DIY Merch" />
        <meta property="og:description" content="Download printable WWJD2025 designs for DIY merch to raise awareness." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wwjd2025.com/print" /> {/* Assuming your domain */}
        {/* <meta property="og:image" content="your-og-image-for-print-page.jpg" /> */}
      </Helmet>
      <Print isMobile={isMobile} /> {/* Pass isMobile to the Print component */}
    </>
  );
};

export default PrintRoutePage; 