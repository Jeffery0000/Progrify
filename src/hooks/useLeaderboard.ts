import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

interface LeaderboardUser {
    uid: string;
    displayName?: string;
    email?: string;
    totalPointsEarned: number;
    level: number;
    totalTasksCompleted: number;
}

const useLeaderboard = (limitCount = 10) => {
    const [state, setState] = useState<{
        users: LeaderboardUser[];
        loading: boolean;
        error: string | null;
    }>({
        users: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        // Set up auth state listener first
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setState({
                    users: [],
                    loading: false,
                    error: "You must be logged in to view the leaderboard"
                });
                return;
            }

            try {
                console.log("Fetching leaderboard data as authenticated user:", user.uid);

                // Wait for the authentication to be ready
                await new Promise(resolve => setTimeout(resolve, 500));

                const leaderboardRef = collection(db, 'leaderboard');
                const q = query(leaderboardRef, orderBy('totalPointsEarned', 'desc'), limit(limitCount));
                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setState({
                        users: [],
                        loading: false,
                        error: null
                    });
                    return;
                }

                const users = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                })) as LeaderboardUser[];

                setState({
                    users,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
                setState({
                    users: [],
                    loading: false,
                    error: "Failed to load leaderboard data. Please try again later."
                });
            }
        });

        return () => unsubscribe();
    }, [limitCount]);

    return state;
};

export default useLeaderboard;