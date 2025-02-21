// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// type SidebarProps = Partial<{
//   buttonNames: string[];
//   activeButton: string;
//   activeButtonStyle: React.CSSProperties;
//   buttonClasses: string;
//   handleButtonClick: (buttonName: string) => void;
// }>;

// const Sidebar: React.FC<SidebarProps> = ({
//   buttonNames = ['Profile', 'Team', 'Billing', 'Notification', 'Update Password'],
//   activeButton = '',
//   activeButtonStyle = { backgroundColor: 'hsl(var(--primary))', color: 'white' },
//   buttonClasses = 'w-full md:py-2 px-4 md:mb-4 text-center text-sm bg-transparent hover:bg-gray-200 rounded-[20px] border border-gray-300',
//   handleButtonClick = () => {},
// }) => {
//   const router = useRouter();
//   useEffect(() => {
//     if (activeButton === 'Profile') {
//       router.push('/user-details/profile');
//     }
//     if (activeButton === 'Team') {
//         router.push('/user-details/teams');
//       }

//       if (activeButton === 'Billing') {
//         router.push('/user-details/billing');
//       }
//       if (activeButton === 'Notification') {
//         router.push('/user-details/notification');
//       }

//       if (activeButton === 'Update Password') {
//         router.push('/user-details/update-password');
//       }
//   }, [activeButton]);

//   return (
//     <>
//       {/* Sidebar for medium screens and above */}
//       <div className=" min-w-40 w-60 bg-gray-100 shadow-lg p-4  hidden md:block h-screen ">
//         <ul>
//           {buttonNames.map((buttonName) => (
//             <li key={buttonName}>
//               <button
//                 style={activeButton === buttonName ? activeButtonStyle : {}}
//                 className={`${buttonClasses}`}
//                 onClick={() => handleButtonClick(buttonName)}
//               >
//                 {buttonName}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Buttons as a row in mobile view, hiding the sidebar */}
//       <div className="flex md:hidden justify-center w-full mb-4">
//         {buttonNames.map((buttonName) => (
//           <button
//             key={buttonName}
//             style={activeButton === buttonName ? activeButtonStyle : {}}
//             className={`${buttonClasses} text-xs mx-1`}
//             onClick={() => handleButtonClick(buttonName)}
//           >
//             {buttonName}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Sidebar;
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type SidebarProps = Partial<{
  buttonNames: string[];
  activeButton: string;
  activeButtonStyle: React.CSSProperties;
  buttonClasses: string;
  handleButtonClick: (buttonName: string) => void;
}>;

const Sidebar: React.FC<SidebarProps> = ({
  buttonNames = ["Profile", "Team", "Billing", "Notification", "Security"],
  activeButton = "",
  activeButtonStyle = {
    backgroundColor: "hsl(var(--primary))",
    color: "white",
  },
  buttonClasses = "w-full md:py-2 px-4 md:mb-4 text-center text-body",
  handleButtonClick = () => {},
}) => {
  const router = useRouter();

  useEffect(() => {
    if (activeButton === "Profile") {
      router.push("/user-details/profile");
    }
    if (activeButton === "Team") {
      router.push("/user-details/teams");
    }
    if (activeButton === "Billing") {
      router.push("/user-details/billing");
    }
    if (activeButton === "Notification") {
      router.push("/user-details/notification");
    }
    if (activeButton === "Security") {
      router.push("/user-details/security");
    }
  }, [activeButton]);

  return (
    <>
      {/* Sidebar for medium screens and above */}
      <div className="w-50 fixed z-0 hidden h-screen bg-gray-100 p-4 shadow-lg dark:bg-card md:block">
        <ul>
          {buttonNames.map((buttonName) => (
            <li key={buttonName}>
              <Button
                variant={activeButton === buttonName ? "default" : "secondary"}
                style={activeButton === buttonName ? activeButtonStyle : {}}
                className={buttonClasses}
                onClick={() => handleButtonClick(buttonName)}
              >
                {buttonName}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons as a row in mobile view, hiding the sidebar */}
      <div className="mb-4 flex w-full justify-center md:hidden">
        {buttonNames.map((buttonName) => (
          <button
            key={buttonName}
            style={activeButton === buttonName ? activeButtonStyle : {}}
            className={`${buttonClasses} mx-1 text-xs`}
            onClick={() => handleButtonClick(buttonName)}
          >
            {buttonName}
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
