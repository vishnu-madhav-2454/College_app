import student from '../assets/student.png';

export const studentExamples = {
  jeemains: {
    bgColor: '#9b0c0c',
    total: '300',
    students: [
      { name: 'Rahul Sharma', hallticket: 'JEE123456', rank: '256', image: student },
      { name: 'Sneha Reddy', hallticket: 'JEE654321', rank: '432', image: student },
      { name: 'Aarav Mehta', hallticket: 'JEE112233', rank: '158', image: student },
      { name: 'Ishita Verma', hallticket: 'JEE998877', rank: '310', image: student },
      { name: 'Rohan Das', hallticket: 'JEE334455', rank: '199', image: student },
      { name: 'Divya Patel', hallticket: 'JEE667788', rank: '365', image: student },
    ],
  },
  apeamcet: {
    bgColor: '#0c5b9b',
    total: '160',
    students: [
      { name: 'Vikram Rao', hallticket: 'AP123987', marks: '125', image: student },
      { name: 'Keerthi Das', hallticket: 'AP456789', marks: '132', image: student },
      { name: 'Sanjay Naik', hallticket: 'AP998877', marks: '118', image: student },
      { name: 'Meghana Rao', hallticket: 'AP112244', marks: '139', image: student },
      { name: 'Ajay Krishna', hallticket: 'AP332211', marks: '121', image: student },
      { name: 'Tanya Shah', hallticket: 'AP556677', marks: '130', image: student },
    ],
  },
  neet: {
    bgColor: '#087a53',
    total: '720000',
    students: [
      { name: 'Anjali Singh', hallticket: 'NEET123456', rank: '5432', image: student },
      { name: 'Harsha Babu', hallticket: 'NEET789123', rank: '4890', image: student },
      { name: 'Pooja Rani', hallticket: 'NEET112233', rank: '6200', image: student },
      { name: 'Mohit Jain', hallticket: 'NEET445566', rank: '5100', image: student },
      { name: 'Lakshmi N', hallticket: 'NEET998877', rank: '4750', image: student },
      { name: 'Devendra P', hallticket: 'NEET221133', rank: '4956', image: student },
    ],
  },
};