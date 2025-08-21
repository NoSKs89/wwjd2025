import React, { useEffect, useState, useRef, useMemo, useCallback, memo } from "react";
import { Box, Button, Typography } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MultiSelect from "./Multiselect";
import "../App.css";
import { useTrail, a, animated, config, useSpring, useSpringRef, useChain, interpolate } from "@react-spring/web";
import WWJDLogo from '../designed/WWJD2025_Logo_On_White.png';
import EventCard from './EventCard';
import { Helmet } from 'react-helmet-async';

const getDealInitialStyle = () => ({
    opacity: 0,
    transform: 'translateX(200%) translateY(200%) scale(0.75) rotate(0deg) rotateZ(50deg)',
    zIndex: 0,
});
const getDealActiveStyle = () => ({
    opacity: 1,
    transform: 'translateX(0%) translateY(0%) scale(1) rotate(0deg) rotateZ(0deg)',
    zIndex: 1,
});
const dealConfig = {...config.stiff}; // { mass: 1, tension: 280, friction: 25 };
const dealCardDelay = 80; // Staggering delay for deal animation

const getSubtleInitialStyle = () => ({
    opacity: 0,
    transform: 'translateX(0%) translateY(-225%) scale(0.6) rotate(0deg) rotateZ(-8deg)',
    zIndex: 0,
});
const getSubtleActiveStyle = () => ({
    opacity: 1,
    transform: 'translateX(0%) translateY(0%) scale(1) rotate(0deg) rotateZ(0deg)',
    zIndex: 1,
});
const subtleConfig = { mass: 7, tension: 2000, friction: 180 };
const subtleCardDelay = 90;

// Define stable config objects for logo animation
const logoOvershootConfig = { ...config.wobbly, mass: 0.8, tension: 200 };
const logoSettleConfig = { ...config.wobbly, mass: 0.8, tension: 180 };

// Helper function for async delays
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- New Component for Animated Header ---
// Wrap with React.memo to prevent re-renders unless props change
const AnimatedHeader = React.memo(({ 
    isMobile, 
    isIntroAnimating, 
    tagList, 
    tagListCount, 
    tagsSelected, 
    setSelectedTags, 
    toggleSortOrder, 
    isAscending 
}) => {
    // Refs for animation
    const multiselectRef = useSpringRef();
    const sortButtonRef = useSpringRef();
    const logoRef = useSpringRef();

    // Ref and State for measuring Sort button
    const sortButtonWrapperRef = useRef(null);
    const [sortButtonSize, setSortButtonSize] = useState({ width: 0, height: 0 });

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

    const logoSprings = useSpring({
        ref: logoRef,
        from: { transform: 'scale(0.1)', opacity: 0 },
        // to: async (next) => {
        //     await next({ transform: 'scale(1.3)', opacity: 1, config: logoOvershootConfig });
        //     await next({ transform: 'scale(1)', config: logoSettleConfig });
        // },
        to: {  transform: 'scale(1)', opacity: 1},
        reset: false,
    });

    // Effect to observe Sort button size
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                // Update state only if size actually changes to avoid potential loops
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

        // Cleanup observer on unmount
        return () => {
            if (node) {
                observer.unobserve(node);
            }
            observer.disconnect();
        };
    }, []); // Empty dependency array means run on mount/unmount

    useChain([multiselectRef, sortButtonRef, logoRef], [0.1, 0.2, 0.3], 500); // Adjusted timings slightly

    return (
        <>
            {/* SEO Metadata */}
            <Helmet>
                <title>WWJD2025 Timeline - Project 2025 vs. Jesus's Teachings</title>
                <meta name="description" content="Explore the WWJD2025 timeline, contrasting Project 2025 policies with the actions and teachings of Jesus. Understand the impact of Christian Nationalism." />
                <meta name="keywords" content="wwjd, w.w.j.d, project 2025, wwjd2025, timeline, Jesus, christian nationalism, policies, comparison" />
            </Helmet>

            {/* Sort Button - Restored original positioning, ADD REF */}
            <animated.div 
                ref={sortButtonWrapperRef} // Attach ref here
                style={{
                    ...sortButtonAnimation,
                    zIndex: 6000,
                    position: 'fixed',
                    top: '1.8%',
                    right: '15%',
                    width: '15vw',
                    height: '8vh',
                    transition: 'opacity 0.3s ease'
                    // Removed height, display:flex, align-items:center from wrapper
                    }}
                >
                <Button
                    variant="outlined" onClick={toggleSortOrder} disabled={isIntroAnimating}
                    style={{ color: 'white', borderColor: 'white', width: '100%', height: '100%' }}
                    > Sort: {isAscending ? 'ASC' : 'DESC'} </Button>
            </animated.div>

            {/* Main Header Bar - Apply gradient background */}
            <Box style={{
                zIndex: 1000,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: isMobile ? '8.5vh' : "12.5vh",
                background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 1) 0%, hsla(0, 0%, 0%, 0.3) 100%)',
                display: "flex",
                alignItems: "center",
                padding: "0 0" // Restored padding (optional)
            }}>
                {/* Removed the Flex Container Box */}

                {/* Multiselect - Now directly inside Header Box */}
                <animated.div style={{
                    ...multiselectAnimation,
                    position: 'absolute', 
                    top: '5%',
                    left: '15%',
                    opacity: isIntroAnimating ? 0.5 : multiselectAnimation.opacity,
                    pointerEvents: isIntroAnimating ? 'none' : 'auto',
                    transition: 'opacity 0.3s ease'
                    // Removed height, display:flex, align-items:center from wrapper
                    }}
                > 
                    <MultiSelect
                        targetSize={sortButtonSize} // Pass size down
                        options={tagList}
                        optionCount={tagListCount}
                        stateOptions={tagsSelected}
                        setOptions={setSelectedTags}
                        isMobile={isMobile}
                    />
                </animated.div>

                {/* Logo - Restored absolute positioning */}
                <Box style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-5%)", // Simple horizontal centering
                    color: "white",
                    textAlign: "center"
                    // Removed top, vertical transform
                }}>
                    <animated.img
                        src={WWJDLogo}
                        alt="WWJD2025 Logo - What Would Jesus Do? Confronting Project 2025"
                        style={{
                            // maxWidth: '7.5%', // Restored original maxWidth/maxHeight
                            // maxHeight: '7.5%',
                            // minWidth: '20.5%',
                            // minHeight: '20.5%',
                            width: '10%',
                            height: '10%',
                            display: 'block',
                            ...logoSprings
                        }}
                    />
                </Box>

                {/* Removed Sort Button from here */}

            </Box>
        </>
    );
});

const Timeline = ({ data: initialData, sourceIconMap, onTransition }) => {
    const [tagsSelected, setSelectedTags] = useState([]);
    const [filterStatus, setFilterStatus] = useState([]);
    const [isAscending, setIsAscending] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [isIntroAnimating, setIsIntroAnimating] = useState(false);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const [headerAnimKey, setHeaderAnimKey] = useState(0);
    const initialMountRef = useRef(true);

    const isSubtleAnimation = tagsSelected.length === 0;

    // Effect to update header animation key on filter/sort changes
    useEffect(() => {
        // Skip the effect run on the initial mount
        if (initialMountRef.current) {
            initialMountRef.current = false;
            return;
        }
        
        // Only increment key (triggering animation) on subsequent changes
        setHeaderAnimKey(prev => prev + 1);
    }, [tagsSelected, isAscending]);

    // Effect to manage intro animation flags (no change here)
    useEffect(() => {
        setIsAnimationComplete(false);
        setIsIntroAnimating(true); 
    }, [tagsSelected, filterStatus, isAscending, isSubtleAnimation]);

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

    // --- useTrail for Card Animation (Conditional) ---
    const trail = useTrail(sortedData.length, { //change here, I don't think isIntroAnimating is true for all animations. I need all useTrail ones to tell the other state..
        reset: isIntroAnimating, // Re-run when intro starts
        from: isSubtleAnimation ? getSubtleInitialStyle() : getDealInitialStyle(),
        to: isSubtleAnimation ? getSubtleActiveStyle() : getDealActiveStyle(),
        config: isSubtleAnimation ? subtleConfig : dealConfig,
        delay: isSubtleAnimation ? subtleCardDelay : dealCardDelay,
        // onRest: Called when ALL springs in the trail come to rest
        onRest: () => {
            if (isIntroAnimating) {
                // If it was the subtle animation, mark completion here.
                if (isSubtleAnimation) {
                    setTimeout(() => {
                        setIsIntroAnimating(false);
                        setIsAnimationComplete(true);
                    }, 0);
                }
                // If it was the "Deal" animation, the runIntroSequence effect handles setting flags.
            }
        },
    });

    const [activeItemId, setActiveItemId] = useState(null);
    const cardRefs = useRef({});

    // Calculate activeIndex (needed for potential secondary animation later)
    const activeIndex = useMemo(() => {
        if (!activeItemId || !isAnimationComplete) return -1;
        return sortedData.findIndex(item => item.id === activeItemId);
    }, [activeItemId, sortedData, isAnimationComplete]);

    // --- "Deal" Animation Scrolling Sequence ---
    useEffect(() => {
        if (!isIntroAnimating || isSubtleAnimation || sortedData.length === 0) {
            return;
        }

        const abortController = new AbortController();
        const runIntroSequence = async () => {
            // 1. Short pause to allow trail to initialize visually
            await wait(100);
            if (abortController.signal.aborted) return;

            // 2. *** Smoothly scroll to top NOW, before downward scroll starts ***
            // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            // await wait(600); // Wait for smooth scroll to roughly finish (adjust time)
            // if (abortController.signal.aborted) return;

            // 3. Proceed with downward scrolling sequence
            const baseCardDelay = dealCardDelay; // Use delay matching the deal trail
            const scrollLookAhead = 3;
            const initialScrollDelay = baseCardDelay * 1.5; // Start scrolling shortly after first few cards appear

            for (let i = 0; i < sortedData.length; i++) {
                if (abortController.signal.aborted) return;

                const card = sortedData[i];
                const animationStartTime = i * baseCardDelay;
                const speedUpFactor = Math.max(0.1, 1 - (i / sortedData.length) * 0.4);
                const scrollTriggerDelay = initialScrollDelay + animationStartTime * speedUpFactor;

                const scrollTimeoutId = setTimeout(() => {
                    if (abortController.signal.aborted) return;
                    const targetIndex = Math.min(i + scrollLookAhead, sortedData.length - 1);
                    const targetCard = sortedData[targetIndex];
                    const targetRef = cardRefs.current[targetCard.id];

                    if (targetRef) {
                        const scrollBehavior = i > sortedData.length / 2 ? 'instant' : 'smooth';
                        const targetRect = targetRef.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const targetScrollY = window.scrollY + targetRect.top - viewportHeight * 0.3;
                        // window.scrollTo({ top: targetScrollY, left: 0, behavior: scrollBehavior });
                    }
                }, scrollTriggerDelay);
            }

            // 4. Wait for animations and scrolling to finish
            const lastAnimStartTime = (sortedData.length - 1) * baseCardDelay;
            const estimatedSettleTime = 700; // Allow ample settle time
            const totalEstimatedTime = lastAnimStartTime + estimatedSettleTime + 500;
            await wait(totalEstimatedTime);
            if (abortController.signal.aborted) return;

            // 5. Final scroll back to top
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            await wait(800);
            if (abortController.signal.aborted) return;

            // *** ADD THIS: Explicitly set active card to the first item ***
            if (sortedData.length > 0) {
                setActiveItemId(sortedData[0].id);
                await wait(10); // Tiny delay to help state update propagate
                if (abortController.signal.aborted) return;
            }
            // ***************************************************************

            // 6. Mark "Deal" sequence as complete
            setIsIntroAnimating(false);
            setIsAnimationComplete(true);
        };

        runIntroSequence();

        return () => {
            abortController.abort();
            // Ensure flags reset if unmounted mid-sequence
            setIsIntroAnimating(false);
        };
    // Depend on the intro flag, the data, and *which* animation type it is
    }, [isIntroAnimating, isSubtleAnimation, sortedData]);


    // --- Scroll Listener for Active Card (AFTER Intro Animation) ---
    useEffect(() => {
        // Attach listener only when *fully* complete and not animating
        if (!isAnimationComplete || isIntroAnimating) {
            return;
        }

        // ... (Scroll handler logic remains the same) ...
        const handleScroll = () => {
            let closestItemId = null;
            let minDistance = Infinity;
            const viewportCenter = window.innerHeight / 2;

            sortedData.forEach((event) => {
                const ref = cardRefs.current[event.id];
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    if (rect.bottom > 0 && rect.top < window.innerHeight) {
                        const cardCenter = rect.top + rect.height / 2;
                        const distance = Math.abs(cardCenter - viewportCenter);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestItemId = event.id;
                        }
                    }
                }
            });

            if (closestItemId !== null ) {
                setActiveItemId(currentActiveId => {
                    if (closestItemId !== currentActiveId) return closestItemId;
                    return currentActiveId;
                });
            }
        };

        let scrollTimeoutId = null;
        const debouncedScrollHandler = () => {
            clearTimeout(scrollTimeoutId);
            scrollTimeoutId = setTimeout(handleScroll, 50); // Adjust debounce delay if needed
        };

        window.addEventListener("scroll", debouncedScrollHandler, { passive: true });
        handleScroll(); // Initial check

        return () => {
    
            clearTimeout(scrollTimeoutId);
            window.removeEventListener("scroll", debouncedScrollHandler);
        };
    }, [isAnimationComplete, isIntroAnimating, sortedData]); // Dependencies are correct

    // --- Utility Functions (unchanged) ---
    const toggleSortOrder = useCallback(() => setIsAscending((prev) => !prev), []);
    const tagList = useMemo(() => Array.from(new Set(initialData.flatMap((e) => e.tags))).sort(), [initialData]);
    const tagListCount = useMemo(() => { /* ... count logic ... */
        const tagCounts = initialData.reduce((acc, item) => {
            item.tags.forEach(tag => { acc[tag] = (acc[tag] || 0) + 1; });
            return acc;
        }, {});
        return Object.entries(tagCounts).map(([tag, count]) => `${tag} (${count})`).sort();
    }, [initialData]);

    // ... Existing cursorY state and effect remain the same ...
    const [cursorY, setCursorY] = useState(0);
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isIntroAnimating) {
                 setCursorY(e.clientY);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isIntroAnimating]);

    // Callback for setting card refs - REMOVE useCallback for now
    const handleCardRef = (el, id) => {
        if (el) {
            cardRefs.current[id] = el;
        } else {
            delete cardRefs.current[id];
        }
    };

    return (
        <>
            {/* Use the CSS class for the animated background */}
            <div className="noise-filter"></div>

            {/* Render AnimatedHeader with key and props */}
            <AnimatedHeader
                key={headerAnimKey}
                isMobile={isMobile}
                isIntroAnimating={isIntroAnimating}
                tagList={tagList}
                tagListCount={tagListCount}
                tagsSelected={tagsSelected}
                setSelectedTags={setSelectedTags}
                toggleSortOrder={toggleSortOrder}
                isAscending={isAscending}
            />
            
            {/* --- Timeline Container --- */}
            <Box
                className="timeline-container"
                sx={{
                    position: 'relative',
                    pb: "50vh",
                    mt: '18vh',
                    ml: '2%',
                    backgroundColor: 'transparent' // Explicitly set to transparent
                }}
            >
                {trail.map(({...styleProps}, index) => {
                    const item = sortedData[index];
                    if (!item) return null;
                    
            
                    
                    return (
                        <EventCardWrapper
                          key={item.id}
                          item={item}
                          styleProps={styleProps}
                          refFn={handleCardRef} // Pass non-memoized ref handler
                          cursorY={cursorY}
                          isActive={item.id === activeItemId && isAnimationComplete}
                          isIntroAnimating={isIntroAnimating}
                          index={index}
                          activeIndex={activeIndex}
                          isSubtleAnimation={isSubtleAnimation}
                          isAnimationComplete={isAnimationComplete}
                          sourceIconMap={sourceIconMap}
                          setSelectedTags={setSelectedTags}
                          tagsSelected={tagsSelected}
                          filterStatus={filterStatus}
                          activeItemId={activeItemId}
                        />
                    );
                })}
                    {/* No Results Message */}
                    {sortedData.length === 0 && isAnimationComplete && ( // Show only when complete and empty
                        <Typography sx={{color: 'white', textAlign: 'center', mt: 4}}>
                            No events match the current filters.
                        </Typography>
                    )}
            </Box>
        </>
    );
};

// REMOVE memo wrapper from EventCardWrapper
const EventCardWrapper = ({ 
    item, 
    styleProps, 
    refFn, 
    cursorY, 
    isActive, 
    isIntroAnimating, 
    index, 
    isSubtleAnimation, 
    activeIndex, 
    isAnimationComplete,
    sourceIconMap,
    setSelectedTags, 
    tagsSelected,
    filterStatus,
    activeItemId 
}) => {
  const outerRef = useRef(null);
  const tiltRef = useRef(null);

  // Tilt spring - use a slightly softer config for scroll parallax
  const [tilt, tiltApi] = useSpring(() => ({
      rotateX: 0,
      config: { mass: 1, tension: 210, friction: 20 } // Default gentle-ish config
  }));

  // Scale spring for active card
  const [{ scale }, scaleApi] = useSpring(() => ({
      scale: 1, 
      config: config.stiff 
  }));
  
  // Removed Parallax Y spring
  // const [{ y }, yApi] = useSpring(() => ({ y: 0, config: config.stiff }));

  // Effect for Tilt (parallax logic)
  useEffect(() => {
      const introTiltAngle = 15;
      const maxScrollTilt = 15;
      const sensitivity = 40; // Lower value = more sensitive tilt

      if (isIntroAnimating) {
          // --- Handle Tilt DURING Intro Animation ---
          if (isSubtleAnimation) {
              // Subtle animation: Apply alternating gentle tilt
              const targetAngle = index % 2 === 0 ? introTiltAngle : -introTiltAngle;
              tiltApi.start({ rotateX: targetAngle, config: config.gentle, immediate: false });
          } else {
              // Deal animation: No initial tilt, ensure it's reset
              tiltApi.start({ rotateX: 0, immediate: true });
          }
          return; // Don't proceed to scroll-based tilt logic
      }

      if (isAnimationComplete) {
           // --- Handle Tilt AFTER Intro Animation is Complete ---
          let targetRotateX = 0; // Default tilt is 0

          if (isActive) {
              // Active card target tilt is 0 - it flattens out
              targetRotateX = 0;
          } else if (tiltRef.current) {
              // Non-active card: Calculate tilt based on viewport position
              const rect = tiltRef.current.getBoundingClientRect();
              const viewportCenter = window.innerHeight / 2;
              const cardCenterY = rect.top + rect.height / 2;
              const distanceFromCenter = cardCenterY - viewportCenter;
              // Clamp the tilt angle between -maxScrollTilt and +maxScrollTilt
              targetRotateX = Math.max(-maxScrollTilt, Math.min(maxScrollTilt, distanceFromCenter / sensitivity));
          }

          // Start the spring animation towards the calculated target tilt
          // Use the default smooth config defined in useSpring (no immediate: true)
          tiltApi.start({ rotateX: targetRotateX, immediate: false });

      } else {
          // --- Handle Tilt during transitions or before completion ---
          // (e.g., between intro finishing and scroll listener fully activating)
          // Ensure tilt is reset immediately to avoid jumps
          tiltApi.start({ rotateX: 0, immediate: true });
      }

  // Dependencies: Re-run when intro state, completion state, or active state changes
  // Also re-run if the index changes (relevant for subtle intro tilt)
  }, [isActive, isIntroAnimating, isAnimationComplete, index, isSubtleAnimation, tiltApi]);

  // Effect for Scale (separate)
  useEffect(() => {
    if (!isAnimationComplete || isIntroAnimating) {
        scaleApi.start({ scale: 1, immediate: true });
        return;
    }
    scaleApi.start({ scale: isActive ? 1.02 : 1 });
  }, [isActive, isAnimationComplete, isIntroAnimating, scaleApi]);

  // Use plain ref handler, no useCallback needed if parent doesn't use it
  const handleOuterRef = (el) => {
      outerRef.current = el;
      if (refFn) {
          refFn(el, item.id);
      }
  };

  return (
      <a.div
          ref={handleOuterRef}
          style={{ ...styleProps, perspective: '1000px', transformStyle: 'preserve-3d', display: 'block' }}
          className="event-card-container"
      >
          <a.div
              ref={tiltRef}
              style={{
                  transform: interpolate([tilt.rotateX, scale], (rx, s) => `scale(${s}) rotateX(${rx}deg)`),
                  height: '100%',
                  width: '100%',
                  transformStyle: 'preserve-3d',
              }}
          >
              {/* Render EventCard directly, passing all needed props */}
              <EventCard 
                event={item}
                sourceIconMap={sourceIconMap}
                setSelectedTags={setSelectedTags}
                tagsSelected={tagsSelected}
                filterStatus={filterStatus}
                isActive={isActive} // Pass isActive correctly
                activeItemId={activeItemId}
                // Pass any other props EventCard might need if they were implicitly handled by children before
              />
          </a.div>
      </a.div>
  );
}; // Removed memo wrapper

export default Timeline;