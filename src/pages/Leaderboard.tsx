import React, { useState, useEffect } from 'react';
import { Loader2, Trophy, Award, Users } from 'lucide-react';
import useLeaderboard from '../hooks/useLeaderboard';
import useUserProfile from '../hooks/useUserProfile';

const Leaderboard: React.FC = () => {
    const { users, loading, error } = useLeaderboard();
    const { userProfile } = useUserProfile();
    const [sortField, setSortField] = useState<'points' | 'level' | 'tasks'>('points');

    // Debug effect to log data status
    useEffect(() => {
        console.log("Leaderboard data:", {
            usersAvailable: !!users,
            usersCount: users?.length || 0,
            loading,
            error
        });
    }, [users, loading, error]);

    // Function to determine the sorting of users
    const getSortedUsers = () => {
        if (!users || !Array.isArray(users) || users.length === 0) {
            return [];
        }

        try {
            return [...users].sort((a, b) => {
                switch (sortField) {
                    case 'points':
                        return (b.totalPointsEarned || 0) - (a.totalPointsEarned || 0);
                    case 'level':
                        return (b.level || 0) - (a.level || 0);
                    case 'tasks':
                        return (b.totalTasksCompleted || 0) - (a.totalTasksCompleted || 0);
                    default:
                        return (b.totalPointsEarned || 0) - (a.totalPointsEarned || 0);
                }
            });
        } catch (e) {
            console.error("Error sorting users:", e);
            return [];
        }
    };

    // Get the sorted users
    const sortedUsers = getSortedUsers();

    // Find the current user's rank
    const currentUserRank = userProfile && sortedUsers.length > 0
        ? sortedUsers.findIndex(user => user.uid === userProfile.uid) + 1
        : null;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            ) : !users || sortedUsers.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">
                        No leaderboard data available yet. Complete tasks to appear on the leaderboard!
                    </p>
                    <p className="text-sm text-teal-600">
                        The leaderboard will update after you complete your first task.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Filter controls */}
                    <div className="border-b p-4 flex justify-end">
                        <div className="inline-flex space-x-1 rounded-md shadow-sm" role="group">
                            <button
                                onClick={() => setSortField('points')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-l-md ${sortField === 'points'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Points
                            </button>
                            <button
                                onClick={() => setSortField('level')}
                                className={`px-3 py-1.5 text-sm font-medium ${sortField === 'level'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Level
                            </button>
                            <button
                                onClick={() => setSortField('tasks')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-r-md ${sortField === 'tasks'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Tasks
                            </button>
                        </div>
                    </div>

                    <ul className="divide-y divide-gray-200">
                        {sortedUsers.map((user, index) => (
                            <li
                                key={user.uid}
                                className={`p-4 flex items-center ${user.uid === userProfile?.uid ? 'bg-teal-50' : ''}`}
                            >
                                <div className="flex-shrink-0 text-center w-6">
                                    <span className="font-medium text-gray-700">{index + 1}</span>
                                </div>

                                <div className="ml-4 flex-shrink-0">
                                    {index === 0 ? (
                                        <Trophy className="h-6 w-6 text-yellow-500" />
                                    ) : index === 1 ? (
                                        <Award className="h-6 w-6 text-gray-400" />
                                    ) : index === 2 ? (
                                        <Award className="h-6 w-6 text-amber-700" />
                                    ) : (
                                        <Users className="h-6 w-6 text-gray-300" />
                                    )}
                                </div>

                                <div className="ml-4 flex-1">
                                    <h3 className="text-md font-medium text-gray-900">
                                        {user.displayName || 'Anonymous User'}
                                        {user.uid === userProfile?.uid && " (You)"}
                                    </h3>
                                </div>

                                <div className="flex-shrink-0 flex space-x-4 text-sm text-right">
                                    <div>
                                        <div className="font-medium text-gray-500">Level</div>
                                        <div className="font-semibold text-gray-900">{user.level || 1}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-500">Points</div>
                                        <div className="font-semibold text-gray-900">{user.totalPointsEarned || 0}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-500">Tasks</div>
                                        <div className="font-semibold text-gray-900">{user.totalTasksCompleted || 0}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;