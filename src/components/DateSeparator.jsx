// src/components/DateSeparator.jsx
import React from 'react';
import './DateSeparator.css';

function DateSeparator({ date }) {
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date?.toDate());

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return messageDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="dateSeparator">
      <span>{formatDate(date)}</span>
    </div>
  );
}

export default DateSeparator;