import studentImage from '../assets/student.png';

export const studentsSample = [
  {
    image: studentImage,
    score: 498,
    total: 500,
    name: "SPANDANA A M",
    hallTicket: "18116023",
  },
  {
    image: studentImage,
    score: 496,
    total: 500,
    name: "RAHUL V",
    hallTicket: "18116024",
  },
  {
    image: studentImage,
    score: 495,
    total: 500,
    name: "KAVYA R",
    hallTicket: "18116025",
  },
  {
    image: studentImage,
    score: 493,
    total: 500,
    name: "TARUN S",
    hallTicket: "18116026",
  },
  {
    image: studentImage,
    score: 490,
    total: 500,
    name: "SNEHA B",
    hallTicket: "18116027",
  },
];

export const achievementSections = [
  {
    name: "JEE MAINS",
    titleColor: "#004aad",
    barColor: "#004aad",
    bgColor: "#0074e4",
    viewMoreLink: "/jee-mains",
    students: studentsSample,
  },
  {
    name: "JEE ADVANCED",
    titleColor: "#0a6847",
    barColor: "#0a6847",
    bgColor: "#128c7e",
    viewMoreLink: "/jee-advanced",
    students: studentsSample,
  },
  {
    name: "AP EAMCET",
    titleColor: "#8e44ad",
    barColor: "#8e44ad",
    bgColor: "#9b59b6",
    viewMoreLink: "/eamcet",
    students: studentsSample,
  },
];