import { Composition } from "remotion";
import { Trailer } from "./Trailer";
import { LaunchFilm } from "./LaunchFilm";
import { BrandFilm } from "./BrandFilm";
import { ChaosFilm } from "./ChaosFilm";
import { TechIntro } from "./TechIntro";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="Trailer"
                component={Trailer}
                durationInFrames={600}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="LaunchFilm"
                component={LaunchFilm}
                durationInFrames={600}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="BrandFilm"
                component={BrandFilm}
                durationInFrames={600}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="ChaosFilm"
                component={ChaosFilm}
                durationInFrames={600}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="TechIntro"
                component={TechIntro}
                durationInFrames={480}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
