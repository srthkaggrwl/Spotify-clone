// **ModalProvider.tsx**
// This provider ensures that modals are rendered only on the client side 
// (avoiding Next.js hydration errors).

"use client"; // Ensures the file runs only on the client side

import Modal from "@/components/Modal"; // Importing the Modal component
import { useEffect, useState } from "react"; // Importing hooks for state and side effects

const ModalProvider = () => {
    // State to track whether the component has mounted
    const [isMounted, setIsMounted] = useState(false);

    // useEffect runs after the initial render to update isMounted to true
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If the component is not mounted yet, return null (don't render anything)
    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* Rendering the Modal component once the component has mounted */}
            <Modal 
                title="Test Modal"
                description="Test Description"
                isOpen
                onChange={() => {}}
            >
                Test Children
            </Modal>    
        </>
    );
}

export default ModalProvider;
