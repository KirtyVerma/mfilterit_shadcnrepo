// "use client";
// import { useEffect } from "react";
// import ResizableTable, { Column } from "@/components/mf/TableComponent";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// // import { Input } from "postcss";
// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";

// import { DateRange } from "react-day-picker";
// import { format, parseISO } from "date-fns";
// import { MFDateRangePicker } from "@/components/mf";
// import { DatePickerWithRange } from "@/components/mf/dateexp";
// import axios from "axios";
// import { CircleMinus, CirclePlus } from "lucide-react";
// import { useAPI } from "@/queries/useAPI";
// import Endpoint from "@/common/endpoint";

// const campaignColumns: Column<Record<string, string | number>>[] = [
//   { title: "Campaign", key: "campaign" },
//   { title: "Budget", key: "budget" },
//   { title: "Ad Group", key: "ad_group" },
//   { title: "Keywords", key: "keywords" },
//   { title: "Products", key: "products" },
// ];

// const existingColumns: Column<Record<string, string | number>>[] = [
//   { title: "Campaign", key: "campaign" },
//   { title: "Start Date", key: "startDate" },
//   { title: "Budget", key: "budget" },
//   { title: "Metric", key: "metric" },
//   { title: "Impressions", key: "impressions" },
//   { title: "Clicks", key: "clicks" },
//   { title: "Spends", key: "spends" },
//   { title: "Pre Automation RoAS", key: "pre_roas" },
//   { title: "Post Automation RoAS", key: "post_roas" },
// ];

// const campaignData = [
//   {
//     campaign: "SP | Reed Diffuser | Generic Keywords",
//     budget: 1000,
//     ad_group: "Ad Group 1",
//     keywords: "Reed",
//     products: "B0918519KF",
//   },
//   {
//     campaign: "SP | Aroma Oil | Generic Keywords",
//     budget: 1500,
//     ad_group: "Ad Group 2",
//     keywords: "Aroma Oil",
//     products: "B09184F77F",
//   },
// ];

// const existingData = [
//   {
//     campaign: "SP | Reed Diffuser | Generic Keywords",
//     startDate: "2024-03-15",
//     budget: 1000,
//     metric: "RoAS",
//     impressions: 5000,
//     clicks: 200,
//     spends: 500,
//     pre_roas: 2.5,
//     post_roas: 3.5,
//   },
//   {
//     campaign: "SP | Aroma Oil | Generic Keywords",
//     startDate: "2024-03-14",
//     budget: 1500,
//     metric: "RoAS",
//     impressions: 8000,
//     clicks: 300,
//     spends: 700,
//     pre_roas: 1.8,
//     post_roas: 2.1,
//   },
// ];











// const PacingConfig: React.FC = () => {
//   // Dropdown filter states
//   const [customValue, setCustomValue] = useState('');
//   const [isCustom, setIsCustom] = useState(false);
//   const [campaignNames, setCampaignNames] = useState([]);
//   const [allData, setAllData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [saveloading, setSaveLoading] = useState(false);
  
  
//   const [selectedCampaign, setSelectedCampaign] = useState<string | undefined>('');
//   const [budget,setBudget]= useState<number>()
//   const [aggressiveSpend,setAggressiveSpend]= useState<number>()
//   const [selectedProfile, setSelectedProfile] = useState('');
//   const [selectedStrategy, setSelectedStrategy] = useState<
//     string | undefined
//   >();
//   const [selectedMetric, setSelectedMetric] = useState<string | undefined>();
//   // const [isWeekend, setIsWeekend] = useState(false)
//   const [isWeekend, setIsWeekend] = useState<string>("weekend");
//   const today = new Date();

//   // Initialize state with the current date for both from and to
//   const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
//     from: today,
//     to: today,
//   });
// //    const [tableData, setTableData] = useState([]);
// const [campaignList, setcampaignList] = useState([]);
// const [ProfileName, setProfileName] = useState();
// const [profileList, setProfileList] = useState([]);
// const [query, setQuery] = useState({
//   platform: ["all"],
//   campaign_type: ["all"],
//   campaign_name: ["all"],
//   status: ["all"],
//   });

//   const columns = (): Column<Record<string, string | number>>[] => [
//     { title: "Customer.Status", key: "status" },
//     { title: "Platform", key: "platform" },
//     { title: "Campaign Name", key: "campaign_name" },
    
//     { title: "Budget", key: "budget" },
//   ];
//   var username = "gui";
//   var password = "gui_secret_password@mfilterit";

//   const [startDate, setStartDate] = React.useState<string>(format(today, "yyyy-MM-dd"));
//   const [endDate, setEndDate] = React.useState<string>(format(today, "yyyy-MM-dd"));

//   // Handler for updating date range
//   const handleDateChange = (newDateRange: DateRange | undefined) => {
//     setDateRange(newDateRange);

//     // Update formatted start date
//     if (newDateRange?.from) {
//       setStartDate(format(newDateRange.from, "yyyy-MM-dd"));
//     } else {
//       setStartDate("");
//     }

//     // Update formatted end date
//     if (newDateRange?.to) {
//       setEndDate(format(newDateRange.to, "yyyy-MM-dd"));
//     } else {
//       setEndDate("");
//     }
//   };
// useEffect(()=>{

//   _hndInput()
//   if (selectedCampaign) {
//     setQuery((prevQuery) => ({
//       ...prevQuery, // Copy the previous state
//       campaign_name: [selectedCampaign], // Update campaign_name with the new value
//     }));
//   }
//   refetchCampaigns()
// },[selectedCampaign])
// useEffect(()=>{
//   if (query) {
    
//   refetchCampaigns()}
// },[query])
// console.log(startDate,endDate,"dates")
//   useEffect(()=>{
//     axios
//     .post(
//       `https://ecomm-ams-api.mfilterit.net/get_pacing_configurations_profiles`,
//       { profile_name:selectedProfile
      
//        },
//       {
//         auth: {
//           username: username,
//           password: password,
//         },
//       }
//     )
//     .then((respo) => {
//        console.log(respo.data,"22222");
//       if (respo.data.status === "OK") {
//         setTableData(respo.data.data)
//   //       toast.success("Data is submitted successfully");
//   // setLoading(false)
//       }else{
//         // setLoading(false)
//         // toast.error("Update failed");
//       }
//     });
//   },[selectedProfile])

  
//   useEffect(()=>{
//     axios
//     .post(
//       `https://ecomm-ams-api.mfilterit.net/get_pacing_configurations_profiles`,
//       { profile_name: "office_hours_traffic"
      
//        },
//       {
//         auth: {
//           username: username,
//           password: password,
//         },
//       }
//     )
//     .then((respo) => {
//        console.log(respo.data,"22222");
//       if (respo.data.status === "OK") {
//         setTableData(respo.data.data)
//   //       toast.success("Data is submitted successfully");
//   // setLoading(false)
//       }else{
//         // setLoading(false)
//         // toast.error("Update failed");
//       }
//     });


   










//     axios
//     .get(
//       `https://ecomm-ams-api.mfilterit.net/get_pacing_campaign_name`,
      
//       {
//         auth: {
//           username: username,
//           password: password,
//         },
//       }
//     )
//     .then((respo) => {
//        console.log(respo.data,"22222");
//       if (respo.data.status === "OK") {
//         setcampaignList(respo.data.data)
//   //       toast.success("Data is submitted successfully");
//   // setLoading(false)
//       }else{
//         // setLoading(false)
//         // toast.error("Update failed");
//       }
//     });
   
//   },[])

//   const {
//     data: campaignData,
//     isLoading: isCampaignLoading,
//     refetch: refetchCampaigns,
//   } = useAPI<Record<string, string | number>[], { message: string }>({
//     tag: "CampaignOverview",
//     options: {
//       url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_OVERVIEW,
//       method: "POST",
//       data: query,
//     },
//   });

// console.log(campaignList,"list")
//   const [tableData, setTableData] = useState<any[]>([]);

//   // Handle hour changes (start_time / end_time)
//   const handleHrTime = (time: any, timeString: any, index: any, field: any) => {
//     const updatedData = [...tableData];
//     updatedData[index][field] = timeString;
//     setTableData(updatedData);
//   };

//   // Handle number changes (total_budget_spend_perc, adjustment, aggressive_spend_perc)
//   const handleTimeRangeNumbers = (e: any, index: any, field: any) => {
//     const updatedData = [...tableData];
//     updatedData[index][field] = e.target.value;
//     setTableData(updatedData);
//   };

//   // Remove an item from tableData
//   const removeItem = (index: any) => {
//     const updatedData = tableData.filter((_: any, i: any) => i !== index);
//     setTableData(updatedData);
//   };

//   // Add a new item to tableData
//   const addItem = () => {
//     setTableData([
//       ...tableData,
//       {
//         start_time: '00',
//         end_time: '00',
//         total_budget_spend_perc: 0,
//         // adjustment: 0,
//         // aggressive_spend_perc: 0,
//       },
//     ]);
//   };
//   const handleDropdownChange = (value: string, index: number, field: string) => {
//     const updatedData = [...tableData];
//     updatedData[index][field] = value;
//     setTableData(updatedData);
//   };
  

//   // const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
//   const hours = Array.from({ length: 24 }, (_, i) => `${i < 10 ? `0${i}` : i}:00`);

// console.log(selectedCampaign,"qq")
//   // const handleDateChange = (newDateRange: DateRange | undefined) => {
//   //   setSelectedDateRange(newDateRange);
//   //   if (newDateRange?.from && newDateRange?.to) {
//   //     console.log("Start Date:", newDateRange.from.toISOString());
//   //     console.log("End Date:", newDateRange.to.toISOString());
//   //   } else {
//   //     console.log("Incomplete date range selected");
//   //   }
//   // };
  

// const _hndInput = () => {
    
//   axios
//     .post(
//       `https://ecomm-ams-api.mfilterit.net/get_pacing_configuration`,
//       { campaign_name:selectedCampaign
      
//        },
//       {
//         auth: {
//           username: username,
//           password: password,
//         },
//       }
//     )
//     .then((respo) => {
//        console.log(respo.data,"22222");
//       if (respo.data.status === "OK") {
//         setSelectedProfile(respo.data?.data?.profile_name)
//         setProfileList(respo.data?.data?.profile_name_list
//         )
//         setIsWeekend(respo.data?.data?.day_type)
//         setBudget(respo.data?.data?.total_budget_allocated)
//         setAggressiveSpend(respo.data?.data?.aggressive_spend_trigger)
//         setAllData(respo.data?.data || {});

//         const parsedStartDate = parseISO(respo.data?.data?.start_date);
//     const parsedEndDate = parseISO(respo.data?.data?.end_date);

//     // Update state with parsed dates
//     setDateRange({ from: parsedStartDate, to: parsedEndDate });
//     setStartDate(format(parsedStartDate, "yyyy-MM-dd"));
//     // setEndDate(format(parsedEndDate, "yyyy-MM-dd"));
//     //     setEndDate(respo.data?.data?.start_date
//     //     )
//     //     setStartDate(respo.data?.data?.end_date
//     //     )
//   //       toast.sucess("Data is submitted successfully");
//   // setLoading(false)
//       }else{
//         // setLoading(false)
//         // toast.error("Update failed");
//       }
//     });
   

     
      
//     } 
   
//     const handleToggle = (checked: boolean) => {
//       setIsWeekend(checked ? "weekend" : "weekday");
//     };
  
// console.log(selectedProfile,"pn")




// console.log(tableData,"tabledata")





//   return (
//     <div className="container relative bg-card p-4">
//       <Card className="h-fit">
//       <CardHeader>
//         <CardTitle>Pacing config</CardTitle>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-2">
//       <div className="grid gap-4 sm:grid-cols-3">
//   <Select
//     onValueChange={setSelectedCampaign}
//     defaultValue={selectedCampaign}
//   >
//     <SelectTrigger className="w-full">
//       <SelectValue placeholder="Campaign Name" />
//     </SelectTrigger>
//     <SelectContent>
//     {campaignList
//         .filter((item) => item  !== "") // Filter out empty or invalid strings
//         .map((item, index) => (
//           <SelectItem key={index} value={item}>
//             {item}
//           </SelectItem>
//         ))}
//     </SelectContent>
//   </Select>

//  {<Input
//     placeholder="Budget"
//     type="number"
//     value={budget}
//     onChange={(e) => setBudget(Number(e.target.value))}
//     className="w-full"
//   />}

// { profileList && (
//   <Select
//     onValueChange={setSelectedProfile} // Handles the value change
//     value={selectedProfile} // Controlled component
//   >
//     <SelectTrigger className="w-full">
//       <SelectValue placeholder="Select Profile" />
//     </SelectTrigger>
//     <SelectContent>
//       {profileList.map((item, index) => (
//         <SelectItem key={index} value={item}>
//           {item}
//         </SelectItem>
//       ))}
//     </SelectContent>
//   </Select>
// )}
// </div>
// {
// <div className="grid gap-4 sm:grid-cols-3">
//   <Input 
//     placeholder="Aggressive Spend Trigger for RoAS Change (%)"
//     type="number"
//     value={aggressiveSpend}
//     onChange={(e) => setAggressiveSpend(Number(e.target.value))}
//     className="w-full my-4"
//   />

//   {/* <div className="flex items-center my-4">
//     <label className="flex items-center justify-center space-x-2">
//       <span>{isWeekend ? "Weekend" : "Weekday"}</span>
//       <Switch
//         checked={isWeekend}
//         onCheckedChange={(checked) => setIsWeekend(checked)}
//       />
//     </label>
//   </div> */}
// <div className="flex items-center my-4">
//       <label className="flex items-center justify-center space-x-2">
//         <span>{isWeekend === "weekend" ? "Weekend" : "Weekday"}</span>
//         <Switch
//           checked={isWeekend === "weekend"} // Convert the string state to a boolean for the Switch
//           onCheckedChange={handleToggle}
//         />
//       </label>
//     </div>
//     <DatePickerWithRange
//         date={dateRange}
//         onDateChange={handleDateChange}
//         className="custom-class my-4"
//       />
// </div>}

// <div className="container relative bg-card">
     
//       <ResizableTable
//         columns={columns()}
//         data={campaignData ?? []}
//         isLoading={isCampaignLoading}
//         headerColor="#DCDCDC"
//         onRefresh={refetchCampaigns}
//         // onSelect={setSelected}
    
        
//         isSearchable
//         isSelectable
//       />
//     </div>



// {<div className="grid grid-cols-1 gap-4">
// <h2 className="text-lg font-semibold mb-4">Time Range(s)</h2>
//       <div className="grid grid-cols-6 gap-4 font-medium mb-2">
//         <div>Start Time</div>
//         <div>End Time</div>
//         <div>Spends %</div>
//         {/* <div>Adjustment (%)</div>
//         <div>Aggressive Spends (%)</div> */}
//         <div>Actions</div>
//       </div>
//       <div className="max-h-[300px] overflow-y-auto mb-5">
//       {tableData.map((range: any, index: any) => (
//         <div key={index} className="grid grid-cols-6 gap-4 items-center mb-4">
//           {/* Start Time */}
//           <div>
//           <Select
//   value={range.start_time} // Controlled value
//   onValueChange={(value) => handleDropdownChange(value, index, "start_time")} // Handle value changes
// >
//   <SelectTrigger className="border rounded px-2 py-1 w-full">
//     <SelectValue placeholder="Select" />
//   </SelectTrigger>
//   <SelectContent>
//     {hours.map((hour) => (
//       <SelectItem key={hour} value={hour}>
//         {hour}
//       </SelectItem>
//     ))}
//   </SelectContent>
// </Select>

//           </div>

//           {/* End Time */}
//           <div>
//           <Select
//   value={range.end_time} // Controlled value
//   onValueChange={(value) => handleDropdownChange(value, index, "end_time")} // Handle value changes
// >
//   <SelectTrigger className="border rounded px-2 py-1 w-full">
//     <SelectValue placeholder="Select" />
//   </SelectTrigger>
//   <SelectContent>
//     {hours.map((hour) => (
//       <SelectItem key={hour} value={hour}>
//         {hour}
//       </SelectItem>
//     ))}
//   </SelectContent>
// </Select>

//           </div>


//           {/* Total Budget Spend Percentage */}
//           <div>
//             <Input
//               type="number"
//               value={range.total_budget_spend_perc}
//               onChange={(e: any) =>
//                 handleTimeRangeNumbers(e, index, 'total_budget_spend_perc')
//               }
//               placeholder="Spends %"
//               className="w-full"
//             />
//           </div>

//           {/* Adjustment */}
//           {/* <div>
//             <Input
//               type="number"
//               value={range.adjustment}
//               onChange={(e: any) => handleTimeRangeNumbers(e, index, 'adjustment')}
//               max={3}
//               placeholder="Adjustment %"
//               className="w-full"
//             />
//           </div> */}

//           {/* Aggressive Spend Percentage */}
//           {/* <div>
//             <Input
//               type="number"
//               value={range.aggressive_spend_perc}
//               onChange={(e: any) =>
//                 handleTimeRangeNumbers(e, index, 'aggressive_spend_perc')
//               }
//               placeholder="Aggressive %"
//               className="w-full"
//             />
//           </div> */}

//           {/* Action Buttons */}
//           <div className="flex items-center space-x-2">
//             {tableData.length > 1 && (
//               <Button
//               size="icon"
//               className="rounded-md px-2"
//               onClick={() => removeItem(index)}
//             >
//               <CircleMinus />
//             </Button>
//             )}
//             {index === tableData.length - 1 && (
//                <Button
//                size="icon"
//                className="rounded-md px-2"
//                onClick={addItem}
//                title="Add another row"
//              >
//                <CirclePlus />
//              </Button>
//             )}
//           </div>
//         </div>
//       ))}</div>
//  </div>}

//       </CardContent>
//     </Card>
//     </div>
//   );
// };

// export default PacingConfig;
"use client";
import { useEffect } from "react";
import ResizableTable, { Column } from "@/components/mf/TableComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import { Input } from "postcss";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

import { DateRange } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { MFDateRangePicker } from "@/components/mf";
import { DatePickerWithRange } from "@/components/mf/dateexp";
import axios from "axios";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useAPI } from "@/queries/useAPI";
import Endpoint from "@/common/endpoint";

const campaignColumns: Column<Record<string, string | number>>[] = [
  { title: "Campaign", key: "campaign" },
  { title: "Budget", key: "budget" },
  { title: "Ad Group", key: "ad_group" },
  { title: "Keywords", key: "keywords" },
  { title: "Products", key: "products" },
];

const existingColumns: Column<Record<string, string | number>>[] = [
  { title: "Campaign", key: "campaign" },
  { title: "Start Date", key: "startDate" },
  { title: "Budget", key: "budget" },
  { title: "Metric", key: "metric" },
  { title: "Impressions", key: "impressions" },
  { title: "Clicks", key: "clicks" },
  { title: "Spends", key: "spends" },
  { title: "Pre Automation RoAS", key: "pre_roas" },
  { title: "Post Automation RoAS", key: "post_roas" },
];

const campaignData = [
  {
    campaign: "SP | Reed Diffuser | Generic Keywords",
    budget: 1000,
    ad_group: "Ad Group 1",
    keywords: "Reed",
    products: "B0918519KF",
  },
  {
    campaign: "SP | Aroma Oil | Generic Keywords",
    budget: 1500,
    ad_group: "Ad Group 2",
    keywords: "Aroma Oil",
    products: "B09184F77F",
  },
];

const existingData = [
  {
    campaign: "SP | Reed Diffuser | Generic Keywords",
    startDate: "2024-03-15",
    budget: 1000,
    metric: "RoAS",
    impressions: 5000,
    clicks: 200,
    spends: 500,
    pre_roas: 2.5,
    post_roas: 3.5,
  },
  {
    campaign: "SP | Aroma Oil | Generic Keywords",
    startDate: "2024-03-14",
    budget: 1500,
    metric: "RoAS",
    impressions: 8000,
    clicks: 300,
    spends: 700,
    pre_roas: 1.8,
    post_roas: 2.1,
  },
];











const PacingConfig: React.FC = () => {
  // Dropdown filter states
  const [customValue, setCustomValue] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [campaignNames, setCampaignNames] = useState([]);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveloading, setSaveLoading] = useState(false);
  
  
  const [selectedCampaign, setSelectedCampaign] = useState<string | undefined>('');
  const [budget,setBudget]= useState<number>()
  const [aggressiveSpend,setAggressiveSpend]= useState<number>()
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<
    string | undefined
  >();
  const [selectedMetric, setSelectedMetric] = useState<string | undefined>();
  // const [isWeekend, setIsWeekend] = useState(false)
  const [isWeekend, setIsWeekend] = useState<string>("weekend");
  const today = new Date();

  // Initialize state with the current date for both from and to
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: today,
    to: today,
  });
//    const [tableData, setTableData] = useState([]);
const [campaignList, setcampaignList] = useState([]);
const [ProfileName, setProfileName] = useState();
const [profileList, setProfileList] = useState([]);
const [query, setQuery] = useState({
  platform: ["all"],
  campaign_type: ["all"],
  campaign_name: ["all"],
  status: ["all"],
  });
  const dayPreference = [
    { value: 'sunday', label: 'Sunday' },
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' }
  ];
  const columns = (): Column<Record<string, string | number>>[] => [
    { title: "Customer.Status", key: "status" },
    { title: "Platform", key: "platform" },
    { title: "Campaign Name", key: "campaign_name" },
    
    { title: "Budget", key: "budget" },
  ];
  var username = "gui";
  var password = "gui_secret_password@mfilterit";

  const [startDate, setStartDate] = React.useState<string>(format(today, "yyyy-MM-dd"));
  const [endDate, setEndDate] = React.useState<string>(format(today, "yyyy-MM-dd"));

  // Handler for updating date range
  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);

    // Update formatted start date
    if (newDateRange?.from) {
      setStartDate(format(newDateRange.from, "yyyy-MM-dd"));
    } else {
      setStartDate("");
    }

    // Update formatted end date
    if (newDateRange?.to) {
      setEndDate(format(newDateRange.to, "yyyy-MM-dd"));
    } else {
      setEndDate("");
    }
  };
useEffect(()=>{

  _hndInput()
  if (selectedCampaign) {
    setQuery((prevQuery) => ({
      ...prevQuery, // Copy the previous state
      campaign_name: [selectedCampaign], // Update campaign_name with the new value
    }));
  }
  refetchCampaigns()
},[selectedCampaign])
useEffect(()=>{
  if (query) {
    
  refetchCampaigns()}
},[query])
console.log(startDate,endDate,"dates")
  useEffect(()=>{
    axios
    .post(
      `https://ecomm-ams-api.mfilterit.net/get_pacing_configurations_profiles`,
      { profile_name:selectedProfile
      
       },
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    .then((respo) => {
       console.log(respo.data,"22222");
      if (respo.data.status === "OK") {
        setTableData(respo.data.data)
  //       toast.success("Data is submitted successfully");
  // setLoading(false)
      }else{
        // setLoading(false)
        // toast.error("Update failed");
      }
    });
  },[selectedProfile])

  
  useEffect(()=>{
    axios
    .post(
      `https://ecomm-ams-api.mfilterit.net/get_pacing_configurations_profiles`,
      { profile_name: "office_hours_traffic"
      
       },
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    .then((respo) => {
       console.log(respo.data,"22222");
      if (respo.data.status === "OK") {
        setTableData(respo.data.data)
  //       toast.success("Data is submitted successfully");
  // setLoading(false)
      }else{
        // setLoading(false)
        // toast.error("Update failed");
      }
    });


   










    axios
    .get(
      `https://ecomm-ams-api.mfilterit.net/get_pacing_campaign_name`,
      
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    .then((respo) => {
       console.log(respo.data,"22222");
      if (respo.data.status === "OK") {
        setcampaignList(respo.data.data)
  //       toast.success("Data is submitted successfully");
  // setLoading(false)
      }else{
        // setLoading(false)
        // toast.error("Update failed");
      }
    });
   
  },[])

  const {
    data: campaignData,
    isLoading: isCampaignLoading,
    refetch: refetchCampaigns,
  } = useAPI<Record<string, string | number>[], { message: string }>({
    tag: "CampaignOverview",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_OVERVIEW,
      method: "POST",
      data: query,
    },
  });

console.log(campaignList,"list")
  const [tableData, setTableData] = useState<any[]>([]);

  // Handle hour changes (start_time / end_time)
  const handleHrTime = (time: any, timeString: any, index: any, field: any) => {
    const updatedData = [...tableData];
    updatedData[index][field] = timeString;
    setTableData(updatedData);
  };

  // Handle number changes (total_budget_spend_perc, adjustment, aggressive_spend_perc)
  const handleTimeRangeNumbers = (e: any, index: any, field: any) => {
    const updatedData = [...tableData];
    updatedData[index][field] = e.target.value;
    setTableData(updatedData);
  };

  // Remove an item from tableData
  const removeItem = (index: any) => {
    const updatedData = tableData.filter((_: any, i: any) => i !== index);
    setTableData(updatedData);
  };

  // Add a new item to tableData
  const addItem = () => {
    setTableData([
      ...tableData,
      {
        start_time: '00',
        end_time: '00',
        total_budget_spend_perc: 0,
        // adjustment: 0,
        // aggressive_spend_perc: 0,
      },
    ]);
  };
  const handleDropdownChange = (value: string, index: number, field: string) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    setTableData(updatedData);
  };
  

  // const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
  const hours = Array.from({ length: 24 }, (_, i) => `${i < 10 ? `0${i}` : i}:00`);

console.log(selectedCampaign,"qq")
  // const handleDateChange = (newDateRange: DateRange | undefined) => {
  //   setSelectedDateRange(newDateRange);
  //   if (newDateRange?.from && newDateRange?.to) {
  //     console.log("Start Date:", newDateRange.from.toISOString());
  //     console.log("End Date:", newDateRange.to.toISOString());
  //   } else {
  //     console.log("Incomplete date range selected");
  //   }
  // };
  

const _hndInput = () => {
    
  axios
    .post(
      `https://ecomm-ams-api.mfilterit.net/get_pacing_configuration`,
      { campaign_name:selectedCampaign
      
       },
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    .then((respo) => {
       console.log(respo.data,"22222");
      if (respo.data.status === "OK") {
        setSelectedProfile(respo.data?.data?.profile_name)
        setProfileList(respo.data?.data?.profile_name_list
        )
        setIsWeekend(respo.data?.data?.day_type)
        setBudget(respo.data?.data?.total_budget_allocated)
        setAggressiveSpend(respo.data?.data?.aggressive_spend_trigger)
        setAllData(respo.data?.data || {});

        const parsedStartDate = parseISO(respo.data?.data?.start_date);
    const parsedEndDate = parseISO(respo.data?.data?.end_date);

    // Update state with parsed dates
    setDateRange({ from: parsedStartDate, to: parsedEndDate });
    setStartDate(format(parsedStartDate, "yyyy-MM-dd"));
    // setEndDate(format(parsedEndDate, "yyyy-MM-dd"));
    //     setEndDate(respo.data?.data?.start_date
    //     )
    //     setStartDate(respo.data?.data?.end_date
    //     )
  //       toast.sucess("Data is submitted successfully");
  // setLoading(false)
      }else{
        // setLoading(false)
        // toast.error("Update failed");
      }
    });
   

     
      
    } 
   
    const handleToggle = (checked: boolean) => {
      setIsWeekend(checked ? "weekend" : "weekday");
    };
  
console.log(selectedProfile,"pn")




console.log(tableData,"tabledata")





  return (
    <div className="container relative bg-card p-4">
      <Card className="h-fit">
      <CardHeader>
        <CardTitle>Pacing config</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
      <div className="grid gap-4 sm:grid-cols-3">
  <Select
    onValueChange={setSelectedCampaign}
    defaultValue={selectedCampaign}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Customer" />
    </SelectTrigger>
    <SelectContent>
    {campaignList
        .filter((item) => item  !== "") // Filter out empty or invalid strings
        .map((item, index) => (
          <SelectItem key={index} value={item}>
            {item}
          </SelectItem>
        ))}
    </SelectContent>
  </Select>

 { <Select
    onValueChange={setSelectedCampaign}
    defaultValue={selectedCampaign}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Platform" />
    </SelectTrigger>
    <SelectContent>
    {campaignList
        .filter((item) => item  !== "") // Filter out empty or invalid strings
        .map((item, index) => (
          <SelectItem key={index} value={item}>
            {item}
          </SelectItem>
        ))}
    </SelectContent>
  </Select>}

{  (
  <Select
    onValueChange={setSelectedProfile} // Handles the value change
    value={selectedProfile} // Controlled component
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Pacing Config" />
    </SelectTrigger>
    <SelectContent>
      {profileList.map((item, index) => (
        <SelectItem key={index} value={item}>
          {item}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}
</div>
{
<div className="grid gap-4 sm:grid-cols-3">
  <div className="my-4">
<Select 
    onValueChange={setSelectedCampaign}
    defaultValue={selectedCampaign}
    
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Campaign Name" />
    </SelectTrigger>
    <SelectContent>
    {campaignList
        .filter((item) => item  !== "") // Filter out empty or invalid strings
        .map((item, index) => (
          <SelectItem key={index} value={item}>
            {item}
          </SelectItem>
        ))}
    </SelectContent>
  </Select>
  </div>
  {/* <div className="flex items-center my-4">
    <label className="flex items-center justify-center space-x-2">
      <span>{isWeekend ? "Weekend" : "Weekday"}</span>
      <Switch
        checked={isWeekend}
        onCheckedChange={(checked) => setIsWeekend(checked)}
      />
    </label>
  </div> */}
<div className="flex items-center my-4">
<Select 
    // onValueChange={setSelectedCampaign}
    // defaultValue={selectedCampaign}
    
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Weekday Name" />
    </SelectTrigger>
    <SelectContent>
    {dayPreference.map((item, index) => (
          <SelectItem key={index} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
    </SelectContent>
  </Select>
    </div>
    <DatePickerWithRange
        date={dateRange}
        onDateChange={handleDateChange}
        className="custom-class my-4"
      />
</div>}

<div className="container relative bg-card">
     
      <ResizableTable
        columns={columns()}
        data={campaignData ?? []}
        isLoading={isCampaignLoading}
        headerColor="#DCDCDC"
        onRefresh={refetchCampaigns}
        // onSelect={setSelected}
    
        
        isSearchable
        isSelectable
      />
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
    <Select
    onValueChange={setSelectedProfile} // Handles the value change
    value={selectedProfile} // Controlled component
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select a Present Profile " />
    </SelectTrigger>
    <SelectContent>
      {profileList.map((item, index) => (
        <SelectItem key={index} value={item}>
          {item}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  </div>
{<div className="grid grid-cols-1 gap-4">
<h2 className="text-lg font-semibold mb-4">Time Range(s)</h2>
      <div className="grid grid-cols-6 gap-4 font-medium mb-2">
        <div>Start Time</div>
        <div>End Time</div>
        <div>Spends %</div>
        {/* <div>Adjustment (%)</div>
        <div>Aggressive Spends (%)</div> */}
        <div>Actions</div>
      </div>
      <div className="max-h-[300px] overflow-y-auto mb-5">
      {tableData.map((range: any, index: any) => (
        <div key={index} className="grid grid-cols-6 gap-4 items-center mb-4">
          {/* Start Time */}
          <div>
          <Select
  value={range.start_time} // Controlled value
  onValueChange={(value) => handleDropdownChange(value, index, "start_time")} // Handle value changes
>
  <SelectTrigger className="border rounded px-2 py-1 w-full">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    {hours.map((hour) => (
      <SelectItem key={hour} value={hour}>
        {hour}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>

          {/* End Time */}
          <div>
          <Select
  value={range.end_time} // Controlled value
  onValueChange={(value) => handleDropdownChange(value, index, "end_time")} // Handle value changes
>
  <SelectTrigger className="border rounded px-2 py-1 w-full">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    {hours.map((hour) => (
      <SelectItem key={hour} value={hour}>
        {hour}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>


          {/* Total Budget Spend Percentage */}
          <div>
            <Input
              type="number"
              value={range.total_budget_spend_perc}
              onChange={(e: any) =>
                handleTimeRangeNumbers(e, index, 'total_budget_spend_perc')
              }
              placeholder="Spends %"
              className="w-full"
            />
          </div>

          {/* Adjustment */}
          {/* <div>
            <Input
              type="number"
              value={range.adjustment}
              onChange={(e: any) => handleTimeRangeNumbers(e, index, 'adjustment')}
              max={3}
              placeholder="Adjustment %"
              className="w-full"
            />
          </div> */}

          {/* Aggressive Spend Percentage */}
          {/* <div>
            <Input
              type="number"
              value={range.aggressive_spend_perc}
              onChange={(e: any) =>
                handleTimeRangeNumbers(e, index, 'aggressive_spend_perc')
              }
              placeholder="Aggressive %"
              className="w-full"
            />
          </div> */}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {tableData.length > 1 && (
              <Button
              size="icon"
              className="rounded-md px-2"
              onClick={() => removeItem(index)}
            >
              <CircleMinus />
            </Button>
            )}
            {index === tableData.length - 1 && (
               <Button
               size="icon"
               className="rounded-md px-2"
               onClick={addItem}
               title="Add another row"
             >
               <CirclePlus />
             </Button>
            )}
          </div>
        </div>
      ))}</div>
 </div>}

      </CardContent>
    </Card>
    </div>
  );
};

export default PacingConfig;






// "use client";

// import * as React from "react";
// import { Check, ChevronsUpDown } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// const frameworks = [
//   { value: "next.js", label: "Next.js" },
//   { value: "sveltekit", label: "SvelteKit" },
//   { value: "nuxt.js", label: "Nuxt.js" },
//   { value: "remix", label: "Remix" },
//   { value: "astro", label: "Astro" },
// ];

// export default function ComboboxDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

//   const toggleValue = (value: string) => {
//     setSelectedValues((prev) =>
//       prev.includes(value)
//         ? prev.filter((item) => item !== value)
//         : [...prev, value]
//     );
//   };
// console.log(selectedValues,"multiselect")
//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between flex-wrap text-left"
//         >
//           {selectedValues.length > 0 ? (
//             <div className="max-h-[75px] overflow-y-auto">
//               {selectedValues
//                 .map(
//                   (selectedValue) =>
//                     frameworks.find((framework) => framework.value === selectedValue)
//                       ?.label
//                 )
//                 .join(", ")}
//             </div>
//           ) : (
//             "Select frameworks..."
//           )}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder="Search framework..." />
//           <CommandList>
//             <CommandEmpty>No framework found.</CommandEmpty>
//             <CommandGroup>
//               {frameworks.map((framework) => (
//                 <CommandItem
//                   key={framework.value}
//                   value={framework.value}
//                   onSelect={() => toggleValue(framework.value)}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       selectedValues.includes(framework.value)
//                         ? "opacity-100"
//                         : "opacity-0"
//                     )}
//                   />
//                   {framework.label}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }
