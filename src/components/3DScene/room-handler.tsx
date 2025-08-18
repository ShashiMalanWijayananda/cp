import React, { useEffect, useMemo, useRef, useState } from "react";

// r3f
import { useLoader, useFrame } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import {
    LinearFilter,
    Mesh,
    MeshStandardMaterial,
    RepeatWrapping,
    TextureLoader,
    LoadingManager,
    DoubleSide,
    Texture,
} from "three";

// Configure DRACO loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Type definitions
interface TextureConfig {
    textures: string[];
    materialProps: any;
    repeat: [number, number];
    wrapMode: typeof RepeatWrapping;
}

interface SimpleTextureConfig {
    texture: string;
    props?: any;
}

// Texture mapping configuration
const TEXTURE_CONFIGS: { [key: string]: TextureConfig } = {
    'Wall': {
        textures: [
            '/textures/brick_wall_02_diff_2k.webp',
            '/textures/brick_wall_02_nor_dx_2k.webp',
            '/textures/brick_wall_02_disp_2k.webp',
            '/textures/brick_wall_02_rough_2k.webp'
        ],
        materialProps: {
            displacementScale: 0,
            roughness: 1.0,
            metalness: 0.0
        },
        repeat: [2, 2],
        wrapMode: RepeatWrapping
    },
    'Cube002': {
        textures: [
            '/textures/wood_planks_diff_2k.webp',
            '/textures/wood_planks_nor_dx_2k.webp',
            '/textures/wood_planks_disp_2k.webp',
            '/textures/wood_planks_rough_2k.webp'
        ],
        materialProps: {
            displacementScale: 0,
            roughness: 1.0,
            metalness: 0.0
        },
        repeat: [2, 2],
        wrapMode: RepeatWrapping
    },
    'Plane': {
        textures: [
            '/textures/forest_ground_04_diff_2k.webp',
            '/textures/forest_ground_04_nor_dx_2k.webp',
            '/textures/forest_ground_04_disp_2k.webp',
            '/textures/forest_ground_04_rough_2k.webp'
        ],
        materialProps: {
            displacementScale: 0,
            roughness: 1.0,
            metalness: 0.0
        },
        repeat: [1.5, 1.5],
        wrapMode: RepeatWrapping
    }
};

// Simple texture mapping for single-texture objects
const SIMPLE_TEXTURE_MAP: { [key: string]: SimpleTextureConfig } = {
    'barrel': { texture: '/textures/3c2b985bb0856e124604e2f9407ddeca.webp' },
    'barrel001': { texture: '/textures/3c2b985bb0856e124604e2f9407ddeca.webp' },
    'barrel002': { texture: '/textures/3c2b985bb0856e124604e2f9407ddeca.webp' },
    'barrel003': { texture: '/textures/b6780ab40d298075aaa79242f164652f.webp' },
    'barrel004': { texture: '/textures/b6780ab40d298075aaa79242f164652f.webp' },
    'tyre': { texture: '/textures/2403abf5ca43eecb90bbbdcb8dbc102c.webp' },
    'tyre001': { texture: '/textures/2403abf5ca43eecb90bbbdcb8dbc102c.webp' },
    'Cube005': { texture: '/textures/Capture4.webp' },
    'Cube010': { texture: '/textures/Capture8.webp' },
    'Cube007': { texture: '/textures/Capture7.webp' },
    'Cube009': { texture: '/textures/Capture6.webp' },
    'Cube008': { texture: '/textures/Capture5.webp' },
    'cube007': { texture: '/textures/Capture7.webp' },
    'cube008': { texture: '/textures/Capture5.webp' },
    'cube009': { texture: '/textures/Capture6.webp' },
    'Blade_Runner_Poster001': { texture: '/textures/Capture18.webp' },
    'Plane014': { texture: '/textures/Capture11.webp' },
    'pCube21': { texture: '/textures/Capture16.webp' },
    'pCube20': { texture: '/textures/Capture17.webp' },
    'Stack_of_Papers002': { texture: '/textures/paper side.webp' },
    'military_box_1001': { texture: '/textures/c89.webp' },
    'military_box_1': { texture: '/textures/c89.webp' },
    'submarine_table_big001': { texture: '/textures/c89.webp' },
    'submarine_table_small': { texture: '/textures/c89.webp' },
    'binocular': { texture: '/textures/c89.webp' },
    'Cube001': { texture: '/textures/Akai.GX635BD.webp' },
    'tv_2': { texture: '/textures/s-l4001.webp' },
    'tv_3': { texture: '/textures/s-l300.webp' },
    'tv_1': { texture: '/textures/Screenshot 2025-06-06 at 20-34-41 Google-Search.webp' },
    'setup001': { texture: '/textures/Capture1.webp' },
    'setup002': { texture: '/textures/Capture1.webp' },
    'setup003': { texture: '/textures/Capture1.webp' },
    'setup004': { texture: '/textures/Capture.webp' },
    'setup005': { texture: '/textures/Capture.webp' },
    'setup006': { texture: '/textures/Capture.webp' },
    'Cube052': { texture: '/textures/cpu.png' },
    'Cube004': { texture: '/textures/Capture3.webp' },
    'Cube011': { texture: '/textures/Capture12.webp' },
    'Cube014': { texture: '/textures/Capture13.webp' },
    'cube014': { texture: '/textures/Capture13.webp' },
    'Cube012': { texture: '/textures/Capture19.webp' },
    'Phone': { texture: '/textures/retro_phone.png' },
    'Phone_Box': { texture: '/textures/retro_phone.png' },
    'submarine_big': { texture: '/textures/Submarine big1.webp' },
    'Clipboard003': { texture: '/textures/Submarine!.webp' },
    'Clipboard004': { texture: '/textures/Principals of Digital Audio.webp' },
    'Clipboard002': { texture: '/textures/Military Ciphers.webp' },
    'Clipboard006': { texture: '/textures/La Cryptographie Militare.webp' },
    'Clipboard': { texture: '/textures/Serious Cryptography.webp' },
    'Sticky_Note_1': {
        texture: '/textures/Capture15.webp',
        props: {
            transparent: true,
            alphaTest: 0.5,
            magFilter: LinearFilter,
            minFilter: LinearFilter,
            generateMipmaps: false
        }
    },
    'pCube21001': {
        texture: '/textures/Capture14.webp',
        props: {
            transparent: true,
            opacity: 1.0,
            side: DoubleSide,
            roughness: 0.553,
            metalness: 0.0
        }
    }
};

// Color-only materials
const COLOR_MATERIALS: { [key: string]: any } = {
    'computer002': {
        color: '#5E6B51',
        roughness: 0.341,
        metalness: 0.382
    },
    'mesh_with_bsdf': {
        color: 0x5E6B51,
        metalness: 0.382,
        roughness: 0.341,
        envMapIntensity: 1.450,
        transparent: true,
        opacity: 1.0
    }
};

// Special cases that need custom handling
const SPECIAL_CASES = [
    'Computer_Monitor',
    'Computer_Monitor_Stand',
    'Monitor_Stand',
    'hinge',
    'computer002',
    'Cube001',
    'tape_recoder_disk_1',
    'tape_recoder_disk_2',
    'Cube035',
    'setup',
    'tv_1',
    'Trash_Cam',
    'setup004',
    'setup005',
    'setup006',
    'Clipboard002',
    'Clipboard005',
    'tyre',
    'tyre001',
    'Shelf001',
    'Shelf002',
    'Binders',
    'Half_Life_Game_Box_256x256',
    'Fallout_2_Game_Box_256x256',
    'Stack_of_Papers003',
    'book012001',
    'Half_Life_Game_Box_256x256001',
    'book012013',
    'book009030',
    'Half_Life_Game_Box_256x256002',
    'book009030',
    'book008005',
    'Half_Life_Game_Box_256x256003',
    'Handbook_for_the_Recently_Deceased001',
    'book010'
];
class TextureCache {
    private cache = new Map<string, Texture>();
    private materialCache = new Map<string, MeshStandardMaterial>();
    private loader: TextureLoader;

    constructor(manager: LoadingManager) {
        this.loader = new TextureLoader(manager);
    }

    async getTexture(url: string): Promise<Texture> {
        if (this.cache.has(url)) {
            return this.cache.get(url)!.clone();
        }

        const texture = await this.loader.loadAsync(url);
        this.cache.set(url, texture);
        return texture.clone();
    }

    getMaterial(key: string): MeshStandardMaterial | undefined {
        return this.materialCache.get(key);
    }

    setMaterial(key: string, material: MeshStandardMaterial) {
        this.materialCache.set(key, material);
    }

    dispose() {
        this.cache.forEach(texture => texture.dispose());
        this.cache.clear();
        this.materialCache.forEach(material => material.dispose());
        this.materialCache.clear();
    }
}

const RoomHandler: React.FC = () => {
    const [isRadioMeshClicked, setIsRadioMeshClicked] = useState<boolean>(false);

    useEffect(() => {
        let radioWheelRotationTimeout: any;
        const handleRadioWheelMovement = () => {
            setIsRadioMeshClicked(true);
            radioWheelRotationTimeout = setTimeout(() => {
                setIsRadioMeshClicked(false);
            }, 1000 * 30);
        }
        window.addEventListener('turnOnThePlayer', handleRadioWheelMovement);

        return () => {
            window.removeEventListener('turnOnThePlayer', handleRadioWheelMovement);
            window.clearTimeout(radioWheelRotationTimeout);
        }
    }, [])

    const textureCache = useRef<TextureCache | null>(null);
    const manager = useMemo(() => {
        const loadManager = new LoadingManager();

        return loadManager;
    }, []);

    const fbx = useLoader(FBXLoader, "/models/room.fbx", undefined);

    const chair = useLoader(GLTFLoader, "/models/chair.glb", undefined);

    const computer = useLoader(GLTFLoader, "/models/computer.glb", undefined);

    const radio = useLoader(GLTFLoader, "/models/radio_body.glb", undefined);

    const radioWheelLeft = useLoader(GLTFLoader, "/models/radio_wheel_left.glb", undefined);

    const radioWheelRight = useLoader(GLTFLoader, "/models/radio_wheel_right.glb", undefined);

    const oscilloscope = useLoader(GLTFLoader, "/models/oscilloscope.glb", (loader) => {
        if (loader instanceof GLTFLoader) {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
            loader.setDRACOLoader(dracoLoader);
        }
    });

    const monitor = useLoader(GLTFLoader, "/models/monitor.glb", undefined);

    const smallTv = useLoader(GLTFLoader, "/models/small_tv.glb", undefined);

    const floorBoxes = useLoader(GLTFLoader, "/models/floor_boxes.glb", undefined);

    const bin = useLoader(GLTFLoader, "/models/bin.glb", undefined);

    const tyreStack = useLoader(GLTFLoader, "/models/tyre_stack.glb", undefined);

    const bookRackLeft = useLoader(GLTFLoader, "/models/book_rack_left.glb", undefined);

    const bookRackRight = useLoader(GLTFLoader, "/models/book_rack_right.glb", undefined);

    const books = useLoader(GLTFLoader, "/models/books.glb", undefined);

    // Initialize texture cache
    useEffect(() => {
        textureCache.current = new TextureCache(manager);

        // Position the chair in the scene
        if (chair) {
            chair.scene.position.set(-1.55, 0.1, -1.65);
            chair.scene.scale.set(1.05, 1.05, 1.05);
            chair.scene.rotation.y = Math.PI / 40;
        }

        // Position the computer in the scene
        if (computer) {
            computer.scene.position.set(-0.4, 1, -2.59);
            computer.scene.scale.set(1.05, 1.05, 1.05);
            computer.scene.rotation.y = Math.PI / 200;
        }

        // Position the radio in the scene
        if (radio) {
            radio.scene.position.set(-2.54, 1.14, -1.7);
            radio.scene.scale.set(1, 1, 1);
            radio.scene.rotation.y = Math.PI / 1;
        }

        // Position the radio wheel left in the scene
        if (radioWheelLeft) {
            radioWheelLeft.scene.position.set(-2.43, 1.35, -1.545);
            radioWheelLeft.scene.scale.set(1, 1, 1);
            radioWheelLeft.scene.rotation.y = Math.PI / 1;
        }

        // Position the radio wheel right in the scene
        if (radioWheelRight) {
            radioWheelRight.scene.position.set(-2.43, 1.35, -1.85);
            radioWheelRight.scene.scale.set(1, 1, 1);
            radioWheelRight.scene.rotation.y = Math.PI / 1;
        }

        // Position the oscilloscope in the scene
        if (oscilloscope) {
            oscilloscope.scene.position.set(-2.42, 1.14, -2.40); // Position next to the radio
            oscilloscope.scene.scale.set(1, 1, 1);
            oscilloscope.scene.rotation.y = 5.7;
        }

        // Position the monitor in the scene
        if (monitor) {
            monitor.scene.position.set(.86, 1.36, -2.4);
            monitor.scene.scale.set(1.05, 1.05, 1.05);
            monitor.scene.rotation.y = Math.PI / 200;
        }

        // Position the small TV in the scene
        if (smallTv) {
            smallTv.scene.position.set(-1.66, 1, -2.58);
            smallTv.scene.scale.set(1, 1, 1);
            smallTv.scene.rotation.y = 0;
        }

        // Position the floor boxes in the scene
        if (floorBoxes) {
            floorBoxes.scene.position.set(-1.17, .25, -2.4); // Position near the floor
            floorBoxes.scene.scale.set(1.1, 1.1, 1.1);
            floorBoxes.scene.rotation.y = Math.PI / 6; // Slight rotation
        }

        // Position the bin in the scene
        if (bin) {
            bin.scene.position.set(-.64, -0.02, -2.3);
            bin.scene.scale.set(.85, .85, .85);
            bin.scene.rotation.y = Math.PI / 4;
        }

        // Position the tyre stack in the scene
        if (tyreStack) {
            tyreStack.scene.position.set(-2.45, 0, -1.8);
            tyreStack.scene.scale.set(.95, .95, .95);
            tyreStack.scene.rotation.y = Math.PI / 6;
        }

        // Position the book rack in the scene
        if (bookRackLeft) {
            bookRackLeft.scene.position.set(4.08, 1.6, -2.8); // Position near the wall
            bookRackLeft.scene.scale.set(1.1, 1, 1);
            bookRackLeft.scene.rotation.y = Math.PI / 1; // Align with wall
        }

        // Position the book rack in the scene
        if (bookRackRight) {
            bookRackRight.scene.position.set(5.24, 1.6, -2.8); // Position near the wall
            bookRackRight.scene.scale.set(1.1, 1, 1);
            bookRackRight.scene.rotation.y = Math.PI / 1; // Align with wall
        }

        // Position the books in the scene
        if (books && books.scene) {
            books.scene.position.set(4.65, 1.26, -2.9); // Position on the right book rack
            books.scene.rotation.set(0, 0, 0);
            books.scene.scale.set(1, 1, 1);
        }

        return () => {
            // Dispose textures and materials
            textureCache.current?.dispose();

            // Dispose geometries and materials from models
            [chair, computer, radio, radioWheelLeft, radioWheelRight, oscilloscope, monitor, smallTv, floorBoxes, bin, tyreStack, bookRackLeft, bookRackRight].forEach(model => {
                if (model?.scene) {
                    model.scene.traverse((object) => {
                        if (object instanceof Mesh) {
                            object.geometry.dispose();
                            if (Array.isArray(object.material)) {
                                object.material.forEach(material => material.dispose());
                            } else {
                                object.material.dispose();
                            }
                        }
                    });
                }
            });

            // Dispose DRACO loader
            dracoLoader.dispose();
        };
    }, [manager, chair, computer, radio, radioWheelLeft, radioWheelRight]);

    // Optimized material creation functions
    const createPBRMaterial = async (config: TextureConfig) => {
        if (!textureCache.current) throw new Error('Texture cache not initialized');

        const textures = await Promise.all(
            config.textures.map((url: string) => textureCache.current!.getTexture(url))
        );

        textures.forEach(texture => {
            if (config.wrapMode) {
                texture.wrapS = texture.wrapT = config.wrapMode;
            }
            if (config.repeat) {
                texture.repeat.set(config.repeat[0], config.repeat[1]);
            }
        });

        const materialProps: any = { ...config.materialProps };
        if (textures[0]) materialProps.map = textures[0];
        if (textures[1]) materialProps.normalMap = textures[1];
        if (textures[2]) materialProps.displacementMap = textures[2];
        if (textures[3]) materialProps.roughnessMap = textures[3];

        return new MeshStandardMaterial(materialProps);
    };

    const createSimpleMaterial = async (config: SimpleTextureConfig) => {
        if (!textureCache.current) throw new Error('Texture cache not initialized');

        const texture = await textureCache.current.getTexture(config.texture);

        // Apply texture properties
        if (config.props?.magFilter) texture.magFilter = config.props.magFilter;
        if (config.props?.minFilter) texture.minFilter = config.props.minFilter;
        if (config.props?.generateMipmaps !== undefined) texture.generateMipmaps = config.props.generateMipmaps;

        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.colorSpace = 'srgb';
        texture.minFilter = LinearFilter; // Less GPU intensive filtering
        texture.generateMipmaps = false; // Disable mipmaps for better performance
        texture.needsUpdate = true;

        const materialProps = {
            map: texture,
            roughness: 0.6,
            metalness: 0.4,
            ...config.props
        };

        return new MeshStandardMaterial(materialProps);
    };

    const handleSpecialCases = async (child: Mesh, name: string) => {
        if (!textureCache.current) throw new Error('Texture cache not initialized');

        switch (name) {
            case 'Cube035':
            case 'setup':
            case 'tv_1':
            case 'setup004':
            case 'setup005':
            case 'setup006':
            case 'Clipboard002':
            case 'Clipboard005':
            case 'Trash_Cam':
            case 'tyre':
            case 'tyre001':
            case 'Shelf001':
            case 'Shelf002':
            case 'Binders':
            case 'Half_Life_Game_Box_256x256':
            case 'Fallout_2_Game_Box_256x256':
            case 'Stack_of_Papers003':
            case 'book012001':
            case 'Half_Life_Game_Box_256x256001':
            case 'book012013':
            case 'book009030':
            case 'Half_Life_Game_Box_256x256002':
            case 'book009030':
            case 'book008005':
            case 'Half_Life_Game_Box_256x256003':
            case 'Handbook_for_the_Recently_Deceased001':
            case 'book010':
                child.visible = false;
                break;

            case 'tape_recoder_disk_1':
            case 'tape_recoder_disk_2':
                child.visible = false; // Hide tape recorder disks
                break;

            case 'Cube001':
                child.visible = false; // Hide computer002
                break;

            case 'computer002':
                child.visible = false; // Hide computer002
                break;

            case 'hinge':
                child.visible = false; // Hide the hinge
                break;

            case 'Computer_Monitor':
                child.position.y -= 0.65;
                child.visible = false; // Hide the computer monitor

                if (Array.isArray(child.material)) {
                    const screenTexture = await textureCache.current.getTexture('/textures/Capture20.PNG');

                    const screenMaterial = new MeshStandardMaterial({
                        map: screenTexture,
                        roughness: 0.341,
                        metalness: 0.382,
                    });

                    const coverMaterial = new MeshStandardMaterial({
                        map: screenTexture,
                        roughness: 0.2,
                        metalness: 0.8
                    });

                    const standMaterial = new MeshStandardMaterial({
                        color: '#B0ADA4',
                        roughness: 0.2,
                        metalness: 0.8,
                        displacementScale: 0
                    });

                    child.material = [screenMaterial, coverMaterial, standMaterial];
                }
                break;

            case 'Computer_Monitor_Stand':
            case 'Monitor_Stand':
            case 'monitor_stand':
                child.material = new MeshStandardMaterial({
                    color: '#2a2a2a',
                    roughness: 0.2,
                    metalness: 0.8,
                    displacementScale: 0
                });
                break;
        }
    };

    useEffect(() => {
        if (!fbx || !textureCache.current) return;

        const applyMaterials = async () => {
            const meshes: Mesh[] = [];

            // Collect all meshes first
            fbx.traverse((child) => {
                if (child instanceof Mesh) {
                    meshes.push(child);
                }
            });

            // Process meshes in batches to avoid blocking
            const batchSize = 5;
            for (let i = 0; i < meshes.length; i += batchSize) {
                const batch = meshes.slice(i, i + batchSize);

                await Promise.all(batch.map(async (child) => {
                    try {
                        const name = child.name;

                        if (!textureCache.current) {
                            console.error('Texture cache not initialized');
                            return;
                        }

                        // Handle special cases
                        if (SPECIAL_CASES.includes(name)) {
                            await handleSpecialCases(child, name);
                            return;
                        }

                        // Check material cache first
                        const cachedMaterial = textureCache.current?.getMaterial(name);
                        if (cachedMaterial) {
                            child.material = cachedMaterial;
                            return;
                        }

                        // Handle PBR materials
                        if (TEXTURE_CONFIGS[name]) {
                            const material = await createPBRMaterial(TEXTURE_CONFIGS[name]);
                            textureCache.current?.setMaterial(name, material);
                            child.material = material;
                            return;
                        }

                        // Handle simple textures
                        if (SIMPLE_TEXTURE_MAP[name]) {
                            const material = await createSimpleMaterial(SIMPLE_TEXTURE_MAP[name]);
                            textureCache.current?.setMaterial(name, material);
                            child.material = material;
                            return;
                        }

                        // Handle color-only materials
                        if (COLOR_MATERIALS[name]) {
                            const material = new MeshStandardMaterial(COLOR_MATERIALS[name]);
                            textureCache.current?.setMaterial(name, material);
                            child.material = material;
                            return;
                        }

                    } catch (error) {
                        // console.error(`Error processing mesh ${child.name}:`, error);
                    }
                }));

                // Small delay between batches to prevent blocking
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            sessionStorage.setItem("isAllMaterialsApplied", JSON.stringify(true));
        };

        applyMaterials().catch(console.error);
    }, [fbx]);

    // Rotation animation for the radio wheel with deltaTime for smooth performance
    const lastUpdate = useRef(0);
    useFrame(({ clock }) => {
        if (!radioWheelLeft || !radioWheelRight) return;

        // Update every 1/30th of a second (30fps) for performance
        const currentTime = clock.getElapsedTime();
        if (currentTime - lastUpdate.current >= 1 / 30) {
            const rotationSpeed = 0.02;
            if (isRadioMeshClicked) {
                radioWheelLeft.scene.rotation.x += rotationSpeed;
                radioWheelRight.scene.rotation.x += -rotationSpeed;
            }
            lastUpdate.current = currentTime;
        }
    });

    if (!fbx || !chair || !computer || !radio || !radioWheelLeft || !radioWheelRight || !oscilloscope || !monitor || !smallTv || !floorBoxes || !bin || !tyreStack || !bookRackLeft || !bookRackRight) return null;
    return (
        <>
            <primitive object={fbx} scale={0.01} />
            <primitive object={chair.scene} />
            <primitive object={computer.scene} />
            <primitive object={radio.scene} />
            <primitive object={radioWheelLeft.scene} />
            <primitive object={radioWheelRight.scene} />
            <primitive object={oscilloscope.scene} />
            <primitive object={monitor.scene} />
            <primitive object={smallTv.scene} />
            <primitive object={floorBoxes.scene} />
            <primitive object={bin.scene} />
            <primitive object={tyreStack.scene} />
            <primitive object={bookRackLeft.scene} />
            <primitive object={bookRackRight.scene} />
            <primitive object={books.scene} />
        </>
    );
};

export default RoomHandler