import { Box, Typography, Link, Container, Stack, Divider, List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSpring, animated, useChain, useSpringRef, config } from "@react-spring/web";
import { useLocation } from 'react-router-dom';

const About = () => {
    const location = useLocation();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        setAnimate(!animate);
    }, [location.pathname]);

    const subtleWhite = 'rgba(255, 255, 255, 0.7)';
    const dividerColor = 'rgba(255, 255, 255, 0.3)';

    // Refs for chaining animations
    const quoteRef = useSpringRef();
    const aboutRef = useSpringRef();
    const radicalJesusRef = useSpringRef();
    const jesusActionsRef = useSpringRef();
    const oldTestamentRef = useSpringRef();
    const areYouAwakeRef = useSpringRef();

    const springConfig = config.stiff;
    // Animations for each section
    const quoteAnimation = useSpring({
        ref: quoteRef,
        from: { opacity: 0, transform: 'translateX(25%)' },
        to: { opacity: 1, transform: animate ? 'translateX(0%)' : 'translateX(25%)' },
        config: springConfig, 
        reset: true
    });

    const aboutAnimation = useSpring({
        ref: aboutRef,
        from: { opacity: 0, transform: 'translateX(-25%)' },
        to: { opacity: 1, transform: 'translateX(0%)' },
        config: springConfig, 
        reset: true
    });

    const radicalJesusAnimation = useSpring({
        ref: radicalJesusRef,
        from: { opacity: 0, transform: 'translateX(25%)' },
        to: { opacity: 1, transform: 'translateX(0%)' },
        config: springConfig, 
        reset: true
    });

    const jesusActionsAnimation = useSpring({
        ref: jesusActionsRef,
        from: { opacity: 0, transform: 'translateX(-25%)' },
        to: { opacity: 1, transform: 'translateX(0%)' },
        config: springConfig, 
        reset: true
    });

    const oldTestamentAnimation = useSpring({
        ref: oldTestamentRef,
        from: { opacity: 0, transform: 'translateX(25%)' },
        to: { opacity: 1, transform: 'translateX(0%)' },
        config: springConfig, 
        reset: true
    });

    const areYouAwakeAnimation = useSpring({
        ref: areYouAwakeRef,
        from: { opacity: 0, transform: 'translateX(-25%)' },
        to: { opacity: 1, transform: 'translateX(0%)' },
        config: springConfig,
        reset: true
    });

    // Chain the animations
    useChain([
        quoteRef,
        aboutRef,
        radicalJesusRef,
        jesusActionsRef,
        oldTestamentRef,
        areYouAwakeRef,
    ], [0, 0.15, 0.3, 0.45, 0.6, 0.75]);

    const mathew5Tooltip = "'Do not think that I have come to abolish the Law or the Prophets; I have not come to abolish them but to fulfill them. For truly I tell you, until heaven and earth disappear, not the smallest letter, not the least stroke of a pen, will by any means disappear from the Law until everything is accomplished.'";
    const mathew12Tooltip = "'If you had known what these words mean, \'I desire mercy, not sacrifice,\' you would not have condemned the innocent.'";
    const hosea6Tooltip = "'For I desire mercy, not sacrifice, and acknowledgment of God rather than burnt offerings.'";
    const mark2Tooltip = "'Then he said to them, \"The Sabbath was made for man, not man for the Sabbath.\"'";

    return (
        <Box sx={{
            backgroundColor: "hsla(0, 0%, 0%, 0.6)", 
            py: 6, 
            color: "white",
            mb: -2
        }}>
            {/* SEO Metadata Removed */}

            <Container maxWidth="md">
                <Stack spacing={5} divider={<Divider sx={{ borderColor: dividerColor }} />}>
                    <animated.div style={quoteAnimation} ref={quoteRef}>
                        <Box style={{ textAlign: "center", backgroundColor: "hsla(0, 0%, 0%, 0.7)", borderRadius: '5px', p: '4px' }}>
                            <Typography variant="h5" component="blockquote" sx={{ fontStyle: "italic", fontWeight: "bold", mb: 1 }}>
                                "My soul is overwhelmed with sorrow to the point of death. Stay here and keep watch with me."
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: subtleWhite }}>— Matthew 26:38</Typography>
                            <Box sx={{ my: 3 }} /> 
                            <Typography variant="h5" component="blockquote" sx={{ fontStyle: "italic", fontWeight: "bold", mb: 1 }}>
                                "Father, forgive them, for they do not know what they are doing."
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: subtleWhite }}>— Luke 23:34</Typography>
                        </Box>
                    </animated.div>

                    <animated.div style={aboutAnimation} ref={aboutRef}>
                        <Stack spacing={2} sx={{ textAlign: 'center' }}> 
                            <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
                                About WWJD2025
                            </Typography>
                            <Typography sx={{ textAlign: "left", lineHeight: 1.8, px: { xs: 0, sm: 4 } }}> {/* Left-align longer text for readability, add horizontal padding on larger screens */}
                                The purpose of this site is to decouple the ever-strengthening combination of <strong>Christian Nationalism</strong>.
                                In its current form, it has become a weaponization of the Christian faith by an <strong>incredibly wealthy elite </strong> who seek to 
                                <Link href="https://www.investopedia.com/billionaires-who-bought-publishers-5270187" target="_blank" rel="noopener noreferrer" sx={{ color: "#ffcc00", textDecoration: "underline", mx: 0.5 }}>
                                    increase their control
                                </Link>
                                and pad their already 
                                <Link href="https://dbkrupp.github.io/1-pixel-wealth/" target="_blank" rel="noopener noreferrer" sx={{ color: "#ffcc00", textDecoration: "underline", mx: 0.5 }}>
                                    inhumane wealth
                                </Link>
                                through immoral policies.
                            </Typography>
                        </Stack>
                    </animated.div>

                    <animated.div style={radicalJesusAnimation} ref={radicalJesusRef}>
                        <Stack spacing={2} sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
                                The Radical Jesus
                            </Typography>
                            <Typography sx={{ textAlign: "left", lineHeight: 1.8, px: { xs: 0, sm: 4 } }}>
                                Jesus was an <strong>anti-establishment radical</strong> who defied cultural norms.
                                He was eventually <strong>executed by the state</strong>, but He transformed His suffering into freedom for all—regardless of birthplace or identity.
                            </Typography>
                        </Stack>
                    </animated.div>

                    <animated.div style={jesusActionsAnimation} ref={jesusActionsRef}>
                        <Stack spacing={2} sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
                                Jesus' Actions
                            </Typography>
                            <Typography sx={{ textAlign: "left", lineHeight: 1.7, px: { xs: 0, sm: 4 } }}> {/* Slightly tighter line height for the intro */}
                                Jesus actively opposed hypocrisy and oppression. He healed and spoke with those who were seen as <strong>'others'</strong>:
                            </Typography>
                            <List sx={{ width: '100%', maxWidth: 480, margin: '0 auto', ta: 'center', px: { xs: 0, sm: 4 } }}>
                                <ListItem disablePadding>
                                    <ListItemText primary="• He uplifted women in a society that shunned them." sx={{ color: 'white' }} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="• He welcomed foreigners and social outcasts." sx={{ color: 'white' }} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="• He dined with tax collectors, despised by the people." sx={{ color: 'white' }} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="• He clashed against rigid religious norms." sx={{ color: 'white' }} />
                                </ListItem>
                            </List>
                        </Stack>
                    </animated.div>

                    <animated.div style={oldTestamentAnimation} ref={oldTestamentRef}>
                        <Stack spacing={2} sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
                                What About the Old Testament?
                            </Typography>
                            <Typography sx={{ textAlign: "left", lineHeight: 1.8, px: { xs: 0, sm: 4 } }}>
                                The Old Testament is a collection of historical accounts and poetry, written for a specific people in a specific time.
                                </Typography>
                                <Typography sx={{ textAlign: "left", lineHeight: 1.8, px: { xs: 0, sm: 4 } }}>
                                Jesus deeply respected the Hebrew Scriptures (the Old Testament), viewing them as God's word and drawing upon their history, wisdom, and prophecy. He affirmed their divine origin  
                                {" "}<Tooltip title={mathew5Tooltip} arrow placement="top">
                                                                <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                                                                     (Matthew 5:17-18) 
                                                                </span>
                                                            </Tooltip>
                                 , yet He didn't always interpret them strictly literally. 
                                </Typography>
                                <Typography sx={{ textAlign: "left", lineHeight: 1.8, px: { xs: 0, sm: 4 } }}>
                                Instead, Jesus often focused on the underlying spirit and intent of the Law, challenging interpretations that missed the core principles of love, mercy, and justice 
                                {" "}<Tooltip title={mathew12Tooltip} arrow placement="top" onClick={() => window.open('https://www.biblegateway.com/passage/?search=Matthew12:7', '_blank')}>
                                                                <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                                                                     (Matthew 12:7) 
                                                                </span>
                                                            </Tooltip>
                                {" "}<Tooltip title={hosea6Tooltip} arrow placement="top"  onClick={() => window.open('https://www.biblegateway.com/passage/?search=Hosea6:6', '_blank')}>
                                    <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                                            (Hosea 6:6) 
                                    </span>
                                </Tooltip>
                                {" "}<Tooltip title={mark2Tooltip} arrow placement="top" onClick={() => window.open('https://www.biblegateway.com/passage/?search=Mark2:27', '_blank')}>
                                    <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                                            (Mark 2:27) 
                                    </span>
                                </Tooltip>
                                . He fulfilled the Law not by merely following rules, but by embodying its ultimate purpose, calling His followers to a deeper righteousness that flowed from the heart. (Matthew 5:21-48)
                                </Typography>
                                <Typography sx={{ textAlign: "left", lineHeight: 1.8, px: { xs: 0, sm: 4 } }}>
                                While the Old Testament holds wisdom, much of its content is being taken out of societal context 2000+ years later. <strong>Jesus' words and actions</strong> should be the true beacon for Christian action today.
                                </Typography>
                        </Stack>
                    </animated.div>

                    <animated.div style={{...areYouAwakeAnimation, paddingBottom: '8%'}} ref={areYouAwakeRef}>
                        <Stack spacing={3} sx={{ textAlign: 'center' }}> 
                            <Typography variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
                                Are You Awake?
                            </Typography>
                            <Typography sx={{ textAlign: "left", lineHeight: 1.8, px: { xs: 0, sm: 4 } }}>
                                Before His crucifixion, Jesus pleaded with His disciples to <i>stay awake</i>.
                                On the cross, He proclaimed, <strong>"they know not what they do."</strong>
                            </Typography>
                            <Typography sx={{ textAlign: "left", lineHeight: 1.8, fontWeight: 'bold', px: { xs: 0, sm: 4 } }}>
                                Are you awake? Do you live with intention? <span style={{ fontWeight: 'normal' }}>The most powerful policymakers hope you do not.</span>
                            </Typography>
                        </Stack>
                    </animated.div>
                </Stack>
            </Container>
        </Box>
    );
};

export default About;