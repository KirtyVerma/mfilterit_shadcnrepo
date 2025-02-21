// import React from 'react';
// import SidebarComponent from './sidebar-comp';

// export default function Page({
//     children,
//   }: {
//     children: React.ReactNode;
//   }) {
//   // Define the button names
//   const buttonNames = ['Profile', 'Team', 'Billing', 'Notification', 'Update Password'];

//   // Tailwind CSS classes
//   const containerClasses = 'flex h-screen';
//   const sidebarClasses = 'min-w-40 w-60 bg-gray-100 shadow-lg p-4 h-full';
//   const buttonClasses = 'w-full md:py-2  px-4  md:mb-4 text-center text-sm bg-transparent hover:bg-gray-200  rounded-[20px] border border-gray-300';
//   const contentClasses = 'flex-grow';

//   // Define active button style
//   const activeButtonStyle = {
//     backgroundColor: 'hsl(var(--primary))', // Change this to your desired color
//   color:"white"
//   };

//   const headingStyles = 'text-sub-header ml-2';

//   // Data for the ProfileCard, including button information
//   const profileData = {
//     imageUrl: null, // Replace with image URL if available, or null for default icon
//     profileInfo: {
//       name: 'User',
//       description: 'mFilterIt',
//       post: 'Developer',
//     },
//     button: {
//       showButton: true, // Control button visibility
//       buttonName: 'Edit', // Button label
//       buttonClass: 'bg-primary text-white py-2 px-5 rounded-[20px] w-[80px]', // Button styles
//     },
//     heading: 'My Profile', // Heading for ProfileCard
//   };

//   // Data for InfoCard
//   const userInfo = {
//     heading: 'Personal Information',
//     data: {
//       "First Name": 'User',
//       "Last Name": 'User',
//       Email: 'abc@getMaxListeners.com',
//       Phone: '+91 12xxxxxxxxx',
//     },
//     button: {
//       showButton: true,
//       buttonName: 'Edit',
//       buttonClass: 'bg-primary text-white py-2 px-5 rounded-[20px] w-[80px]',
//     },
//   };

//   const userInfo2 = {
//     heading: 'Address',
//     data: {
//       City: 'Bengaluru',
//       Country: 'India',
//       State: 'Karnataka',
//       Postal_Code: '560040',
//     },
//     button: {
//       showButton: true, // Control button visibility
//       buttonName: 'Edit', // Button label
//       buttonClass: 'bg-primary text-white py-2 px-5 rounded-[20px] w-[80px]', // Button styles
//     },
//   };

//   return (
//     <div className={containerClasses}>
//          {children}
//       {/* <SidebarComponent
//         buttonNames={buttonNames}
//         sidebarClasses={sidebarClasses}
//         buttonClasses={buttonClasses}
//         contentClasses={contentClasses}
//         profileData={profileData} // Pass profileData containing all profile and button info
//         userInfo={userInfo}
//         userInfo2={userInfo2}
//         activeButtonStyle={activeButtonStyle} // Pass the active button style as a prop
//         headingStyles={headingStyles}
//       /> */}
//     </div>
//   );
// };
// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Sidebar from './sidebar';// Import the Sidebar component

// type LayoutProps = Partial<{
//   buttonNames: string[];
//   sidebarClasses: string;
//   buttonClasses: string;
//   activeButtonStyle: React.CSSProperties;
//   children: React.ReactNode; // For rendering page content in the layout
// }>;

// const Layout: React.FC<LayoutProps> = ({
//   buttonNames = ['Profile', 'Team', 'Billing', 'Notification', 'Update Password'], // Default button names
//   buttonClasses = 'w-full md:py-2 px-4 md:mb-4 text-center text-sm bg-transparent hover:bg-gray-200 rounded-[20px] border border-gray-300', // Default button classes
//   activeButtonStyle = { backgroundColor: 'hsl(var(--primary))', color: 'white' }, // Default active button style
//   children, // This will contain the page content
// }) => {
//   const router = useRouter();
//   const [activeButton, setActiveButton] = useState<string>('Profile');

//   const handleButtonClick = (buttonName: string) => {
//     setActiveButton(buttonName);
//   };

//   return (
//     <div className="flex   flex-col md:flex-row  ">
//       {/* Render Sidebar component with props */}
//       <Sidebar
//         buttonNames={buttonNames}
//         activeButton={activeButton}
//         activeButtonStyle={activeButtonStyle}
//         buttonClasses={buttonClasses}
//         handleButtonClick={handleButtonClick}
//       />

//       {/* Content area */}
//       <div className="flex-grow w-full ml-2">
//         {children} {/* This will render the page content */}
//       </div>
//     </div>
//   );
// };

// export default Layout;

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar"; // Import the Sidebar component

type LayoutProps = Partial<{
  buttonNames: string[];
  buttonClasses: string;
  activeButtonStyle: React.CSSProperties;
  children: React.ReactNode; // For rendering page content in the layout
}>;

const Layout: React.FC<LayoutProps> = ({
  buttonNames = ["Profile", "Team", "Billing", "Notification", "Security"], // Default button names
  buttonClasses = "w-full md:py-2 px-4 md:mb-4 text-center text-sm bg-transparent hover:bg-gray-200 rounded-[20px] border border-gray-300", // Default button classes
  activeButtonStyle = {
    backgroundColor: "hsl(var(--primary))",
    color: "white",
  }, // Default active button style
  children, // This will contain the page content
}) => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string>("Profile");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Render Sidebar component with props */}
      <Sidebar
        buttonNames={buttonNames}
        activeButton={activeButton}
        activeButtonStyle={activeButtonStyle}
        buttonClasses={buttonClasses}
        handleButtonClick={handleButtonClick}
      />

      {/* Content area */}
      <div className="w-full flex-grow md:ml-[9rem]">
        {/* Reduced margin for md screens */}
        {children} {/* This will render the page content */}
      </div>
    </div>
  );
};

export default Layout;
