import { Box, Typography, Container, Stack, Divider, Tooltip, Link, Paper, Grid, Button } from "@mui/material"; // Added Grid and Button
import { useEffect, useState, useRef, Suspense } from "react"; // Added useRef and Suspense
import { useTheme, createTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSpring, animated, useChain, useSpringRef, config } from "@react-spring/web";
import MattTimmButtonDesign from '../designed/WWJD2025_Buttons.png';
import KeychainSTL from '../designed/WWJD2025_Keychain1_STL.STL'; // Import the STL file
import KeychainSTEP from '../designed/WWJD2025_Keychain1_STEP.txt'; // Import the STEP file (assuming .txt is correct)
import BraceletsPDF from '../designed/WWJD2025_Bracelets.pdf'; // Import the PDF
import ModelViewer from './ModelViewer'; // Import the new ModelViewer component
import { useLocation } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf'; // Import react-pdf components
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Required CSS
import 'react-pdf/dist/esm/Page/TextLayer.css';     // Required CSS

// Configure pdfjs worker
// Use local worker file copied to the public folder
// pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// Correctly destructure props
const Print = ({ isMobile }) => {
  const itemsToRender = [
    {
      id: 0,
      type: 'pdf',
      src: BraceletsPDF,
      title: 'Printable Bracelets',
      downloadName: 'WWJD2025_Bracelets.pdf'
    },
    { 
      id: 2, 
      type: 'image', 
      src: MattTimmButtonDesign, 
      title: 'Button Maker Template'
    },
    {
      id: 3,
      type: '3dprint',
      stlSrc: KeychainSTL,
      stepSrc: KeychainSTEP,
      title: '3D Printable Keychain'
    },
  ];
  const wasteTooltipText = "We've created more waste as societies this decade than the prior 100 years with no signs of slowing down.";

  // Define colors for consistency
  const primaryTextColor = 'white';
  const linkColor = '#ffcc00';
  const subtleTextColor = 'rgba(255, 255, 255, 0.8)';
  const backgroundColor = 'hsla(0, 0%, 0%, 0.6)';
  const titleBackgroundColor = 'hsla(0, 0%, 0%, 0.7)';
  const dividerColor = 'rgba(255, 255, 255, 0.3)'; // Divider color definition remains
  const paperBackgroundColor = 'background.paper';

  // Used to reset animations on page load.
  const [animate, setAnimate] = useState(false);

  // Animation setup
  const titleRef = useSpringRef();
  const firstBlockRef = useSpringRef();
  const printableSectionRef = useSpringRef();
  const secondBlockRef = useSpringRef();

  // Keep original animation configs
  const animationConfigL = {
    from: { opacity: 0, transform: 'translateX(25%)' },
    to: { opacity: 1, transform: animate ? 'translateX(0%)' : 'translateX(25%)' },
    config: config.stiff,
    reset: true
  };
  const animationConfigR = {
    from: { opacity: 0, transform: 'translateX(-25%)' },
    to: { opacity: 1, transform: animate ? 'translateX(0%)' : 'translateX(-25%)' },
    config: config.stiff,
    reset: true
  };
  const fadeInAnimationConfig = {
    from: { opacity: 0 },
    to: { opacity: 1, },
    config: config.stiff,
    reset: true,
  };

  // Keep original useEffect logic
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setAnimate(!animate);
  }, []);

  // Keep original useSpring calls for content blocks
  const titleAnimation = useSpring(
    {
      ref: titleRef,
      ...animationConfigL
    });
  const firstBlockAnimation = useSpring(
    {
      ref: firstBlockRef,
      ...animationConfigR
    });

  // Apply the opacity-only animation and add overflow hidden
  const printableSectionAnimation = useSpring(
    {
      ref: printableSectionRef,
      ...fadeInAnimationConfig,
    }
  );

  const secondBlockAnimation = useSpring(
    {
      ref: secondBlockRef,
      ...animationConfigR
    });

  // Update useChain with explicit timings
  useChain([
    titleRef,
    firstBlockRef,
    printableSectionRef, // Apply delay to this ref
    secondBlockRef,
  ], [0, 0.1, 0.3, 0.4]); // Added explicit timings for a slight delay on the printable section

  return (
    <Box sx={{
      backgroundColor: backgroundColor,
      py: 6, // Vertical padding for the whole page
      color: primaryTextColor,
      mb: -2
    }}>
      {/* SEO Metadata Removed */}
      {/* <Helmet>
          <title>WWJD2025 Printables - DIY Merch for Project 2025 Awareness</title>
          <meta name="description" content="Download printable WWJD2025 designs (buttons, bracelets, 3D keychain) for DIY merch. Raise awareness about Project 2025 and Christian Nationalism." />
          <meta name="keywords" content="wwjd, w.w.j.d, project 2025, wwjd2025, print, download, merch, diy, christian nationalism, Jesus, awareness" />
      </Helmet> */}

      {/* Container centers content and limits max width */}
      <Container maxWidth="lg">
        {/* Main Stack manages vertical spacing and NOW handles dividers */}
        <Stack
          spacing={5}
          divider={<Divider sx={{ borderColor: dividerColor }} />} // ADDED divider prop
        >
          {/* Title Section */}
          <animated.div ref={titleRef} style={titleAnimation}>
            <Paper elevation={3} sx={{
              textAlign: "center",
              py: 3,
              px: 2,
              backgroundColor: titleBackgroundColor,
              color: primaryTextColor
            }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Print Merch!
              </Typography>
            </Paper>
          </animated.div>

          {/* First Text Block Section */}
          <animated.div style={firstBlockAnimation} ref={firstBlockRef}>
            <Box sx={{ px: { xs: 1, sm: 3 } }}>
              <Typography paragraph sx={{ lineHeight: 1.8, color: subtleTextColor }}>
                We believe the era of random, quickly disposed merch is
                {' '}
                <Tooltip title={wasteTooltipText} arrow placement="top">
                  <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                    no longer conscionable
                  </span>
                </Tooltip>
                .
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.7, color: subtleTextColor }}>
                We do however believe in the commons and community DIY. Here are some templates for printable wristbands, paper and 3D, and button inserts.
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.7, color: subtleTextColor }}>
                Many libraries have button punchers and printers (often including 3D), laminators and etc.
              </Typography>
              <Typography sx={{ lineHeight: 1.7, color: subtleTextColor }}>
                Find your closest library here:
                {' '}
                <Link
                  href="https://www.google.com/search?q=find+my+closest+public+library"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: linkColor, fontWeight: 'bold' }}
                >
                  Library Search
                </Link>
              </Typography>
            </Box>
          </animated.div>

          {/* Printable Designs Section */}
          <animated.div ref={printableSectionRef} style={printableSectionAnimation} sx={{ overflow: 'hidden' }}> {/* Added overflow: 'hidden' */}
            {/* This inner Stack remains as it was, arranging the title/text/Grid within this section */}
            <Stack spacing={3} alignItems="center" sx={{ px: { xs: 1, sm: 3 } }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Printable Designs
              </Typography>
              <Typography variant="body1" sx={{ color: subtleTextColor, textAlign: 'center' }}>
                Additional templates coming soon! Feel free to use these placeholders or create your own designs. <br /> Check your local library for printing resources.
              </Typography>

              <Grid container spacing={4} justifyContent="center" sx={{ width: '100%', mt: 2, alignItems: 'flex-start' }}> {/* Changed alignItems */}
                {itemsToRender.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}> {/* Added justifyContent center for vertical centering of column content */}
                    {/* Title above the Paper */}
                    <Box sx={{ bgcolor: 'hsla(0, 0%, 0%, 0.6)',
                      ...(isMobile && { mr: '10vw' }),
                      px: 1.5, py: 0.5, borderRadius: 1, mb: 1.5, display: 'inline-block' }}>
                      <Typography variant="h6" component="h3" 
                      sx={{ fontWeight: 'bold', textAlign: 'center', color: primaryTextColor,}}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Paper
                      variant="outlined"
                      square
                      sx={{
                        width: { xs: '90%', sm: '100%' }, 
                        maxWidth: { xs: '400px', sm: '100%' },
                        minHeight: !isMobile? '35vh' : '50vh',
                        bgcolor: item.type === '3dprint' ? 'black' : paperBackgroundColor,
                        borderColor: item.type === '3dprint' ? 'white' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        p: 1,
                        ...(isMobile && { mr: '10vw' }), 
                        ...(item.type === 'placeholder' || item.type === 'image') && { justifyContent: 'center' },
                        ...(item.type === '3dprint') && { justifyContent: 'center' }
                      }}
                    >
                      {item.type === 'placeholder' ? (
                        <Box sx={{ // This Box maintains aspect ratio and centers text
                          // aspectRatio: '210 / 297', // Removed fixed aspect ratio for placeholder to allow centering
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexGrow: 1 // Allow Box to grow to fill space for centering
                        }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              textAlign: 'center',
                              p: 1
                            }}
                          >
                            Printable Design {item.id}
                            <br />
                            (Placeholder)
                          </Typography>
                        </Box>
                      ) : item.type === 'image' ? (
                        <a href={item.src} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: 'auto' }}> {/* Adjust height for image */}
                          <img
                            src={item.src}
                            alt="Printable Design Preview"
                            style={{
                              display: 'block',
                              width: '100%',
                              height: 'auto', // Let height adjust based on width and aspect ratio
                              objectFit: 'contain',
                            }}
                          />
                        </a>
                      ) : item.type === 'pdf' ? (
                        // PDF Item: Render first page as preview inside a link
                        <a
                          href={item.src}
                          target="_blank" // Open PDF in new tab
                          rel="noopener noreferrer"
                          style={{ // Make link fill container and center content
                            display: 'flex', // Use flexbox on the link itself
                            flexDirection: 'column', // Stack content vertically (though only one item here)
                            alignItems: 'center', // Center horizontally
                            justifyContent: 'center', // Center vertically
                            width: '100%',
                            height: '100%', // Ensure link takes full height of Paper
                            textDecoration: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            overflow: 'hidden'
                          }}
                        >
                          <Document
                            file={item.src}
                            loading={<Typography sx={{ color: 'text.secondary' }}>Loading PDF preview...</Typography>}
                            error={<Typography sx={{ color: 'error.main' }}>Failed to load PDF preview.</Typography>}
                                                          onError={(error) => {}}
                            onLoadSuccess={({ numPages }) => {}}
                          >
                            <Page
                              pageNumber={1}
                              width={250}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </Document>
                        </a>
                      ) : item.type === '3dprint' ? (
                        // Container for 3D Print item
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {/* Replace image and tooltip with ModelViewer */}
                          <Box sx={{
                            width: '100%',
                            // Removed cursor and tooltip-related styling
                            // mb: 1, // Removed margin bottom to use space-between
                            height: '250px' // Ensure Box has height for Canvas
                             }}>
                             {/* Use Suspense for fallback while model loads */}
                             <Suspense fallback={<Typography>Loading 3D Model...</Typography>}>
                                <ModelViewer stlUrl={item.stlSrc} />
                             </Suspense>
                          </Box>
                          {/* Buttons container */}
                          <Stack direction="row" spacing={2} justifyContent="center" sx={{ width: '100%', mt: 1 }}>
                             {/* STEP Download Button */}
                             <Button
                              variant="outlined"
                              href={item.stepSrc}
                              download="WWJD2025_Keychain1.step" // Suggest a filename for download
                              sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                  borderColor: 'lightgray',
                                  bgcolor: 'rgba(211, 211, 211, 0.1)' // Optional: subtle background on hover
                                }
                              }}
                            >
                              Download .STEP
                            </Button>
                            {/* STL Download Button */}
                            <Button
                              variant="outlined"
                              href={item.stlSrc}
                              download="WWJD2025_Keychain1.stl" // Suggest a filename for download
                              sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                  borderColor: 'lightgray',
                                  bgcolor: 'rgba(211, 211, 211, 0.1)' // Optional: subtle background on hover
                                }
                              }}
                            >
                              Download .STL
                            </Button>
                          </Stack>
                        </Box>
                      ) : null /* Handle potential future types */}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </animated.div>

          {/* Second Text Block Section */}
          <animated.div ref={secondBlockRef} style={secondBlockAnimation}>
            <Box sx={{ px: { xs: 1, sm: 3 } }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', pb: '1.5em' }}>
                Why No Merch?
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                We decided that contributing to the problem of short-term and disposable consumption goes against our morality. Microplastics are now found in every human egg, every human testicle, and companies, often knowingly, poison the most susceptible of us (our children) to make a profit. As a society we have created more waste this decade than the previous century, the majority of which doesn't disappear.
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                To anyone still arguing against the science of climate change and the problems of overconsumption: please follow the money! Look into the preparations and investments the wealthy elite are making, and look into the history of the Heartland Institute's anti-climate propaganda, along with the handful of scientists that sold out.
                {" "}<Link
                  href="https://www.google.com/search?q=the+heartland+institute"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: linkColor, fontWeight: 'bold' }}
                >
                  Heartland Institute
                </Link>
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                The truth of the matter is that corporations will watch the planet burn and billions die in the name of profit. They are self enclosed at this point; just as we wouldn't convince bees to stop making honey, we will not convince companies to not make a profit.
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                What we can do is speed up the profitability of renewables by creating infrastructure for them, and moreover regulate and actually hold them accountable for bad practices.
              </Typography>
              <Typography sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
                How backwards it is to freely poison our crops and dump waste legally but to require endless loopholes and certifications to do things correctly, example: organic.
              </Typography>
            </Box>
          </animated.div>

        </Stack>
      </Container>
    </Box>
  );
};

export default Print;