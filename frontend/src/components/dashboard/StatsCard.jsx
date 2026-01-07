import React from 'react';
import Card from '../ui/Card';

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
    return (
        <Card className="p-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 capitalize">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
                        {trend && (
                            <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
                    <Icon className={color.replace('bg-', 'text-')} size={24} />
                </div>
            </div>
        </Card>
    );
};

export default StatsCard;
