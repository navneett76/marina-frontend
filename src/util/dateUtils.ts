// src/utils/dateUtils.ts
export const getCurrentAndSixMonthsLaterDate = () => {
    const currentDate = new Date();
  
    // Get the current date
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
  
    // Calculate the date six months later
    const sixMonthsLaterDate = new Date(currentYear, currentMonth + 6, currentDay);
  
    // Format the dates (optional)
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    return {
      currentDate: formatDate(currentDate),
      sixMonthsLaterDate: formatDate(sixMonthsLaterDate),
    };
  };
  