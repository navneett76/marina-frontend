import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

interface DateInputProps {
  onDateChange: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      onDateChange(date.toISOString().split('T')[0]);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    return today;
  };

  const getMinDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    return today;
  };

  const handleIconClick = () => {
    const inputElement = document.querySelector('.react-datepicker-wrapper input') as HTMLElement;
    if (inputElement) {
      inputElement.click();
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        maxDate={getMaxDate()}
        minDate={getMinDate()}
        dateFormat="yyyy-MM-dd"
        customInput={<input style={{ display: 'block' }} />}
      />
      <button
        type="button"
        onClick={handleIconClick}
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
      >
        <FaCalendarAlt size={24} />
      </button>
    </div>
  );
};

export default DateInput;
