<<<<<<< HEAD
=======

>>>>>>> d1452b7 (Initial commit)
"use client";
import { useTheme } from "./theme-context";
import {
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Settings,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { Button } from "../ui/button";
import { MFSingleSelect } from "./MFSingleSelect";
import { MFDateRangePicker } from "./MFDateRangePicker";
import SignOutButton from "./SignOut";
import { usePathname } from "next/navigation";
import { getToken } from "@/lib/token";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { Api_base } from "@/lib/api_base";
=======
// import { useApiCall } from "@/app/(main)/webfraud/queries/api_base";
import { usePackage } from "@/components/mf/PackageContext";
>>>>>>> d1452b7 (Initial commit)

type ErrorResponse = {
  message: string;
};

<<<<<<< HEAD
type MFTopBarType = {
  isExpanded: boolean;
  onToggle: () => void;
=======
type PackageResponse = string[];

type MFTopBarType = {
  isExpanded: boolean;
  onToggle: () => void;
  isCalender?: boolean;
>>>>>>> d1452b7 (Initial commit)
};

const enable: string[] = [
  "app/dashboard/install",
<<<<<<< HEAD
  "/webfraud/event-visit/dashboard",
];  

export function MFTopBar({ isExpanded, onToggle }: MFTopBarType) {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="shadow-blue-gray-900/5 col-span-2 h-14 bg-background dark:bg-gray-900 dark:text-white">
      <div className="mx-2 flex h-full grow items-center gap-2">
        <Button
          title="Toggle Menu"
          variant="ghost"
          className="w-14 rounded-md border text-center dark:bg-gray-900 dark:text-white"
=======
  "/webfraud/Dashboard/overall-summary",
  "/webfraud/Dashboard/analysis-insights",
  "/webfraud/Dashboard/traffic-insights",
  "/webfraud/Dashboard/actionable-insights",
  "/webfraud/Configuration/WhiteListing-IVT-Category",
  "/webfraud/Configuration/Real-Time-Protection",
  "/webfraud/Download-Ivt-Report/LandingPage-wise",
  "/webfraud/Download-Ivt-Report/Campaign-wise",
  "/webfraud/Configuration/Call-Recommendation",
];  

export function MFTopBar({ isExpanded, onToggle, isCalender=true }: MFTopBarType) {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Add console.log to debug the actual pathname
  console.log('Current pathname:', pathname);
  
  // Check specifically for WhiteListing-IVT-Category page
  const isWhiteListingPage = pathname === "/webfraud/Configuration/WhiteListing-IVT-Category";
  const isCallRecommendationPage = pathname === "/webfraud/Configuration/Call-Recommendation";

  // Check if the current path is enabled
  const isEnabled = enable.some(path => pathname.includes(path));

  return (
    <div className="shadow-blue-gray-900/5 col-span-2 h-auto bg-background dark:bg-gray-900 dark:text-white w-full p-2">
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">      
        <Button
          title="Toggle Menu"
          variant="ghost"
          className="w-full sm:w-14 rounded-md border text-center dark:bg-gray-900 dark:text-white"
>>>>>>> d1452b7 (Initial commit)
          size="icon"
          onClick={onToggle}
        >
          {isExpanded ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
<<<<<<< HEAD
        {enable.includes(pathname) && (
          <>
            <PackageSelect />
            {/* <DashboardSelect /> */}
            <MFDateRangePicker className="rounded-md border" />
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="rounded-md border"
          >
            {isDarkMode ? <Moon /> : <Sun />}
          </Button>
          <UserPopUp />
        </div>
      </div>
    </div>
=======
    
        {isEnabled && (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {/* Package Select - Always show for enabled pages */}
            <div className="w-full sm:w-auto">
              <PackageSelect />
            </div>
    
            {/* Date Range Picker - Hide for WhiteListing and CallRecommendation pages */}
            {!isWhiteListingPage && !isCallRecommendationPage && (
              <div className="w-full sm:w-auto">
                <MFDateRangePicker className="rounded-md border text-body dark:bg-background hover:bg-primary w-full" />
              </div>
            )}
          </div>
        )}
  
      <div className="ml-auto flex items-center gap-2 w-full sm:w-auto justify-between">
        {/* Theme Toggle Button */}
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="rounded-md border"
        >
          {isDarkMode ? <Moon /> : <Sun />}
        </Button>
  
        {/* User PopUp */}
        <UserPopUp />
      </div>
    </div>
  </div>
>>>>>>> d1452b7 (Initial commit)
  );
}

function UserPopUp() {
  const [Uname, setUname] = useState("");

  useEffect(() => {
    const { username } = getToken();
    setUname(username);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="ml-auto mr-2 rounded-md border"
          variant="ghost"
          size="icon"
          title="User"
        >
          <User />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-4 w-fit overflow-clip p-0">
        <div className="flex flex-col">
          <div className="bg-slate-200 p-4 dark:bg-slate-700">
            <p className="text-header">{Uname}</p>
            <p className="text-body">mail@mfilterit.com</p>
          </div>
          <ul className="flex justify-between gap-2 px-4 py-2">
            <li>
              <Link href="/user-details">
                <Button title="Settings" variant="ghost" size="icon">
                  <Settings />
                </Button>
              </Link>
            </li>
            <li className="hover:text-red-500">
              <SignOutButton />
            </li>
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PackageSelect() {
  const [packages, setPackages] = useState<string[]>([]);
<<<<<<< HEAD

  const handlePackagesError = (error: ErrorResponse) => {
    console.error('Error fetching packages:', error);
  };

  const handlePackagesSuccess = (data: any) => {
    if (Array.isArray(data)) {
      setPackages(data);
    }
  };

  const { mutate: mutatePackages, isLoading } = Api_base({
    url: "https://ri52x3pnnf.execute-api.us-west-2.amazonaws.com/dev/api/v1/web/performance/filters/packages",
    method: "POST",
    params: {},
    onError: handlePackagesError,
    onSuccess: handlePackagesSuccess,
  });

  useEffect(() => {
    mutatePackages({
      body: {},
    });
  }, [mutatePackages]);
=======
  const [isLoading, setIsLoading] = useState(false);
  const { selectedPackage, setSelectedPackage } = usePackage();

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("IDToken");
        const response = await fetch(
          "https://ri52x3pnnf.execute-api.us-west-2.amazonaws.com/dev/api/v1/web/performance/filters/packages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token || ""
            },
            body: JSON.stringify({}),
          }
        );
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setPackages(data);
          
          if (!selectedPackage) {
            const savedPackage = localStorage.getItem('selectedPackage');
            const packageToSelect = savedPackage && data.includes(savedPackage) 
              ? savedPackage 
              : data[0];
            
            setSelectedPackage(packageToSelect);
          }
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);
>>>>>>> d1452b7 (Initial commit)

  const items = packages.map(pkg => ({
    title: pkg,
    value: pkg
  }));

<<<<<<< HEAD
=======
  const handlePackageChange = (value: string) => {
    console.log("Package changed to:", value);
    setSelectedPackage(value);
    localStorage.setItem('selectedPackage', value);
  };

>>>>>>> d1452b7 (Initial commit)
  return (
    <MFSingleSelect
      items={items}
      placeholder={isLoading ? "Loading..." : "Select Package"}
      title="Package"
      className="max-w-40"
<<<<<<< HEAD
    />
  );
}

function DashboardSelect() {
  const items = [
    { title: "Install", value: "Install" },
    { title: "Event", value: "Event" },
  ];
  return (
    <MFSingleSelect
      items={items}
      placeholder="Select Type"
      title="Type"
      className="max-w-40"
=======
      value={selectedPackage}
      onValueChange={handlePackageChange}
>>>>>>> d1452b7 (Initial commit)
    />
  );
}
