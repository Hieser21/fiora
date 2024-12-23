import BackgroundImage from '@fiora/assets/images/background.jpg';
import BackgroundCoolImage from '@fiora/assets/images/background-cool.jpg';

type Themes = {
    [theme: string]: {
        primaryColor: string;
        primaryTextColor: string;
        backgroundImage: string;
        aero: boolean;
    };
};

const themes: Themes = {
    default: {
        primaryColor: '255, 0, 0',  // Vibrant Persona 5 red
        primaryTextColor: '255, 255, 255', // Sharp white text
        backgroundImage: BackgroundImage,
        aero: false,
    },
    cool: {
        primaryColor: '6, 147, 227',  // Sky blue
        primaryTextColor: '240, 248, 255', // Alice blue
        backgroundImage: BackgroundCoolImage,
        aero: false,
    },
};

export default themes;
