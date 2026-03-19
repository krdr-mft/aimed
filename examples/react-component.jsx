// AIMED/1 S:1 D:4 E:3 G:2 | tool=claude-4 note="Human designed the API; AI implemented the component"

import React, { useState, useCallback } from 'react';

/**
 * StatusBadge — A pill-shaped status indicator with optional pulse animation.
 */
export default function StatusBadge({
  status = 'idle',
  label,
  size = 'md',
  pulse = false,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    idle: { bg: '#e2e8f0', text: '#475569', dot: '#94a3b8' },
    active: { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
    warning: { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' },
    error: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
    loading: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  };

  const sizes = {
    sm: { padding: '4px 10px', fontSize: '12px', dotSize: '6px' },
    md: { padding: '6px 14px', fontSize: '14px', dotSize: '8px' },
    lg: { padding: '8px 18px', fontSize: '16px', dotSize: '10px' },
  };

  const color = colors[status] || colors.idle;
  const sizeStyle = sizes[size] || sizes.md;

  const handleClick = useCallback(() => {
    if (onClick) onClick(status);
  }, [onClick, status]);

  return (
    <span
      role={onClick ? 'button' : 'status'}
      tabIndex={onClick ? 0 : undefined}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 500,
        borderRadius: '9999px',
        backgroundColor: color.bg,
        color: color.text,
        cursor: onClick ? 'pointer' : 'default',
        transform: isHovered && onClick ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 150ms ease',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          width: sizeStyle.dotSize,
          height: sizeStyle.dotSize,
          borderRadius: '50%',
          backgroundColor: color.dot,
          animation: pulse ? 'aimed-pulse 2s ease-in-out infinite' : 'none',
        }}
      />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}

      {pulse && (
        <style>{`
          @keyframes aimed-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
          }
        `}</style>
      )}
    </span>
  );
}
