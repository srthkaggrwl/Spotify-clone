// **ModalProvider.tsx**
// This provider ensures that modals are rendered only on the client side 
// (avoiding Next.js hydration errors).

"use client"; // Ensures the file runs only on the client side

import AuthModal from "@/components/AuthModal";
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
            <AuthModal />
        </>
    );
}

export default ModalProvider;
