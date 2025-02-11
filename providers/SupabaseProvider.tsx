// **SupabaseProvider.tsx**
// This file initializes and provides the Supabase authentication and database client 
// to the entire Next.js app. It wraps the application in `SessionContextProvider` 
// to maintain the authentication state across all pages.

// Ensures this file runs on the client-side in Next.js
"use client";

import { Database } from "@/types_db"; // Importing the database type definitions
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Function to create a Supabase client for frontend use
import { SessionContextProvider } from "@supabase/auth-helpers-react"; // Provides authentication context throughout the app
import { useState } from "react"; // React state management

// Defining the props type to allow child components to be wrapped inside the provider
interface SupabaseProviderProps {
    children: React.ReactNode; // `children` represents all components inside this provider
};

// Functional component to initialize and provide Supabase authentication globally
const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
    // Create a Supabase client instance and persist it across renders using useState
    const [supabaseClient] = useState(() =>
        createClientComponentClient<Database>()
    );

    return (
        // Wraps the app with SessionContextProvider to manage authentication state
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children} {/* This allows all child components to access the authentication state */}
        </SessionContextProvider>
    )
}

// Exporting the provider to be used in _app.tsx or layout.tsx
export default SupabaseProvider;
    