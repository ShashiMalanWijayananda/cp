import { useThree, useFrame } from '@react-three/fiber';
import { create } from 'zustand';

interface CompassStore {
    rotation: number;
    setRotation: (rotation: number) => void;
}

export const useCompassStore = create<CompassStore>((set) => ({
    rotation: 0,
    setRotation: (rotation) => set({ rotation }),
}));

const CompassRotation = () => {
    const { camera } = useThree();
    const setRotation = useCompassStore((state) => state.setRotation);

    useFrame(() => {
        // Convert camera rotation to degrees and normalize to 0-360
        let degrees = -(camera.rotation.y * (180 / Math.PI));
        // Normalize to 0-360
        degrees = ((degrees % 360) + 360) % 360;
        setRotation(degrees);
    });

    return null;
};

export default CompassRotation;
