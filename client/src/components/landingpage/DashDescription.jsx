import React from 'react';

export default function DashDescription({ selectedService }) {
  const descriptions = [
    {
      title: "Donations",
      content: "Hamari MandirMitra app mein, aap donations track kar sakte hain. Har donor ka naam, village, tehsil, district, state, aur country ke saath seva ka naam aur contact information bhi add kar sakte hain. Aap payment method (cash, bank, UPI) aur donation amount bhi dekh sakte hain. Yeh sab CRUD operations ke sath possible hai.",
      gradient: "bg-gradient-to-r from-green-400 to-blue-500"
    },
    {
      title: "Events",
      content: "MandirMitra app mein, aap events ko manage kar sakte hain. Har event ka naam, date, location, aur status (pending, completed) ko track kar sakte hain. Temple ka reference bhi included hai. Yeh sab CRUD operations ke sath possible hai.",
      gradient: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
    },
    {
      title: "Expenses",
      content: "Hamari app mein expenses ka bhi pura management hai. Har expense ka title, description, amount, date, category, aur status (pending, approved, completed, rejected) track kar sakte hain. Temple ka reference bhi included hai. Yeh sab CRUD operations ke sath possible hai.",
      gradient: "bg-gradient-to-r from-yellow-400 to-orange-500"
    },
    {
      title: "Inventories",
      content: "MandirMitra app mein inventory management bhi hai. Har item ka naam, category, quantity, unit, unit price, total price, aur description add kar sakte hain. Temple ka reference bhi included hai. Yeh sab CRUD operations ke sath possible hai.",
      gradient: "bg-gradient-to-r from-teal-400 to-cyan-500"
    },
    {
      title: "Invitation PDF",
      content: "Aap har donor ke liye invitation PDF generate kar sakte hain jisme unka naam, mobile number aur passcode hoga. Yeh passcode verify ho sakta hai jab user event attend karta hai. Yeh sab CRUD operations ke sath possible hai.",
      gradient: "bg-gradient-to-r from-red-400 to-yellow-500"
    }
  ];

  return (
    <div className="flex items-center justify-center flex-wrap gap-6 p-6">
      {descriptions
        .filter(desc => !selectedService || desc.title === selectedService)
        .map((desc, index) => (
          <div
            key={index}
            className={`flex flex-col p-6 rounded-lg shadow-md w-full md:w-1/2 ${desc.gradient}`}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">{desc.title}</h2>
            <p className="text-white leading-relaxed">{desc.content}</p>
          </div>
      ))}
    </div>
  );
}
