import React from 'react';

// Click sound feedback
const clickSound = new Audio('/sounds/click.mp3');

export default function ModuleCard({ title, description, icon, onClick, selected, badgeCount = 1 }) {
  return (
    <div
      onClick={() => {
        clickSound.play();
        onClick();
      }}
      className={
        `cursor-pointer rounded-2xl border px-6 py-5 shadow-sm transition-all duration-200
        hover:shadow-md hover:scale-[1.03]
        ${selected
          ? 'border-black bg-gray-100 scale-105'
          : 'border-gray-200 bg-white'
        }`
      }
    >
      <div className="flex items-center space-x-4">
        <div className="relative text-2xl">
          {icon}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {badgeCount}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}