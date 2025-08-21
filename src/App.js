import { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AboutRoutePage from "./pages/AboutRoutePage";
import PrintRoutePage from "./pages/PrintRoutePage";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PrintPage from "./components/PrintPage";
import About from "./components/AboutPage";
import Timeline from "./components/Timeline";
import TimelineMobile from "./components/TimelineMobile";
import TheGuardian from './icons/TheGuardian.png';
import NYT from './icons/NYT.png';
import StarTribune from './icons/StarTribune.jpeg';
import WashingtonPost from './icons/WashingtonPost.png';
import WhiteHouse from './icons/TheWhiteHouse.png';
import ProPublica from './icons/ProPublica.jpeg';
import NPR from './icons/NPR.png';
import EPA from './icons/EPA.png';
import Politico from './icons/Politico.png';
import Project2025 from './icons/Project2025.png';
import Project2025Favicon from './icons/Project2025Favicon.png';
import APNews from './icons/APNews.svg';
import NEA from './icons/NEA.png';
import IFJ from './icons/IFJ.svg';
import Axios from './icons/Axios.png';
import SIcon from './icons/SIcon.png';
import TheHill from './icons/TheHill.png';
import MSNBC from './icons/MSNBC.png';
import SEC from './icons/SEC.svg';
import CBS from './icons/CBS.png';
import ABC from './icons/ABC.png';
import Forbes from './icons/forbes-icon.svg';
import CNN from './icons/CNN.png';
import Brookings from './icons/Brookings.png';
import Peer from './icons/Peer.png';
import WasteDive from './icons/Wastedive.png';
import MinistryWatch from './icons/ministrywatch.png';
import Reuters from './icons/Reuters.png';
import UMNews from './icons/UMNews.ico';
import NBC from './icons/NBC.png';
import FirstFocus from './icons/first-focus-logo.png';
import UCS from './icons/UCS.png';
import SierraClub from './icons/SierraClub.jpg';
import Newsweek from './icons/newsweek.png';
import DOTW from './icons/doctorsoftheworld.png';
import Akin from './icons/akindump.ico';
import Greenpeace from './icons/greenpeace.jpg';
import Earthjustice from './icons/earthjustice.jpg';
import wlrn from './icons/wlrn.jpg';
import ReproductiveRights from './icons/reproductiverights.jpg';
import DOL from './icons/dol.svg';
import LawReview from './icons/lawreview.jpg';
import Whyy from './icons/whyy.jpg';
import Grist from './icons/grist.png';
import CAP from './icons/cap.png';
import FA from './icons/faithalliance.jpeg';
import USResist from './icons/usresist.png';
import DOI from './icons/doi.png';
import GlobalEnergyPolicy from './icons/energypolicy.png';
import data from './/data.js';
import ShaderBackground from "./components/ShaderScene.jsx";
import { useSpring, animated, config } from "@react-spring/web";

const sourceIconMap = {
  "New York Times": NYT,
  "NY Times": NYT, "Interfaith Alliance":FA, "USResist":USResist, "Dept of Interior":DOI,
  "The Guardian": TheGuardian, "American Progress":CAP, "Global Energy Policy":GlobalEnergyPolicy,
  "Star Tribune": StarTribune,
  "Washington Post": WashingtonPost,
  "White House": WhiteHouse,
  "ProPublica": ProPublica, "Pro Publica":ProPublica,
  "NPR": NPR,
  "EPA": EPA,
  "Politico": Politico,
  "Project 2025": Project2025Favicon,
  "AP News": APNews,
  "NEA": NEA,
  "IFJ": IFJ,
  "Axios": Axios,
  "Statnews": SIcon,
  "The Hill": TheHill,
  "MSNBC": MSNBC,
  "SEC": SEC,
  "ABC": ABC,
  "Forbes": Forbes,
  "KUOW": NPR,
  "Waste Dive": WasteDive,
  "Ministry Watch": MinistryWatch,
  "UMNews": UMNews,
  "Reuters": Reuters,
  "CNN": CNN,
  "NBC": NBC, "CBS News": CBS, "Brookings": Brookings, "Peer": Peer, "First Focus": FirstFocus, "UCS": UCS, "Sierra Club": SierraClub,
  "Newsweek": Newsweek, "DOTW":DOTW, "Greenpeace":Greenpeace, "Earth Justice": Earthjustice, "Akingump":Akin, "WLRN":wlrn, 
  "Center For Reproductive Rights":ReproductiveRights, "Department of Labor":DOL, "National Law Review":LawReview, "Whyy":Whyy,
  "ESG Dive": WasteDive, "Grist":Grist
};

const AnimatedBox = animated(Box);

function App() {
  const theme = useTheme();
  const currentIsMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isMobileLandscape = currentIsMobile && isLandscape;
  const [initialIsMobile] = useState(currentIsMobile);
  const location = useLocation();
  const [fadeState, setFadeState] = useState('idle');
  const [runNavBarAnimation, setRunNavBarAnimation] = useState(false);
  // State for window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const titles = ["WWJD2025 ✟", "What Would Jesus Do?"];

  // Effect to track window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    // Call handler once initially to set correct width
    handleResize(); 
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  // Alert the state values
  // alert(`Navbar State: Mobile=${currentIsMobile}, Landscape=${isLandscape}, MobileLandscape=${isMobileLandscape}`); // Use alerts sparingly for debug

  useEffect(() => {
    const timer = setTimeout(() => {
      setRunNavBarAnimation(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let titleIndex = 0;
    document.title = titles[titleIndex];

    const intervalId = setInterval(() => {
      titleIndex = (titleIndex + 1) % titles.length;
      document.title = titles[titleIndex];
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const isOnPrintOrAbout = location.pathname === "/print" || location.pathname === "/about";
  //   setFadeState(isOnPrintOrAbout ? 'in' : 'idle');
  //
  //   if (currentIsMobile && location.pathname === "/") {
  //     document.body.style.overflowY = "hidden";
  //   } else {
  //     document.body.style.overflowY = "";
  //   }
  // }, [location.pathname, currentIsMobile]);

  const triggerShaderEffect = useCallback((isMobileOnly) => {
    if (!isMobileOnly || location.pathname !== "/") return;

    setFadeState('in');

    const fadeOutTimer = setTimeout(() => {
      setFadeState('out'); 
    }, 750);

    const resetTimer = setTimeout(() => {
      setFadeState(prevState => prevState === 'out' ? 'idle' : prevState); 
    }, 1750);

    return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(resetTimer);
    };
  }, [location.pathname]);

  const [navBarSpring, navBarApi] = useSpring(() => ({ 
    from: { opacity: 0, transform: 'translateY(100%)' },
    config: config.wobbly,
  }));

  useEffect(() => {
    navBarApi.start({ 
      to: {
        opacity: runNavBarAnimation ? 1 : 0,
        transform: runNavBarAnimation ? 'translateY(0%)' : 'translateY(100%)'
      },
    });

  }, [runNavBarAnimation, navBarApi]);

  const typeFace = currentIsMobile ?  '"Arial", sans-serif' :  '"Major Mono Display", monospace';
  // const calculatedGap = isMobileLandscape ? "2vw" : (currentIsMobile ? "3rem" : '20rem');
  
  // New dynamic gap calculation
  const calculateGap = () => {
    if (isMobileLandscape) return "2vw";
    if (currentIsMobile) return "3rem";

    // Desktop calculation (gap INCREASES as width increases)
    const minDesktopWidth = 600; // Approx theme.breakpoints.values.sm
    const maxDesktopWidth = 1800; // Adjust as needed for max screen size
    // Swap min/max gap values and rename for clarity
    const narrowDesktopGap = 4;  // Min gap in rem at minDesktopWidth
    const wideDesktopGap = 30; // Max gap in rem at maxDesktopWidth (Increased to 30rem)

    const widthRange = maxDesktopWidth - minDesktopWidth;
    const currentPosInWidthRange = Math.max(0, Math.min(widthRange, windowWidth - minDesktopWidth));
    const t = widthRange === 0 ? 0 : currentPosInWidthRange / widthRange; // Avoid division by zero

    // Interpolate from narrow to wide gap
    let desktopGap = narrowDesktopGap + t * (wideDesktopGap - narrowDesktopGap); 
    // Clamp the value (using the correct min/max)
    desktopGap = Math.max(narrowDesktopGap, Math.min(wideDesktopGap, desktopGap)); 

    return `${desktopGap}rem`;
  };

  const calculatedGap = calculateGap();

  // alert(`Calculated Gap: ${calculatedGap}`); // Use alerts sparingly for debug

  const navBarSxProp = { 
      color: "white",
      p: currentIsMobile ? 0.5 : 1.5,
      display: "flex",
      justifyContent: "center",
      gap: calculatedGap, 
      fontSize: "1.1em",
      fontWeight: "bold",
      position: "fixed",
      bottom: 0,
      width: "100%",
      zIndex: 4,
      background: 'linear-gradient(to top, hsla(0, 0%, 0%, 1) 0%, hsla(0, 0%, 0%, 0.3) 100%)',
    };



  // Determine if the shader should be forced visible (on About/Print pages)
  const forceShaderVisible = location.pathname === "/print" || location.pathname === "/about";

  // Determine the class for the shader container
  const shaderContainerClass = `shader-background ${
    forceShaderVisible ? 'shader-fade-in' : `shader-fade-${fadeState}` // Force 'in' on Print/About
  }`;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>WWJD2025 - What Would Jesus Do About Project 2025?</title>
        <meta name="description" content="Exploring the juxtaposition of Jesus' teachings with Project 2025 and Christian Nationalism. What Would Jesus Do?" />
        <meta name="keywords" content="wwjd, w.w.j.d, project 2025, wwjd2025, Jesus, christian nationalism, timeline, policies" />
        <meta property="og:title" content="WWJD2025 - What Would Jesus Do?" />
        <meta property="og:description" content="A critical look at Project 2025 through the lens of Jesus' teachings." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wwjd2025.com" />
      </Helmet>

      <div className={shaderContainerClass} >
        {((currentIsMobile && !(isLandscape && location.pathname === "/")) || forceShaderVisible) &&
          <ShaderBackground />
        }
      </div>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexGrow: 1, paddingBottom: !currentIsMobile ? '60px' : '0px' }}>
          <Routes>
            <Route path="/" element={
              <>
                <Helmet>
                  <title>WWJD2025 Timeline - Project 2025 & Jesus' Teachings</title>
                  <meta name="description" content="Interactive timeline comparing Project 2025 policy proposals with the words and actions of Jesus. What would Jesus do?" />
                  <link rel="canonical" href="https://wwjd2025.com/" />
                  <meta property="og:title" content="WWJD2025 Timeline - Project 2025 & Jesus' Teachings" />
                  <meta property="og:description" content="Interactive timeline comparing Project 2025 policy proposals with the words and actions of Jesus." />
                  <meta property="og:url" content="https://wwjd2025.com/" />
                </Helmet>
                {!initialIsMobile ? <Timeline data={data} sourceIconMap={sourceIconMap} onTransition={() => {}} />
                               : <TimelineMobile 
                                    onTransition={triggerShaderEffect} 
                                    data={data} 
                                    sourceIconMap={sourceIconMap} 
                                 />}
              </>
            }/>
            <Route path="/print" element={<PrintRoutePage isMobile={currentIsMobile} />} />
            <Route path="/about" element={<AboutRoutePage />} />
          </Routes>
        </Box>

        <AnimatedBox
          style={navBarSpring}
          sx={navBarSxProp}
        >
          <Link
            to="/about"
            style={{
              color: "white",
              textDecoration: "none",
              transition: "border-bottom 0.3s ease-out",
              display: "inline-block",
              textAlign: "center",
              minWidth: "80px",
              fontFamily: typeFace,
              borderBottom: '1px solid transparent',
              paddingBottom: '3px'
            }}
            onMouseEnter={(e) => { e.target.style.borderBottom = '1px solid white'; }}
            onMouseLeave={(e) => { e.target.style.borderBottom = '1px solid transparent'; }}
          >
            {location.pathname === '/about' || currentIsMobile ? 'ABOUT' : 'about'}
          </Link>
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              transition: "border-bottom 0.3s ease-out",
              display: "inline-block",
              textAlign: "center",
              minWidth: "80px",
              fontFamily: typeFace,
              borderBottom: '1px solid transparent',
              paddingBottom: '3px'
            }}
            onMouseEnter={(e) => { e.target.style.borderBottom = '1px solid white'; }}
            onMouseLeave={(e) => { e.target.style.borderBottom = '1px solid transparent'; }}
          >
            {location.pathname === '/' || currentIsMobile ? 'TIMELINE' : 'timeline'}
          </Link>
          <Link
            to="/print"
            style={{
              color: "white",
              textDecoration: "none",
              transition: "border-bottom 0.3s ease-out",
              display: "inline-block",
              textAlign: "center",
              minWidth: "80px",
              fontFamily: typeFace,
              borderBottom: '1px solid transparent',
              paddingBottom: '3px'
            }}
            onMouseEnter={(e) => { e.target.style.borderBottom = '1px solid white'; }}
            onMouseLeave={(e) => { e.target.style.borderBottom = '1px solid transparent'; }}
          >
            {location.pathname === '/print' || currentIsMobile ? 'PRINT' : 'print'}
          </Link>
        </AnimatedBox>

      </Box>
    </>
  );
}

export default function WrappedApp() {
  return (
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  );
}