import React from "react";
import LottieView from "lottie-react-native";

type AnimationsPlantsProps = {
    name: string;
};

const animationSources: Record<string, any> = {
    TOMATES: require("../../../../../../assets/lottie-animations/tomato.json"),
    TOMATE: require("../../../../../../assets/lottie-animations/tomato.json"),
    BATATAS: require("../../../../../../assets/lottie-animations/batato.json"),
    BATATA: require("../../../../../../assets/lottie-animations/batato.json"),
    CEBOLINHA: require("../../../../../../assets/lottie-animations/onion.json"),
    CEBOLA: require("../../../../../../assets/lottie-animations/onion.json"),
    RABANETE: require("../../../../../../assets/lottie-animations/rabanete.json"),
    RABANETES: require("../../../../../../assets/lottie-animations/rabanete.json"),
};

const getDefaultAnimationSource = () => require("../../../../../../assets/lottie-animations/animation_lls35soi.json");

const AnimationsPlants: React.FC<AnimationsPlantsProps> = ({ name }) => {
    const animationSource = animationSources[name] || getDefaultAnimationSource();

    return (
        <LottieView
            source={animationSource}
            autoPlay={true}
            style={{ width: "100%", height: "100%" }}
        />
    );
}

export default AnimationsPlants;
