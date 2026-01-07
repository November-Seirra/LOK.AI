import React from 'react';

const ActivityItem = ({ title, time, type, icon: Icon }) => {
    const typeColors = {
        quiz: 'bg-blue-100 text-blue-600',
        document: 'bg-purple-100 text-purple-600',
        study: 'bg-amber-100 text-amber-600'
    };

    return (
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className={`p-2.5 rounded-lg ${typeColors[type] || 'bg-gray-100 text-gray-600'}`}>
                <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {title}
                </p>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
        </div>
    );
};

const ActivityFeed = ({ activities }) => {
    return (
        <div className="space-y-1">
            {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
            ))}
        </div>
    );
};

export { ActivityFeed, ActivityItem };
