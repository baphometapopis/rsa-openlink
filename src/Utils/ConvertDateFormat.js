export const convertDateFormat = (dateString) => {
    // Split the input date string by '/'
    const [month, day, year] = dateString.split('/');
  
    // Return the reformatted date string in 'YYYY/MM/DD' format
    return `${year}-${month}-${day}`;
  };
  