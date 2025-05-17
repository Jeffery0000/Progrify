import React, { useState, useEffect } from 'react';
// Import pet images
import pet1Image from '../images/pet1.png';
import pet2Image from '../images/pet2.png';
import pet3Image from '../images/pet3.png';
import backgroundImage from '../images/background.png';
// Import custom animation styles
import '../styles/pet-animations.css';

interface PetDisplayProps {
    level: number;
    animationTrigger?: 'idle' | 'easy' | 'medium' | 'hard';
}

const PetDisplay: React.FC<PetDisplayProps> = ({ level, animationTrigger = 'idle' }) => {
    const [animationClass, setAnimationClass] = useState('pet-idle');
    const [animationKey, setAnimationKey] = useState(0); // Force re-render on animation change

    // Determine which pet to show based on level
    const getPetImage = () => {
        if (level >= 10) {
            return pet3Image;
        } else if (level >= 5) {
            return pet2Image;
        } else {
            return pet1Image;
        }
    };

    // Get description based on pet level
    const getPetDescription = () => {
        if (level >= 10) {
            return "Your pet has reached its final form!";
        } else if (level >= 5) {
            return "Your pet is growing stronger with each task!";
        } else {
            return "Your pet is just starting its journey with you.";
        }
    };

    useEffect(() => {
        console.log("Animation trigger changed to:", animationTrigger);

        // Update animation class based on trigger
        switch (animationTrigger) {
            case 'easy':
                setAnimationClass('pet-easy');
                break;
            case 'medium':
                setAnimationClass('pet-medium');
                break;
            case 'hard':
                setAnimationClass('pet-hard');
                break;
            default:
                setAnimationClass('pet-idle');
        }

        // Force re-render to restart animation
        setAnimationKey(prev => prev + 1);

        // Return to idle after animation completes (if not already idle)
        if (animationTrigger !== 'idle') {
            const timeout = setTimeout(() => {
                setAnimationClass('pet-idle');
                setAnimationKey(prev => prev + 1); // Force re-render again
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [animationTrigger]);

    return (
        <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col h-full relative">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Your Pet</h3>

            {/* Pet display area with background image */}
            <div
                className="flex-grow flex items-center justify-center rounded-lg overflow-hidden relative"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Key attribute forces component to re-render when animation changes */}
                <div
                    key={animationKey}
                    className={`pet-container ${animationClass} z-10`}
                    style={{ width: '80%', maxWidth: '200px' }}
                >
                    <img
                        src={getPetImage()}
                        alt="Virtual pet"
                        className="w-full h-auto"
                        onError={(e) => {
                            console.error("Pet image failed to load:", e);
                        }}
                    />
                </div>
            </div>

            <p className="text-sm text-center text-gray-600 mt-3">
                {getPetDescription()}
            </p>
        </div>
    );
};

export default PetDisplay;