export const generateMonthYearOptions = () => {
    const months = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    
    const options = [];
    
    years.forEach((year) => {
      months.forEach((month, index) => {
        options.push({
          label: `${month} ${year}`,
          value: `${year}-${String(index + 1).padStart(2, '0')}` // Format: YYYY-MM
        });
      });
    });
    
    return options;
  };
  