import React, { useEffect, useState, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { Box, Card, CardContent, Button, Typography, IconButton, Tooltip } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MultiSelect from "./Multiselect";
import "../App.css";
import { useSpring, animated, useTransition, config, useChain, useSpringRef } from "@react-spring/web";
import { useControls, Leva } from 'leva';
const AnimatedCard = animated(Card);
const AnimatedBox = animated(Box);

function EventCard({ event, sourceIconMap, setSelectedTags, tagsSelected, filterStatus, isActive, className, activeIndex, animate }) {
    const [verseIndex, setVerseIndex] = useState(0);
    const [sourceIndex, setSourceIndex] = useState(0);
    const hasMultipleVerses = event.goodData.length > 1;
    const hasMultipleSources = event.badData.sources.length > 1;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const sourceOnClick = (idx, source) => {
        window.open(source.url);
        setSourceIndex(idx);
    };

    const tagOnClick = (tag) => {
        if (tagsSelected === tag) {
            setSelectedTags([]);
        } else {
            setSelectedTags([tag]);
        }
    };

    const statusOnClick = (status) => {
        setSelectedTags((prevTags) => {
            if (prevTags.includes(status)) {
                return prevTags.filter((tag) => tag !== status);
            } else {
                return [...prevTags, status];
            }
        });
    };

    const wwjdTextRef = useSpringRef();
    const iconLinkRef = useSpringRef();

    useEffect(() => {
        if (!isMobile) {
            animate = true;
        }
    }, []);

    const wwjdTextSpring = useSpring({
        opacity: 0,
        transform: "scale(0.1) translateX(0%)",
        from: { opacity: 0, transform: "scale(1.5) translateX(75%)" },
        to: { opacity: 1, transform: "scale(1) translateX(0%)" },
        reset: isMobile ? false : true,
        config: config.gentle,
        ref: wwjdTextRef
    });

    const iconLinkSpring = useSpring({
        bottom: isMobile ? 15 : 0,
        config: config.molasses,
        reset: true, 
        ref: iconLinkRef
    });

    const verseImplicationStyles = {
        from: { opacity: 0, transform: 'translateY(90%) scale(0.90)' },
        to: { opacity: 1, transform: 'translateY(0%) scale(1)' },
        reset: false,
        config: config.default       
        //config: { mass: 1, tension: 250, friction: 25 }

    };

    const evilCardRef = useSpringRef();
    const evilCardSpring = useSpring({ ...verseImplicationStyles, ref: evilCardRef });
    const holyCardRef = useSpringRef();
    const holyCardSpring = useSpring({ ...verseImplicationStyles, ref: holyCardRef });
    const evilHeaderRef = useSpringRef();
    const evilHeaderSpring = useSpring({ ...verseImplicationStyles, ref: evilHeaderRef });
    const evilInfoRef = useSpringRef();
    const evilInfoSpring = useSpring({ ...verseImplicationStyles, ref: evilInfoRef });
    const evilFooterRef = useSpringRef();
    const evilFooterSpring = useSpring({ ...verseImplicationStyles, ref: evilFooterRef });
    const verseRef = useSpringRef();
    const verseSpring = useSpring({ ...verseImplicationStyles, ref: verseRef })
    const verseTextRef2 = useSpringRef();
    const verseTextSpring = useSpring({ ...verseImplicationStyles, ref: verseTextRef2 })
    const verseImplicationRef = useSpringRef();
    const verseImplicationSpring = useSpring({ ...verseImplicationStyles, ref: verseImplicationRef })

    // Refs for sequencing gap and scale/filter
    const gapRef = useSpringRef();
    const browserCardRef = useSpringRef();

    useChain(
        isMobile ?
            [evilCardRef, evilHeaderRef, evilInfoRef, evilFooterRef, holyCardRef, verseRef, verseImplicationRef, isMobile ? wwjdTextRef : verseImplicationRef]
            : [evilCardRef, evilHeaderRef, evilInfoRef, evilFooterRef, holyCardRef, verseRef, isMobile ? wwjdTextRef : verseImplicationRef]
            ,
        isMobile ? [0.396, 1.2, 1.596, 1.992, 2.58, 2.976, 3.396, 3.768] //[1, 1.33, 1.66, 2, 2.33, 2.66, 3] //[0.33, 1, 1.33, 1.66, 2.15, 2.48, 2.83, 3.14]
            : [0.396, 1.2, 1.596, 1.992, 2.58, 2.976, 3.396]
    );

    const verseTextRef = useRef(null);
    const implicationTextRef = useRef(null);
    const [verseHeight, setVerseHeight] = useState(50); 
    const [badHeight, setBadHeight] = useState(50);
    const storyRef = useRef(null);
    const implicationRef = useRef(null);
    const [updateFlag, setUpdateFlag] = useState(false);

    // Measure new height when verseIndex changes
    useEffect(() => {
        const updateHeight = () => {
            if (verseTextRef.current && implicationTextRef.current) {
                const combinedHeight =
                    verseTextRef.current.clientHeight + implicationTextRef.current.clientHeight;
        
                setVerseHeight(combinedHeight);
            }
        };

        requestAnimationFrame(updateHeight);
    }, [updateFlag]);

    const handleVerseButtonClick = (index) => {
        if (verseIndex !== index) {
    
            setVerseIndex(index);
            setTimeout(() => setUpdateFlag(prev => !prev), 0.001);
        }
    };

    useEffect(() => {
        //when a new card occurs, reset the height and verse to the first one
        setVerseIndex(0);
        setTimeout(() => setUpdateFlag(prev => !prev), 0.001);
    }, [isActive, activeIndex])

    useEffect(() => {
        const updateBadHeight = () => {
            if (storyRef.current && implicationRef.current) {
                const combinedHeight =
                    storyRef.current.clientHeight + implicationRef.current.clientHeight;
                setBadHeight(combinedHeight); 
            }
        };

        requestAnimationFrame(updateBadHeight);
    }, [isActive])

    // animate the card height based on text content
    const cardSpring = useSpring({
        height: isMobile ?
            (verseHeight > 350 ? verseHeight - 15 :
                (verseHeight > 200 ? verseHeight + 40 :
                    (verseHeight < 98 ? verseHeight + 115 :
                        (verseHeight < 165 ? verseHeight + 125 :
                            verseHeight + 140))))
            : (verseHeight ? verseHeight + 150 : 400), 
        config: config.molasses,
        reset: true
    });

    const browserConfig = useControls({
        mass: 1,
        tension: 125,
        friction: 20,
        clamp: false,
        precision: 2.01,
        velocity: 0.20
      })

    // Spring for animating the gap between cards on desktop
    const containerGapSpring = useSpring({
        gap: !isMobile ? (isActive ? 100 : 30) : 4, // Animate gap from 4 to 16 when active on desktop
        config: config.gentle,// browserConfig,
        reset: true,
        ref: gapRef,
    });

    // Define the chain sequence based on isActive state
    useChain(isActive ? [gapRef, browserCardRef] : [browserCardRef, gapRef], isActive ? [0, 0.1] : [0, 0]); // Gap starts, scale starts 0.1s later when activating

    const badCardColorSpring = useSpring({
        from: { background: '#5b1e1e' },
        to: { background: isActive ? '#371313' : '#5b1e1e'
         },
        reset: false,
        config: config.gentle
    })

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleVerseClick = () => {
        const verseText = event.goodData[verseIndex].verse;
        const verseRegex = /([A-Za-z\s]+)\s(\d+):(\d+)/;
        const match = verseText.match(verseRegex);

        if (match) {
            const book = match[1].trim();
            const chapter = match[2];
            const verse = match[3];

            const baseUrl = 'https://www.biblegateway.com/passage/?search=';
            const encodedVerse = encodeURIComponent(`${book} ${chapter}:${verse}`);
            const url = `${baseUrl}${encodedVerse}&version=NIV`;

            window.open(url, '_blank');
        } else {
            alert('Invalid verse format.');
        }
    };

    // Define browserCardSpring again and assign ref
    const browserCardSpring = useSpring({
        from: { transform: 'scale(1) translateY(2.5%)', filter: !isMobile ? 'blur(1.6px)' : 'blur(0px)' },
        to: { transform: isActive ? 'scale(1.1) translateY(0%)' : 'scale(1) translateY(2.5%)',
            filter: isActive ? 'blur(0px)' : 'blur(1.6px)'
        },
        reset: true,
        config: browserConfig,
        ref: browserCardRef // Assign ref
    });

    return (
        <>
        <Leva
            hidden // default = false, when true the GUI is hidden
            />
            <AnimatedBox style={containerGapSpring}
                 className={`event-card-container ${isMobile ? 'mobile' : (isActive ? "active" : "inactive")}`}
                 sx={{
                     display: isMobile ? 'auto' : "flex",
                     flexDirection: isMobile ? "column" : "row", // Align cards side by side or top/bottom on mobile
                     justifyContent: "center",
                     pointerEvents: isActive ? "auto" : "none",
                     position: "relative",
                     pb: isMobile ? 0 : 8,
                     gap: isMobile ? 4 : undefined, // Use spring for non-mobile gap
                     ml: isMobile ? 'none' : (isActive ? '-2.5em' : 'auto'),
                     position: isMobile ? 'absolute' : 'relative',
                     top: isMobile ? 40 : 0
                 }}
             >
                {/* Left Card - Bad Policy */}
                <AnimatedCard style={!isMobile ? { ...browserCardSpring, ...badCardColorSpring } : badCardColorSpring}
                    className={isActive && !isMobile ? 'evil-border' : ''}
                    sx={{
                        minWidth: isMobile ? "90vw" : '40vw',
                        maxWidth: isMobile ? "90vw" : '40vw',
                        minHeight: isMobile ? (badHeight < 120 ? "31.5vh" :
                            (badHeight > 140 && badHeight < 175 ? "35vh" :
                                (badHeight > 200 ? '35vh' : '31vh'))) : '50%',
                        maxHeight: isMobile ? (badHeight < 120 ? "30.5vh" : '45vh') : '50%',
                        flex: 1,
                        backgroundColor: "#5b1e1e",
                        color: "white",
                        borderLeft: !isMobile ? (isActive ? 'none' : "8px solid #ff5555") : 'none',
                        position: "relative",
                        zIndex: -1,
                        borderRadius: isMobile ? '15px !important' : 'auto',
                        mb: isMobile ? "16px" : 0, 
                        ml: !isMobile ? (isActive ? '8px' : '0px') : 'auto',
                        ...(isMobile && { paddingBottom: '0px', paddingLeft: "6px", paddingRight: '6px', paddingTop: '0px', fontSize: "0.75em", justifyContent: "center", alignSelf: 'center' }), // Smaller text for mobile
                    }}
                    ref={isMobile ? evilCardRef : ''}
                >
                    <CardContent>
                        <animated.div ref={isMobile ? evilHeaderRef : ''} style={isMobile ? evilHeaderSpring : {}}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" color="white">
                                <Typography variant={'h6'} style={{ fontSize: isMobile ? '0.75em' : '' }} fontWeight="bold" sx={{ pb: 1 }}>{event.subject}
                                    {/* {badHeight} */}
                                </Typography>
                                <Typography variant="i" sx={{ pb: 1 }} style={{ paddingLeft: isMobile ? '0.75em' : '0em' }}>{event.date}</Typography>
                                <Box
                                    sx={{
                                        display: "inline-block",
                                        padding: "4px 8px",
                                        marginLeft: 2,
                                        marginRight: 2,
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: event.inEffect ? "white" : "orange",
                                        color: event.inEffect ? "white" : "orange",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => statusOnClick(event.inEffect ? "In Effect" : "Proposed")}
                                    style={{ fontSize: isMobile ? '0.25em !important' : 'auto' }}
                                >
                                    {event.inEffect ? "In Effect" : "Proposed"}
                                </Box>
                            </Box></animated.div>

                        <animated.div ref={isMobile ? evilInfoRef : ''} style={isMobile ? evilInfoSpring : {}}>
                            <Typography sx={{ color: "white", pb: 1, fontSize: isMobile ? (badHeight > 120 ? '0.965em' : '1.35em') : '1em' }}>
                                <strong>Department:</strong> {event.badData.department}
                            </Typography>
                            <Typography ref={storyRef} sx={{ color: "white", pb: 1, fontSize: isMobile ? (badHeight > 120 ? '0.965em' : '1.35em') : '1em' }}>
                                <strong>Story:</strong> {event.badData.story}
                            </Typography>
                            <Typography ref={implicationRef} sx={{
                                color: "white", pb: isMobile ? '0 !important' : 5, fontSize: isMobile ? (badHeight > 120 ? '0.965em' : '1.35em') : '1em',
                            }}>
                                <strong>Implications:</strong> {event.badData.implications}
                            </Typography></animated.div>

                        <AnimatedBox sx={{
                            display: "flex", justifyContent: "space-between",
                        }}
                            style={{ bottom: isMobile ? 25 : 25, position: 'absolute' }}
                        >

                            <animated.div ref={isMobile ? evilFooterRef : ''} style={isMobile ? evilFooterSpring : {}}>
                                {hasMultipleSources && (
                                    <AnimatedBox sx={{ display: "flex", flex: 1, gap: 1, mt: 2, alignItems: "center", pb: isMobile ? 0 : 1 }}
                                        style={{ ...iconLinkSpring }} ref={iconLinkRef}>
                                        <Typography sx={{ color: "white", paddingRight: '1', fontSize: '1em' }}>Sources:</Typography>
                                        {event.badData.sources.map((source, idx) => (
                                            <Tooltip key={idx} title={source.name} arrow>
                                                <IconButton
                                                    onClick={() => sourceOnClick(idx, source)}
                                                    onMouseEnter={() => setHoveredIndex(idx)}
                                                    onMouseLeave={() => setHoveredIndex(null)}
                                                    size="small"
                                                >
                                                    <img
                                                        src={sourceIconMap[source.name]}
                                                        alt={source.name}
                                                        onError={(e) => (e.target.src = "https://via.placeholder.com/24")}
                                                        style={{
                                                            width: 24,
                                                            height: 24,
                                                            objectFit: "contain",
                                                            transform: hoveredIndex === idx ? "scale(1.5)" : "scale(1)",
                                                            transition: "transform 0.2s ease-in-out",
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </AnimatedBox>
                                )}</animated.div>

                            <animated.div ref={isMobile ? evilFooterRef : ''} style={isMobile ? evilFooterSpring : {}}>
                                <Box sx={{ display: "flex", flex: 2, gap: 2, mt: isMobile ? 2.25 : 2.5, alignItems: "center", color: "white" }}>
                                    <Typography style={{ paddingLeft: '15px', fontSize: '1em' }}>Tags:</Typography>
                                    {isMobile
                                        ? event.tags.slice(0, 1).map((tag, idx) => (
                                            <Button
                                                key={idx}
                                                onClick={() => tagOnClick(tag)}
                                                variant="outlined"
                                                size="small"
                                                style={{
                                                    maxWidth: isMobile ? '55px' : 'auto',
                                                    maxHeight: isMobile ? '55px' : 'auto',
                                                    minWidth: isMobile ? '30px' : 'auto',
                                                    minHeight: isMobile ? '30px' : 'auto',
                                                }}
                                            >
                                                <Typography style={{ fontSize: isMobile ? '0.5em' : '1em' }}>
                                                    {tag}
                                                </Typography>
                                            </Button>
                                        ))
                                        : event.tags.map((tag, idx) => (
                                            <Button
                                                key={idx}
                                                onClick={() => tagOnClick(tag)}
                                                variant="outlined"
                                                size="small"
                                                style={{
                                                    maxWidth: isMobile ? '55px' : 'auto',
                                                    maxHeight: isMobile ? '55px' : 'auto',
                                                    minWidth: isMobile ? '30px' : 'auto',
                                                    minHeight: isMobile ? '30px' : 'auto',
                                                }}
                                            >
                                                <Typography style={{ fontSize: isMobile ? '0.5em' : '1em' }}>
                                                    {tag}
                                                </Typography>
                                            </Button>
                                        ))}
                                </Box></animated.div>


                        </AnimatedBox>
                    </CardContent>
                </AnimatedCard>

                <AnimatedCard style={!isMobile ? { ...browserCardSpring, ...cardSpring } : cardSpring }
                    className={isActive ? (isMobile ? 'holy-border-mobile' : 'holy-border') : ''}
                    sx={{
                        minWidth: isMobile ? "90vw" : '40vw',
                        maxWidth: isMobile ? "90vw" : '40vw',
                        minHeight: isMobile ? "25vh" : '50%',
                        maxHeight: isMobile ? "120vh" : '50%',
                        flex: 1,
                        p: 2,
                        backgroundColor: "#fff8dc",
                        color: "#3a3a3a",
                        borderLeft: !isMobile ? "8px solid #ffdd55" : 'none',
                        position: "relative",
                        zIndex: 1, // Ensures it stays above the left card
                        alignSelf: isMobile ? "center" : "flex-start",
                        ...(isMobile && { padding: "2px", fontSize: "0.75em", alignSelf: 'center' }), // Scale down for mobile
                    }}
                    ref={isMobile ? holyCardRef : ''}
                >

                    <CardContent>
                        <animated.div style={isMobile ? wwjdTextSpring : {}} ref={isMobile ? wwjdTextRef : ''}>
                            <>
                                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" 
                                    className={isActive ? "shimmer-typography active-text" : "inactive-text"}
                                    style={{ marginTop: isMobile ? '-0.5em' : 'auto' }}
                                >
                                    {isActive ? "What Would Jesus Do?" : "W.W.J.D."}
                                </Typography>
                            </></animated.div>
                        <animated.div ref={isMobile ? verseRef : ''} style={isMobile ? verseSpring : {}}>
                            <Typography onClick={handleVerseClick}
                                sx={{
                                    display: "block", // Ensures it takes up full width
                                    whiteSpace: "pre-wrap", // Prevents text from collapsing
                                    wordBreak: "break-word", // Ensures long words don't overflow
                                    overflowWrap: "break-word", // Prevents text clipping
                                    pb: isMobile ? 0 : 1,
                                    pt: isMobile ? 1 : 1,
                                    fontSize: isMobile ? '1.25em' : 'auto'
                                }}>
                                <strong style={{ cursor: "pointer" }}>{event.goodData[verseIndex].verse}
                                    {/* {" "}{verseHeight} */}
                                </strong>
                            </Typography>

                            <Typography ref={verseTextRef} sx={{ pb: 1, fontSize: isMobile ? (verseHeight > 200 ? '0.95em' : '0.95em') : '1em' }}>
                                <strong>Text: </strong>"{event.goodData[verseIndex].text}"
                            </Typography>

                            <Typography ref={implicationTextRef} sx={{
                                fontSize: isMobile ? (verseHeight > 200 ? '0.95em' : '0.95em') : '1em',
                            }}>
                                <strong>Implication: </strong>
                                {event.goodData[verseIndex].implication}
                            </Typography>
                        </animated.div>

                        {/* Verse Navigation Buttons */}
                        {hasMultipleVerses && (
                            <AnimatedBox 
                                ref={isMobile ? verseImplicationRef : ''}
                                sx={{ display: "flex", gap: 1, mt: isMobile ? 0 : 2, pt: isMobile ? '0em !important' : 'auto', position: 'absolute' }} 
                                style={isMobile ? { bottom: isMobile ? 15 : 25, ...verseImplicationSpring } : {bottom: 25}}>
                                <Typography sx={{ pt: 0.5, pr: 0.5 }}>Examples: </Typography>
                                {event.goodData.map((_, idx) => (
                                    <Button key={idx} onClick={() => handleVerseButtonClick(idx)} variant="outlined" size="small">
                                        {idx + 1}
                                    </Button>
                                ))}
                            </AnimatedBox>
                        )}
                    </CardContent>
                </AnimatedCard>
            </AnimatedBox>
        </>
    );
}

export default EventCard;