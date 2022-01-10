import {
    Container,
    Fade,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BackgroundMapKeys } from '../../assets/images/backgrounds';
import {
    lobbyStairs,
    nachoShack,
    savannaOasis,
    workstation,
} from '../../assets/images/minecraft/lobby';
import { interpolateTitle, setBackgroundOverride } from '../../redux/slices/main.slice';
import './Minecraft.css';
import PublicIcon from '@mui/icons-material/Public';
import BuildIcon from '@mui/icons-material/Build';
import ExtensionIcon from '@mui/icons-material/Extension';
import JoinStepper from './JoinStepper';
import { courtyard } from '../../assets/images/minecraft/daeani_castle';
import ImageGallery from './ImageGallery';
import FadedImage from '../Misc/FadedImage';

const Minecraft = () => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const isLarge = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        dispatch(interpolateTitle(`Minecraft`));
        dispatch(setBackgroundOverride(BackgroundMapKeys.minecraft));

        return () => {
            dispatch(setBackgroundOverride(null));
        };
    }, [dispatch]);

    return (
        <Fade in>
            <Container maxWidth="xl" className="minecraftGrid" sx={{ mt: isLarge ? undefined : 3 }}>
                <Grid container spacing={2} columns={{ xs: 4, md: 12 }}>
                    <Grid item xs={7}>
                        <Typography variant="h2" gutterBottom>
                            About
                        </Typography>
                        <Typography>
                            The University of Auckland Minecraft server is a public survival world
                            with various additions to improve the vanilla experience for all
                            players, such as:
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemButton
                                    component="a"
                                    href="https://www.planetminecraft.com/data-pack/terralith-overworld-evolved-100-biomes-caves-and-more/"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <ListItemIcon>
                                        <PublicIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Terralith"
                                        secondary="Overhauled Terrain Generation"
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    component="a"
                                    href="https://vanillatweaks.net/picker/datapacks/#"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <ListItemIcon>
                                        <BuildIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Vanilla Tweaks"
                                        secondary="Quality of Life Improvements"
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ExtensionIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="TPA, Home, Warp"
                                        secondary="Fast Transport Plugins"
                                    />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={5}>
                        <FadedImage
                            src={nachoShack.source}
                            alt={nachoShack.alt}
                            style={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FadedImage
                            src={workstation.source}
                            alt={workstation.alt}
                            style={{ width: '100%' }}
                        />
                        <Stack direction="row" overflow="hidden" spacing={1} sx={{ pb: 5 }}>
                            <FadedImage
                                src={courtyard.source}
                                alt={savannaOasis.alt}
                                style={{ maxWidth: '50%' }}
                            />
                            <FadedImage
                                src={lobbyStairs.source}
                                alt={lobbyStairs.alt}
                                style={{ maxWidth: '50%' }}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h2" gutterBottom>
                            Joining
                        </Typography>
                        <Typography gutterBottom>
                            <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>Anyone</span>{' '}
                            can join the server, you don't need to be attending Auckland University,
                            or even be in New Zealand!
                        </Typography>
                        <JoinStepper />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" gutterBottom textAlign="center">
                            Photo Gallery
                        </Typography>
                    </Grid>
                    <ImageGallery />
                </Grid>
            </Container>
        </Fade>
    );
};

export default Minecraft;
