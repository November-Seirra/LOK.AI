import React from 'react';

const ProgressChart = ({ data }) => {
    return (
        <div className="h-64 flex items-end justify-between gap-3 pt-6">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex flex-col justify-end h-full">
                        <div
                            className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300"
                            style={{ height: `${item.value}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {item.value}%
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{item.day}</span>
                </div>
            ))}
        </div>
    );
};

export default ProgressChart;
