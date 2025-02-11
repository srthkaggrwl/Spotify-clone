/**
 * useUser.tsx
 *
 * This file provides user authentication and subscription management using React-Context and Supabase.
 * It creates a UserContext that stores:
 * - The authenticated user and access token
 * - User details fetched from the 'users' table in Supabase
 * - Subscription details from the 'subscriptions' table
 * - Loading states for better UI handling
 *
 * The `MyUserContextProvider` fetches and updates user details & subscription data when the user logs in or out.
 * The `useUser` hook allows consuming components to access the user's authentication state and data.
 */

import { useSessionContext, useUser as useSuperUser } from "@supabase/auth-helpers-react";
import { UserDetails, Subscription } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState } from "react";

// Define the shape of the user context data
type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
};

// Create a context to store user-related information
export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface Props {
    [propName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
    // Get session and user data from Supabase authentication hooks
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();
    
    const user = useSuperUser(); // Fetch the authenticated user
    const accessToken = session?.access_token ?? null; // Retrieve the user's access token

    // State variables to store user data and loading state
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    // Function to fetch user details from the 'users' table
    const getUserDetails = () => supabase.from('users').select('*').single();

    // Function to fetch active/trialing subscription data
    const getSubscription = () =>
        supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .in('status', ['trailing', 'active'])
        .single();

    // Fetch user details and subscription data when the user logs in
    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);

            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];

                    if (userDetailsPromise.status === "fulfilled") {
                        setUserDetails(userDetailsPromise.value.data as UserDetails);
                    }

                    if (subscriptionPromise.status === "fulfilled") {
                        setSubscription(subscriptionPromise.value.data as Subscription);
                    }

                    setIsLoadingData(false);
                }
            );
        } 
        // Reset state when user logs out
        else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser]);    

    // Provide user data to the context
    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props} />
};

// Custom hook to access user context
export const useUser = () => {
    const context = useContext(UserContext);
    
    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }

    return context;
};
