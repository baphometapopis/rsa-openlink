export const convertDateFormat = (dateString) => {
  console.log(dateString, 'dateString');
  dateString='1982-06-15' 
  // Check if the date is in 'YYYY-MM-DD' format
  const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (yyyymmddRegex.test(dateString)) {
      // If it's already in the correct format, return it as is
      return dateString;
  }

  // Otherwise, assume it is in 'MM/DD/YYYY' format
  const parts = dateString?.split('/');
  
  // Check if parts are defined and have the expected length
  if (parts && parts.length === 3) {
      const [month, day, year] = parts;

      // Return the reformatted date string in 'YYYY-MM-DD' format
      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate, 'formattedDate');
      return formattedDate;
  } else {
      console.error('Invalid date format. Expected format: MM/DD/YYYY or YYYY-MM-DD');
      return null; // or you can return an error message
  }
};
