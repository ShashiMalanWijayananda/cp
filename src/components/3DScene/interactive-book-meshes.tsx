import React from "react";

// components
import InteractiveBookMesh from "./interactive-book-mesh";

// props
import { InteractiveBookMeshesProps } from "../../interfaces/props";

const InteractiveBookMeshes: React.FC<InteractiveBookMeshesProps> = ({ setOpenBook, setShowBookProximityText }) => {
    return (
        <>
            <InteractiveBookMesh
                position={[-2.73, .91, 0.4]}
                scale={[.13, .055, .19]}
                rotation={[0, 1.85, 0]}
                setOpenBook={setOpenBook}
                bookName="La cryptographie militaire"
                assetFileName="La Cryptographie Militare.webp"
                isbnNumber="The ISBN system was not in use in 1883. Any ISBNs for this title are associated with later reprints or facsimile editions."
                overview="This seminal work laid out Kerckhoffs's principles for secure military cryptography. It notably introduced what is now known as Kerckhoffs's Principle, stating that a cryptosystem should be secure even if everything about the system, except the key, is public knowledge. It remains a foundational text in cryptology."
                author="Auguste Kerckhoffs"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[-2.23, .91, -1.28]}
                scale={[.15, .06, .22]}
                rotation={[0, 0.1, 0]}
                setOpenBook={setOpenBook}
                bookName="Principals of Digital Audio"
                assetFileName="Principals of Digital Audio.webp"
                isbnNumber="978-0672223880 (ISBN-10: 0672223880) - This is generally cited as the ISBN for the first edition."
                overview="This book is a widely recognised and comprehensive guide to the fundamentals of digital audio technology. It covers various aspects, including sampling, quantisation, digital audio formats, and practical applications, making it a key resource for students and professionals in audio engineering and related fields."
                author="Ken C. Pohlmann"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[-2.37, 1.32, -2.345]}
                scale={[.17, .03, .22]}
                rotation={[0, 1.15, 0]}
                setOpenBook={setOpenBook}
                bookName="Manual for the Solution of Military Ciphers"
                assetFileName="Military Ciphers.webp"
                isbnNumber="Not Available"
                overview="Written by a U.S. Army officer, this manual was one of the earliest publicly available texts on cryptanalysis in the United States. It provided practical methods for solving various types of military ciphers, contributing significantly to the development of American cryptography and intelligence during World War I and beyond."
                author="Parker Hitt"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[-1.81, .89, -2.32]}
                scale={[.18, .03, .23]}
                rotation={[0, -0.8, 0]}
                setOpenBook={setOpenBook}
                bookName="Submarine! The Classic Account of Undersea Combat in World War II"
                assetFileName="Submarine!.webp"
                isbnNumber="Not Available"
                overview="This is a classic first-hand account of submarine warfare in the Pacific during World War II, written by a veteran submariner. It offers vivid descriptions of the challenges, dangers, and triumphs of undersea combat, providing a compelling and authentic perspective on the strategic importance and human experience of the Silent Service."
                author="Edward L. Beach"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[.07, .9, -2.41]}
                scale={[.23, .03, .29]}
                rotation={[0, -0.25, 0]}
                setOpenBook={setOpenBook}
                bookName="Serious Cryptography: A Practical Introduction to Modern Encryption"
                assetFileName="Serious Cryptography.webp"
                isbnNumber="978-1593278269 - First Print"
                overview="This book offers a practical and accessible guide to modern cryptography, focusing on real-world applications and common pitfalls. It explains cryptographic primitives and protocols, emphasizing how to use them securely in practice, making it valuable for developers and security professionals seeking practical knowledge."
                author="Jean-Philippe Aumasson"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[.71, 1.43, -2.38]}
                scale={[.1, .02, .15]}
                rotation={[0, .3, 0]}
                setOpenBook={setOpenBook}
                bookName="Cryptography Made Simple"
                assetFileName="Cryptography Made Simple.webp"
                isbnNumber="9783319219356 (Hardcover)"
                overview="In this introductory textbook the author explains the key topics in cryptography. He takes a modern approach, where defining what is meant by secure is as important as creating something that achieves that goal, and security definitions are central to the discussion throughout."
                author="Nigel Smart"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[-1.05, 0.38, -2.30]}
                scale={[.18, .82, .27]}
                rotation={[0, .5, 0]}
                setOpenBook={setOpenBook}
                bookName="Submarine Design"
                assetFileName="Submarine Desig.webp"
                isbnNumber="978-3763753406 - First Print"
                overview="This book is a highly respected technical reference on the principles and practices of submarine design. It covers various aspects of submarine engineering, including hydrodynamics, structural design, propulsion systems, and combat systems, providing detailed insights for naval architects and engineers."
                author="Ulrich Gabler"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[3.85, 1.7, -2.80]}
                scale={[.18, .22, .1]}
                rotation={[0, .5, 0]}
                setOpenBook={setOpenBook}
                bookName="The Art of Digital Audio"
                assetFileName="The Art of Digital Audio.webp"
                isbnNumber="978-0240511112 - First Print"
                overview="Considered a definitive work in the field, this book provides an in-depth exploration of digital audio principles and technologies. It delves into the theory and practical implementation of digital audio systems, covering topics from analog-to-digital conversion to various recording and reproduction techniques, serving as a comprehensive industry reference."
                author="John Watkinson"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[4.3, .8, -2.80]}
                scale={[.18, .22, .1]}
                rotation={[0, .5, 0]}
                setOpenBook={setOpenBook}
                bookName="The Code-breakers: The Story of Secret Writing"
                assetFileName="The Code Breakers.webp"
                isbnNumber="978-0025604609 - Hard Cover"
                overview="A monumental and definitive history of cryptography from ancient times to the mid-20th century. Kahn's extensive research and engaging narrative cover every aspect of code-making and code-breaking, making it an indispensable resource for anyone interested in the history of secret communication and intelligence."
                author="David Kahn"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[5, .85, -2.80]}
                scale={[.18, .22, .1]}
                rotation={[0, 1.8, 0]}
                setOpenBook={setOpenBook}
                bookName="Cryptomenytices et Cryptographiae Libri IX"
                assetFileName="Cryptome.webp"
                isbnNumber="Not Available - First Print"
                overview="This comprehensive early work on cryptography is notable for its detailed treatment of various ciphers and steganography. It extensively discusses previous cryptographic methods, including those of Johannes Trithemius, and contributes to the historical understanding of cryptographic practices during the Renaissance and early modern period."
                author="Gustavus Selenus"
                onNearby={setShowBookProximityText} />

            <InteractiveBookMesh
                position={[5.55, 1.3, -2.80]}
                scale={[.18, .22, .1]}
                rotation={[0, 1.8, 0]}
                setOpenBook={setOpenBook}
                bookName="Whiskey-Class: Soviet Project 613 Submarines in Service with Foreign Navies, 1950-1990"
                assetFileName="Whiskey - Class.webp"
                isbnNumber="978-8366148810 - First Print"
                overview="This book offers a detailed historical and technical analysis of the Soviet Whiskey-class submarines. It focuses on their operational history and service with various foreign navies during the Cold War era, providing insights into their design, capabilities, and global proliferation."
                author="Dmitry Zubkov"
                onNearby={setShowBookProximityText} />


            {/* <mesh
                position={[5.55, 1.3, -2.80]}
                scale={[.18, .22, .1]}
                rotation={[0, 1.8, 0]}>
                <boxGeometry />
                <meshBasicMaterial wireframe color="yellow" />
            </mesh> */}
        </>
    )
}

export default InteractiveBookMeshes