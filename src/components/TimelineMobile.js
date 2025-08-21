import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useGesture } from "@use-gesture/react";
import { Box, Card, CardContent, Button, Typography, IconButton, Tooltip } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MultiSelect from "./Multiselect";
import "../App.css";
import { useSpring, animated, useTransition, config, useSpringRef, useChain } from "@react-spring/web";
import EventCard from './EventCard';
import WWJDLogo from '../designed/WWJD2025_Logo_On_White.png';
import CloseIcon from '@mui/icons-material/Close';
import StaticShader from './StaticShader';
import { Helmet } from 'react-helmet-async';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Commented out
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Commented out

const AnimatedCard = animated(Card);
const AnimatedBox = animated(Box);

// Main Timeline Component with Scroll Logic
const Timeline = ({ onTransition, data: initialData, sourceIconMap }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [tagsSelected, setSelectedTags] = useState([]);
    const [filterStatus, setFilterStatus] = useState([]);
    const [animateWWJD, setAnimateWWJD] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLandscape, setIsLandscape] = useState(window.matchMedia("(orientation: landscape)").matches);
    const [boundaryIndicator, setBoundaryIndicator] = useState(null);
    // const [showArrow, setShowArrow] = useState(false); // Commented out
    const boundaryTimerRef = useRef(null);

    // Ref and State for measuring Sort button
    const sortButtonWrapperRef = useRef(null);
    const [sortButtonSize, setSortButtonSize] = useState({ width: 0, height: 0 });

    // Effect to listen for orientation changes and manage body overflow
    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: landscape)");
        const handleOrientationChange = (event) => {
            const landscape = event.matches;
            setIsLandscape(landscape);
            document.body.style.overflow = landscape ? 'hidden' : ''; // Toggle body overflow
        };

        // Add listener
        mediaQuery.addEventListener('change', handleOrientationChange);

        // Initial check and style set
        const initialLandscape = mediaQuery.matches;
        setIsLandscape(initialLandscape);
        document.body.style.overflow = initialLandscape ? 'hidden' : '';

        // Cleanup listener and reset style
        return () => {
            mediaQuery.removeEventListener('change', handleOrientationChange);
            document.body.style.overflow = ''; // Ensure overflow is reset on unmount
        };
    }, []);

    // NEW Effect: Manage body overflow specifically for mobile portrait view
    useEffect(() => {
      if (isMobile && !isLandscape) {
        document.body.style.overflowY = 'hidden';
      } else {
        // Reset if not mobile or if landscape
        document.body.style.overflowY = '';
      }

      // Cleanup function to reset overflow when component unmounts or conditions change
      return () => {
        document.body.style.overflowY = '';
      };
    }, [isMobile, isLandscape]); // Rerun when mobile status or orientation changes

    useEffect(() => {
        // Scroll to top only works well in portrait
        if (!isLandscape) {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    }, [isLandscape]);

    const [isAscending, setIsAscending] = useState(false);

    const tagList = useMemo(() =>
        Array.from(new Set(initialData.flatMap((e) => e.tags))).sort()
    , [initialData]);

    const tagListCount = useMemo(() => {
        const tagCounts = initialData.reduce((acc, item) => {
            item.tags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
            return acc;
        }, {}); // No type annotation needed
    
        return Object.entries(tagCounts)
            .map(([tag, count]) => `${tag} (${count})`)
            .sort();
      }, [initialData]);

    // Memoize toggleSortOrder
    const toggleSortOrder = useCallback(() => {
        setIsAscending((prev) => !prev);
        setActiveIndex(0);
    }, []);

    // Memoize sortedData calculation
    const sortedData = useMemo(() => {
        return initialData
            .filter(
                (event) =>
                    (tagsSelected.length === 0 || event.tags.some((tag) => tagsSelected.includes(tag))) &&
                    (filterStatus.length === 0 || filterStatus.includes(event.inEffect ? 'In Effect' : 'Proposed'))
            )
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return isAscending ? dateA - dateB : dateB - dateA;
            });
    }, [initialData, tagsSelected, filterStatus, isAscending]);

    // --- Header Animations --- 
    const multiselectRef = useSpringRef();
    const sortButtonRef = useSpringRef();
    const logoRef = useSpringRef();

    const multiselectAnimation = useSpring({
        ref: multiselectRef,
        from: { opacity: 0, transform: 'translateY(-150%)' },
        to: { opacity: 1, transform: 'translateY(0%)' },
        config: config.wobbly,
    });

    const sortButtonAnimation = useSpring({
        ref: sortButtonRef,
        from: { opacity: 0, transform: 'translateY(-150%)' },
        to: { opacity: 1, transform: 'translateY(0%)' },
        config: config.wobbly,
    });

    const logoAnimation = useSpring({
        ref: logoRef,
        from: { opacity: 0, transform: 'translateY(-100%)' },
        to: { opacity: 1, transform: 'translateY(0%)' },
        config: config.wobbly,
    });

    // --- Chain the header animations --- 
    useChain([multiselectRef, sortButtonRef, logoRef], [0, 0.05, 0.1], 250);

    // Memoize transition callbacks if needed (depends on stability of onTransition)
    const handleTransitionStart = useCallback(() => {
        setAnimateWWJD(false);
        onTransition(isMobile);
        setIsTransitioning(true);
    }, [onTransition, isMobile]);

    const handleTransitionRest = useCallback(() => {
        setAnimateWWJD(true);
        setIsTransitioning(false);
    }, []);

    // Animated transition using data mapping instead of activeIndex
    const transitions = useTransition(sortedData.length > 0 ? sortedData[activeIndex] : null, {
        key: sortedData[activeIndex]?.id ?? 'empty',
        from: { opacity: 0, transform: "translateY(100%) scale(0.9)" },
        enter: { opacity: 1, transform: "translateY(0%) scale(1)" },
        leave: { opacity: 0, transform: "translateY(-100%) scale(1.1)" },
        config: config.molasses,
        onStart: handleTransitionStart,
        onRest: handleTransitionRest,
    });

    const [springStyle, api] = useSpring(() => ({
        transform: "translateY(0%)",
        config: config.wobbly
    }));

    // Gesture Binding - Simplified onDrag
    const bind = useGesture({
        onDrag: ({ direction, velocity, movement, cancel, active, event }) => {
            event.preventDefault(); 
            const [, dy] = direction;
            const [, vy] = velocity;
            const [, my] = movement;
            const VELOCITY_THRESHOLD = 0.5;
            const DISTANCE_THRESHOLD = 80;
            const maxIndex = sortedData.length > 0 ? sortedData.length - 1 : 0;

            if (!active) {
                api.start({ transform: "translateY(0%)", config: config.wobbly });
                return;
            }

            if (Math.abs(my) > DISTANCE_THRESHOLD || vy > VELOCITY_THRESHOLD) {
                let triggeredBoundary = null;
                // let canShowArrow = false; // Commented out

                if (dy < 0 && activeIndex >= maxIndex) {
                    triggeredBoundary = 'end';
                    // canShowArrow = activeIndex > 0; // Commented out
                } else if (dy > 0 && activeIndex <= 0) {
                    triggeredBoundary = 'start';
                    // canShowArrow = activeIndex < maxIndex; // Commented out
                }

                if (triggeredBoundary) {
                    setBoundaryIndicator(triggeredBoundary);
                    // setShowArrow(canShowArrow); // Commented out
                    clearTimeout(boundaryTimerRef.current);
                    boundaryTimerRef.current = setTimeout(() => {
                        setBoundaryIndicator(null);
                        // setShowArrow(false); // Commented out
                    }, 1500); // Reset timer duration
                    cancel();
                } else {
                    // Successful swipe
                    setActiveIndex((prev) => {
                        if (dy < 0 && prev < maxIndex) return prev + 1;
                        if (dy > 0 && prev > 0) return prev - 1;
                        return prev;
                    });
                    setBoundaryIndicator(null);
                    // setShowArrow(false); // Commented out
                    clearTimeout(boundaryTimerRef.current);
                    cancel();
                }
            } else {
                // Snap back
                api.start({ transform: "translateY(0%)", config: config.wobbly });
            }
        },
    });

    // --- Boundary Indicator Animations ---
    const indicatorBoxRef = useSpringRef();
    const indicatorXRef = useSpringRef();
    // const indicatorArrowRef = useSpringRef(); // Commented out

    const indicatorBoxSpring = useSpring({
        ref: indicatorBoxRef,
        to: { opacity: boundaryIndicator ? 0.7 : 0, transform: boundaryIndicator ? 'scale(1)' : 'scale(0.5)' }, 
        from: { opacity: 0, transform: 'scale(0.5)' },
        config: config.stiff,
    });

    const indicatorXSpring = useSpring({
        ref: indicatorXRef,
        to: { opacity: boundaryIndicator ? 1 : 0, transform: boundaryIndicator ? 'scale(1)' : 'scale(0)' },
        from: { opacity: 0, transform: 'scale(0)' },
        config: config.wobbly,
    });
    
    // Commented out arrow animation spring
    /*
    const indicatorArrowSpring = useSpring({
        ref: indicatorArrowRef,
        to: async (next, cancel) => {
            if (showArrow) {
                const isStartBoundary = boundaryIndicator === 'start'; 
                const startY = isStartBoundary ? '250%' : '-250%'; 
                const nearY = isStartBoundary ? '-20%' : '20%';   
                const finalY = '0%';
                const finalScale = 2.5;
                
                await next({ opacity: 1, transform: `translateY(${startY}) scale(1)`, immediate: true }); 
                await next({ transform: `translateY(${nearY}) scale(1)`, config: config.gentle }); 
                await next({ transform: `translateY(${finalY}) scale(${finalScale})`, config: config.molasses });
            } else {
                 await next({ opacity: 0, transform: `translateY(0%) scale(0)`, immediate: true }); 
            }
        },
         from: { opacity: 0, transform: 'translateY(0%) scale(0)' }, 
    });
    */

    // Simplified useChain - Removed arrow ref and timings
    useChain(boundaryIndicator ? [indicatorBoxRef, indicatorXRef] 
             : [indicatorXRef, indicatorBoxRef], 
             boundaryIndicator ? [0, 0.15] // Box(0), X(0.15)
             : [0, 0.05] // Fade out X first if boundary clears quickly
            );

    // Cleanup timer on unmount
    useEffect(() => {
        return () => clearTimeout(boundaryTimerRef.current);
    }, []);

    // --- Springs for landscape transition ---
    
    // REMOVED landscapeStaticSpring

    // Update message spring for wobbly scale animation
    const landscapeMessageSpring = useSpring({
        opacity: isLandscape ? 1 : 0,
        transform: isLandscape ? 'scale(1)' : 'scale(0.005)', // Scale from/to 0.005
        from: { opacity: 0, transform: 'scale(0.005)'}, // Start at scale 0.005
        config: config.wobbly, // Use wobbly config
    });

    const portraitContentSpring = useSpring({
        opacity: isLandscape ? 0 : 1,
        config: config.gentle
    });

    // Effect to observe Sort button size
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setSortButtonSize(currentSize => {
                    if (currentSize.width !== width || currentSize.height !== height) {
                        return { width, height };
                    }
                    return currentSize;
                });
            }
        });

        const node = sortButtonWrapperRef.current;
        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) {
                observer.unobserve(node);
            }
            observer.disconnect();
        };
    }, []);

    return (
        <>
            {/* SEO Metadata - Same as Desktop Timeline */}
            <Helmet>
                <title>WWJD2025 Timeline - Project 2025 vs. Jesus's Teachings</title>
                <meta name="description" content="Explore the WWJD2025 timeline, contrasting Project 2025 policies with the actions and teachings of Jesus. Understand the impact of Christian Nationalism." />
                <meta name="keywords" content="wwjd, w.w.j.d, project 2025, wwjd2025, timeline, Jesus, christian nationalism, policies, comparison" />
            </Helmet>

            {/* Conditionally render the original noise filter */}
            {!isLandscape && (
                <div className={`noise-filter ${isTransitioning ? 'noise-filter--mobile-transition' : ''}`}></div>
            )}

            {/* Logo container - Reverted positioning strategy */}
            <animated.div 
                style={{
                    ...logoAnimation,
                    position: "absolute",
                    left: "42.5%", 
                    top: "1%",
                    transform: logoAnimation.transform.to(t => `${t} translateX(0%) translateY(10%)`), // Reverted transform
                    zIndex: 10000,
                    // width: 'fit-content' // Removed fit-content from parent
                    // textAlign: 'center' // Removed
                }}
            >
                {/* Background Box - Added width: fit-content back */}
                <Box sx={{
                    display: 'inline-flex',
                    width: 'fit-content', // Added fit-content back
                    alignItems: 'center',
                    backgroundColor: isLandscape ? 'black' : 'transparent',
                    padding: isLandscape ? '0.5em' : 0, 
                    borderRadius: isLandscape ? '4px' : 0, 
                    transition: 'background-color 0.3s ease, padding 0.3s ease'
                }}>
                    <img
                        src={WWJDLogo}
                        alt="WWJD2025 Logo - Mobile View - What Would Jesus Do vs Project 2025"
                        style={{
                            width: !isLandscape ? '15vw' : '10vw', // Set fixed width
                            height: 'auto', // Adjust height automatically
                            display: 'block' 
                        }}
                    />
                </Box>
            </animated.div>

            <animated.div 
                style={{
                    ...portraitContentSpring,
                    pointerEvents: isLandscape ? 'none' : 'auto'
                }}
            >
                <animated.div style={multiselectAnimation}> 
                     <MultiSelect 
                        options={tagList} 
                        optionCount={tagListCount} 
                        stateOptions={tagsSelected} 
                        setOptions={setSelectedTags} 
                        isMobile={isMobile} 
                        targetSize={sortButtonSize} // Pass size down
                    />
                </animated.div>

                <animated.div 
                    ref={sortButtonWrapperRef} // Attach ref
                    style={{
                        ...sortButtonAnimation,
                        position: 'absolute',
                        top: '1.5%',
                        right: '4%',
                        zIndex: 100,
                        maxWidth: isMobile ? '30%' : '20%',
                        minWidth: isMobile ? '20%' : '0'
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={toggleSortOrder}
                        style={{ 
                            color: 'white',
                            borderColor: 'white',
                            width: '100%'
                        }}
                    >
                        Sort:{isAscending ? 'ASC' : 'DESC'}
                    </Button>
                </animated.div>

                <div ref={containerRef} style={{ ...springStyle, overflow: "hidden", height: "80vh", maxHeight: '150vh', position: "relative", paddingTop: '2.5%', background: 'transparent', width: '100%' }}>
                    <div {...bind()} style={{ width: "100%", height: "100%", position: "absolute", }}>
                        {transitions((style, item) => (
                            item ? (
                                <animated.div
                                    style={{
                                        ...style,
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "hidden"
                                    }}
                                >
                                    <EventCard
                                        event={item}
                                        sourceIconMap={sourceIconMap}
                                        setSelectedTags={setSelectedTags}
                                        tagsSelected={tagsSelected}
                                        filterStatus={filterStatus}
                                        animate={animateWWJD}
                                        isActive={item === sortedData[activeIndex]}
                                        isMobile={isMobile}
                                    />
                                </animated.div>
                            ) : null
                        ))}
                    </div>
                </div>

                <div style={{ position: 'absolute', top: '15%', left: '0', width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 200 }}>
                    {boundaryIndicator === 'start' && (
                        <animated.div style={{...indicatorBoxSpring, position: 'relative' }}>
                            <Box sx={{ width: 50, height: 50, bgcolor: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <animated.div style={indicatorXSpring}>
                                    <CloseIcon sx={{ color: 'white', fontSize: 30 }} />
                                </animated.div>
                            </Box>
                        </animated.div>
                    )}
                </div>
                <div style={{ position: 'absolute', bottom: '15%', left: '0', width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 200 }}>
                     {boundaryIndicator === 'end' && (
                        <animated.div style={{ ...indicatorBoxSpring, position: 'relative' }}>
                            <Box sx={{ width: 50, height: 50, bgcolor: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <animated.div style={indicatorXSpring}>
                                    <CloseIcon sx={{ color: 'white', fontSize: 30 }} />
                                </animated.div>
                            </Box>
                        </animated.div>
                    )}
                </div>
            </animated.div>

            {/* --- Landscape Mode Elements --- */}
            
            {/* Render StaticShader directly with opacity 1 when isLandscape is true */}
            {isLandscape && <StaticShader opacity={1} />}
            
            {/* Landscape Message Wrapper */}
            <animated.div 
                style={{
                    ...landscapeMessageSpring,
                    position: 'fixed', 
                    inset: 0, 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999, 
                    pointerEvents: isLandscape ? 'auto' : 'none' 
                }}
            >
                <Card sx={{
                    minWidth: "80vw",
                    maxWidth: "80vw",
                    backgroundColor: "#5b1e1e",
                    color: "white",
                    padding: 2, 
                    borderRadius: '15px',
                    textAlign: 'center'
                }}>
                    <Typography variant="h6" fontWeight="bold">
                        Horizontal viewing not supported.
                    </Typography>
                </Card>
            </animated.div>
        </>
    );
};

export default Timeline;