import {
    Box,
    Button,
    Stack,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Link,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import RuleIcon from './RuleIcon';
import DiscordIcon from './DiscordIcon';
import GavelIcon from '@mui/icons-material/Gavel';
import CreateIcon from '@mui/icons-material/Create';
import TimerIcon from '@mui/icons-material/Timer';
import exampleWhitelist from '../../assets/images/minecraft/utility/exampleWhitelist.png';

const steps: { label: string; description: JSX.Element; icon?: JSX.Element }[] = [
    {
        icon: <DiscordIcon />,
        label: 'Join the Discord',
        description: (
            <Typography>
                Join the discord server at{' '}
                <Link
                    href="https://discord.gg/Ds4bfVac6J"
                    target="_blank"
                    rel="noopener"
                    onClick={(e) => {
                        // doesn't seem to want to open on a normal click :/
                        // yes im aware this is bad practice
                        // https://developer.mozilla.org/en-US/docs/Web/API/Window/open (like very bad)
                        // FIXME: this :///
                        e.preventDefault();
                        window.open('https://discord.gg/Ds4bfVac6J', '_blank');
                    }}
                >
                    discord.gg/Ds4bfVac6J
                </Link>
                , you'll need to stay in here to play on the server.
            </Typography>
        ),
    },
    {
        icon: <GavelIcon sx={{ marginBottom: '-6px' }} />,
        label: 'Read the Rules',
        description: (
            <Typography>
                The{' '}
                <span className="rulesChannel noselect">
                    <RuleIcon />
                    #rules
                </span>{' '}
                channel always has the up-to-date summary of server rules and information
                <br />
                Make sure you at least know the basic stuff.
            </Typography>
        ),
    },
    {
        icon: <CreateIcon sx={{ marginBottom: '-6px' }} />,
        label: `Apply for Whitelist`,
        description: (
            <>
                <Typography gutterBottom>
                    Type{' '}
                    <span
                        style={{
                            backgroundColor: '#272727',
                            padding: '1px 5px',
                            borderRadius: '5px',
                        }}
                    >
                        neko w <span style={{ color: 'aquamarine' }}>Your Minecraft username</span>
                    </span>{' '}
                    in the #bot-commands channel to apply.
                </Typography>
                <img
                    loading="eager"
                    src={exampleWhitelist}
                    style={{
                        maxWidth: '100%',
                        borderRadius: '3px',
                    }}
                    alt="An example interaction of how to get whitelisted, Discord user NachoToast types 'neko w NachoToast' to which the bot (NachoBot) responds 'Successfully submitted a whitelist application for NachoToast' "
                />
            </>
        ),
    },
    {
        icon: <TimerIcon sx={{ marginBottom: '-6px' }} />,
        label: `Wait`,
        description: (
            <Typography>
                Wait for an admin to review your whitelist application. You'll get notified when it
                gets accepted, or messaged there's an issue.
            </Typography>
        ),
    },
];

const JoinStepper = () => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (e.key === 'ArrowDown') {
                if (activeStep !== steps.length - 1) {
                    e.preventDefault();
                    setActiveStep(activeStep + 1);
                }
            } else if (e.key === 'ArrowUp') {
                if (activeStep !== 0) {
                    e.preventDefault();
                    setActiveStep(activeStep - 1);
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [activeStep]);

    return (
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ pb: 1 }}>
            {steps.map(({ label, description, icon }, index) => (
                <Step
                    key={index}
                    completed={false}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveStep(index);
                    }}
                >
                    <StepLabel>
                        <Typography>
                            {!!icon && <span style={{ marginRight: '5px' }}>{icon}</span>}
                            {label}
                        </Typography>
                    </StepLabel>
                    <StepContent>
                        <Box>
                            <div style={{ flexGrow: 1 }}>{description}</div>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                {index !== 0 && (
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveStep(index - 1);
                                        }}
                                        variant="outlined"
                                    >
                                        Previous
                                    </Button>
                                )}
                                {index !== steps.length - 1 && (
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveStep(index + 1);
                                        }}
                                        variant="outlined"
                                    >
                                        Next
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    </StepContent>
                </Step>
            ))}
        </Stepper>
    );
};

export default JoinStepper;
