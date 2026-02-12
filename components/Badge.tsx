import React from 'react';

interface BadgeProps {
  label: 'GUEST' | 'MEMBER' | 'FULL' | 'ADMIN';
}

const badgeStyles = {
  GUEST: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  MEMBER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  FULL: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const Badge: React.FC<BadgeProps> = ({ label }) => {
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${badgeStyles[label]}`}>
      {label}
    </span>
  );
};

export default Badge;
