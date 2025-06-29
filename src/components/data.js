// data.js
export const cards = [
  
  { title: "Movenpick Aswan Hotel", img: "/assets/Alaa.jpg" },
  { title: "Movenpick Aswan Hotel", img: "/assets/movenpick2.png" },
  { title: "Movenpick Aswan Villas", img: "/assets/movenpick_aswan_villas.png" },
  { title: "Movenpick Aswan Villas", img: "/assets/movenpick_aswan_villas2.png" },
  { title: "Al Nour Hilton Resort", img: "/assets/Al Nour Hilton Resort.png" },
  { title: "Hilton Wall Fall Hotel", img: "/assets/Hilton Wall Fall Hotel.png" },
  { title: "the extension of businessmen club", img: "/assets/the extension of businessmen club.png" },
  { title: "Ramses Hilton Hotel", img: "/assets/Ramses Hilton Hotel.png" },
  { title: "Ramses Hilton Hotel2", img: "/assets/Ramses Hilton Hotel2.png" },
  { title: "Ramses Hilton Hotel3", img: "/assets/Ramses Hilton Hotel3.png" },
  { title: "Cairo Sheraton Hotel", img: "/assets/Cairo Sheraton Hotel.png" },
  { title: "Nabila Village Resort", img: "/assets/Nabila Village Resort.png" },
  { title: "Rana Sharm Hotel", img: "/assets/Rana Sharm Hotel.png" },
  { title: "Bon Appetit Resturant", img: "/assets/Bon Appetit Resturant.png" },
  { title: "Nissan Main Office Building", img: "/assets/Nissan Main Office Building.png" },
  { title: "The American Airlines", img: "/assets/The American Airlines.png" },
  { title: "32 Multi Story Building Nasr City", img: "/assets/32 Multi Story Building Nasr City.png" },
  { title: "32 Multi Story Building Nasr City2", img: "/assets/32 Multi Story Building Nasr City2.png" },
  { title: "32 Multi Story Building Nasr City3", img: "/assets/32 Multi Story Building Nasr City3.png" },
  { title: "Arab Bank International Bank", img: "/assets/Arab Bank International Bank.png" },
  { title: "Arab Bank International Bank2", img: "/assets/Arab Bank International Bank2.png" },
  { title: "Arab Bank International Bank3", img: "/assets/Arab Bank International Bank3.png" },
  { title: "Dar Bank Misr Hotel", img: "/assets/Dar Bank Misr Hotel.png" },
  { title: "Dar Bank Misr Hotel", img: "/assets/Dar Bank Misr Hotel2.png" },
  { title: "Dar Bank Misr Hotel", img: "/assets/Dar Bank Misr Hotel3.png" },


];

// Simulate async fetch (like an API or Sanity client would)
export async function fetchCards() {
  return new Promise(resolve => {
    setTimeout(() => resolve(cards), 300);
  });
}