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
import { MFDateRangePicker } from "@/components/mf";
import { DatePickerWithRange } from "@/components/mf/dateexp";
import axios from "axios";
import { CircleMinus, CirclePlus, Loader2 } from "lucide-react";




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











const OOSConfig: React.FC = () => {
  // Dropdown filter states
  const SKUList = [
    { value: "core_competition", name: "Core Competition" },
    { value: "non_core_competition", name: "Non-Core Competition" },
    { value: "new_brands", name: "New Brands" },
  ];
  const [selectedCampaign, setSelectedCampaign] = useState('');
  
  const [budget,setBudget]= useState<number>()
  const [aggressiveSpend,setAggressiveSpend]= useState<number>()
  
  const [selectedStrategy, setSelectedStrategy] = useState<
    string | undefined
  >();
  const [selectedMetric, setSelectedMetric] = useState<string | undefined>();
  const [isWeekend, setIsWeekend] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: new Date(2022, 0, 20),
  });
//    const [tableData, setTableData] = useState([]);

  var username = "gui";
  var password = "gui_secret_password@mfilterit";
  // type Campaign = {
  //   value: string;
  //   name: string;
  // };
  const [stockDetails, setStockDetails] = useState<StockDetail[]>([]);
  const pincodeList = [
    { value: "560001", name: "Bangalore Central" },
    { value: "560078", name: "JP Nagar" },
  ];

  const [campaignList, setcampaignList] = useState([]);
  const [adGroupList, setAdGroupList] = useState([]);
  const [campaign, setCampaign] = useState("");
  const [adGroup, setAdGroup] = useState("");
  const [adloading, setAdLoading] = useState(false);
  const [selectedPincodes, setSelectedPincodes] = useState<string>(pincodeList[0].value);
  const [selectedProfile, setSelectedProfile] = useState<any>(SKUList[0].value);
  const [skuDetails, setSkuDetails] = useState<SKUData>(
    {
      core_competition: ["MSCGNJZG7T8TNERE", "LFHG73ZQAAYCJFYZ", "BWSGP34NZ6FJ6BHY"],
      // non_core_competition: ["FLREPZCZRYTAZMXY", "FLRETEFHASAYDGZ4", "FLRETEFHENWKNJQE"],
      // new_brands: ["FLREPZCZRYTAZMXY", "FLRETEFHASAYDGZ4"],
    
  });
  const [minOos, setMinOos] = useState("");
  const [maxOos, setMaxOos] = useState("");
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  interface StockDetail {
  title?: string;
  stock_status?: string;
}

interface SKUData {
  [key: string]: string[];
}








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
  },[])

  useEffect(()=>{
    getCampaign()
    _callAPI()
  },[])
  useEffect(()=>{
    setAdGroup("")
  getAdGroup()
  // setMaxOos("")
  // setMinOos("")
  },[selectedCampaign])

  useEffect(() => {
    handleGet()
  }, [adGroup]);

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
        adjustment: 0,
        aggressive_spend_perc: 0,
      },
    ]);
  };
  const handleDropdownChange = (value: string, index: number, field: string) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    setTableData(updatedData);
  };
  

  const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

console.log(selectedCampaign,"qq")
  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setSelectedDateRange(newDateRange);
    if (newDateRange?.from && newDateRange?.to) {
      console.log("Start Date:", newDateRange.from.toISOString());
      console.log("End Date:", newDateRange.to.toISOString());
    } else {
      console.log("Incomplete date range selected");
    }
  };
  
  const handlePincode = (value: string) => {
    setSelectedPincodes(value); // Directly use the selected value
  };

  const _handleProductCode = (event:any, index:any) => {
    const { value } = event.target;

    setSkuDetails((prevState:any) => {
      const newState = { ...prevState };
      const updatedProfile = [...newState[selectedProfile]];
      updatedProfile[index] = value;
      newState[selectedProfile] = updatedProfile;
      return newState;
    });
  };

  const _removeItem = (index:any) => {
    setSkuDetails((prevState) => {
      const newState = { ...prevState };
      newState[selectedProfile] = newState[selectedProfile].filter(
        (_, i) => i !== index
      );
      return newState;
    });
  };

  const _addItem = () => {
    let initialValue = "";

    setSkuDetails((prevState) => {
      const newState = { ...prevState };
      newState[selectedProfile] = [
        ...(newState[selectedProfile] || []),
        initialValue,
      ];

      return newState;
    });
  };



  const _callAPI = () => {
    setStockDetails([]);
    const productCodes = skuDetails[selectedProfile];
    const platform = "flipkart";

    // let _pinCity = selectedPincodes.join("-").split("-");
    let _pinCity = selectedPincodes.split("-");
    _pinCity.forEach((item, index, array) => {
      array[index] = item.trim();
    });

    let _pinCodes = _pinCity.filter((_, index) => index % 2);
    setAvailabilityLoading(true)
    axios
    .post(
      `https://ecomm-realtime-scraper-api.mfilterit.net/getdata`,
      { data: productCodes.map((code) => ({
        product_code: code,
        platform: platform,
        pincode: _pinCodes?.at(0) ?? "560078",
      })),
      
       },
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    .then((respo) => {
      
      if (respo.data.status === "OK") {
        setAvailabilityLoading(false)
        setStockDetails(respo.data?.data);
  //       toast.success("Data is submitted successfully");
  // setLoading(false)
      }else{
        // setLoading(false)
        // toast.error("Update failed");
        setAvailabilityLoading(false)
      }
    });

   
  };



  const getAdGroup=()=>{
    setAdGroup('')
    axios
    .post(
      `https://ecomm-ams-api.mfilterit.net/get_oos_adgroup_name`,
      { campaign_name: selectedCampaign },
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    .then((respo) => {
       console.log(respo.data,"adgroup");
      if (respo.data.status === "OK") {
        
       
        setAdGroupList(respo.data.data);
      }
    });
  }
  
  const getCampaign=()=>{
    axios
    .get(
      `https://ecomm-ams-api.mfilterit.net/get_oos_campaign_name`,
  
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    .then((r) => {
      if (r) {
        const emptyArr:any = [];
        // r.data.data.map((v:any) => {
        //   emptyArr.push({ value: v, name: v });
        // });
        
        setcampaignList(r.data.data);
  console.log(r,"canpaign")
      }
    });
  }
  
  const handleGet = () => {
    console.log({campaign,adGroup,maxOos,minOos},"mydata")
    if(adGroup?.length >0){
        // setMinLoading(true)
        setAdLoading(true)
        axios
        .post(
          `https://ecomm-ams-api.mfilterit.net/get_oos_configuration`,
          { 
            campaign_name:selectedCampaign,
    ad_group_name:adGroup,
    
           },
          {
            auth: {
              username: username,
              password: password,
            },
          }
        )
        .then((respo) => {
           console.log(respo.data.data?.max_threshold,"getdata");
          if (respo.data.status === "OK") {
            setAdLoading(false)
            // setMinLoading(false)
             setMaxOos(respo.data.data?.max_threshold)
             setMinOos(respo.data.data?.min_threshold)
          }
          else{
            // setMinLoading(false)
            setMaxOos('')
             setMinOos('')
             setAdLoading(false)
          }
        });
    }
      
    };
    const handleSubmit = () => {
      console.log({campaign,adGroup,maxOos,minOos},"mydata")
      if(selectedCampaign?.length >0 && adGroup?.length >0 && maxOos?.length >0 && minOos?.length >0){
          // setOosLoading(true)
          axios
          .post(
            `https://ecomm-ams-api.mfilterit.net/set_oos_configuration`,
            { 
              campaign_name:selectedCampaign,
      ad_group_name:adGroup,
      max_threshold:maxOos,
      min_threshold:minOos,
       oos_config_enabled:"yes"
             },
            {
              auth: {
                username: username,
                password: password,
              },
            }
          )
          .then((respo) => {
             console.log(respo.data,"adgroup");
            if (respo.data.status === "OK") {
              // toast.success("Data is submitted successfully");
              setSelectedCampaign("")
              setAdGroup("")
              setMaxOos("")
              setMinOos("")
        // setOosLoading(false)
            }else{
              // setOosLoading(false)
              // toast.error("Update failed");
            }
          });
        
      } else{
        // toast.error("Please fill all details");
      }
      };

  return (
    <div className="container relative bg-card p-4">
     {campaignList && <Card className="h-fit">
      <Card className="h-fit">
      <CardContent className="flex flex-col gap-2">
      <div className="flex justify-between items-center py-4">
    <h5 className="text-lg font-semibold ">OOS Config</h5>
    <Button
        type="button"
        size="sm"
        className="h-8 rounded-md"
        onClick={handleSubmit}
        // disabled={isLoading || !value || Number(value) < 0}
      >
        { "Save"}
      </Button>
  </div>
      {/* <CardContent className="flex flex-col gap-2"> */}
      <div className="grid gap-4 sm:grid-cols-4">
      {campaignList?.length > 0 && (
  <Select onValueChange={setSelectedCampaign} defaultValue={selectedCampaign}>
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
)}

  <Select
    onValueChange={setAdGroup}
    defaultValue={adGroup??''}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Ad Group" />
    </SelectTrigger>
    <SelectContent>
    {adGroupList?.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
    </SelectContent>
  </Select>
 {<Input
    placeholder="Min Availability threshold %"
    type="number"
    value={minOos}
    onChange={(e) => setMinOos(e.target.value)}
    className="w-full"
  />}
  {<Input
    placeholder="Max Availability threshold %"
    type="number"
    value={maxOos}
    onChange={(e) => setMaxOos(e.target.value)}
    className="w-full"
  />}
</div>
</CardContent>
</Card>
<Card className="h-fit mt-5">
<CardContent className="flex flex-col gap-2">
    <div className="">
  <div className="flex justify-between items-center py-4">
    <h5 className="text-lg font-semibold">Instant Availability</h5>
    <Button
        type="button"
        size="sm"
        className="h-8 rounded-md"
        onClick={_callAPI}
        // disabled={isLoading || !value || Number(value) < 0}
      >
        { "Check Availability"}
      </Button>
  </div>

  <div className="grid gap-2 sm:grid-cols-12">
    {/* Pincode Selection */}
    <div className="sm:col-span-3 ">
    <label className="block font-medium mb-1">Pincode</label>
      <Select onValueChange={handlePincode} value={selectedPincodes}>
        <SelectTrigger className="w-full p-2 border rounded text-sm">
          <SelectValue placeholder="Select Pincode" />
        </SelectTrigger>
        <SelectContent>
          {pincodeList.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              { `${item.name}-${item.value}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

   
<div className="sm:col-span-3">
  {skuDetails[selectedProfile]?.map((code, index) => (
    <div key={index} className="mb-4 grid grid-cols-4 gap-4 items-center">
    {/* Input Field with Label */}
    <div className="col-span-3">
      <label htmlFor={`product-code-${index}`} className="block font-medium mb-1">
      {`Product Code-${index}`}
      </label>
      <Input
        id={`product-code-${index}`}
        placeholder="Product Code"
        type="text"
        value={code}
        className="p-2 border rounded text-sm"
        onChange={(event) => _handleProductCode(event, index)}
      />
    </div>
    
    {/* Buttons Column */}
    <div className="flex space-x-2 mt-7">
      <Button
        size="icon"
        className="rounded-md px-2"
        onClick={() => _removeItem(index)}
      >
        <CircleMinus />
      </Button>
      {index === skuDetails[selectedProfile].length - 1 && (
        <Button
          size="icon"
          className="rounded-md px-2"
          onClick={_addItem}
          title="Add another row"
        >
          <CirclePlus />
        </Button>
      )}
    </div>
  </div>
  
    // <div key={index} className="mb-4 grid grid-cols-4 gap-4 items-center">
    //   {/* Input Field */}
      
    //   <Input
    //     placeholder="Product Code"
    //     type="text"
    //     value={code}
    //     className="col-span-3 p-2 border rounded text-sm"
    //     onChange={(event) => _handleProductCode(event, index)}
    //   />
      
    //   {/* Buttons Column */}
    //   <div className="flex space-x-2">
    //     <Button
    //       size="icon"
    //       className="rounded-md px-2"
    //       onClick={() => _removeItem(index)}
    //     >
    //       <CircleMinus />
    //     </Button>
    //     {index === skuDetails[selectedProfile].length - 1 && (
    //       <Button
    //         size="icon"
    //         className="rounded-md px-2"
    //         onClick={_addItem}
    //         title="Add another row"
    //       >
    //         <CirclePlus />
    //       </Button>
    //     )}
    //   </div>
    // </div>
  ))}
</div>

    {/* Stock Details */}
    <div className="sm:col-span-6 ml-10">
     {availabilityLoading?(<><div className="  ml-52">
            <Loader2 className="h-8 w-8 animate-spin text-primary " />
          </div></>) :(<>
      {stockDetails.map((item, index) => (
        <div key={index} className="grid grid-cols-6 gap-4 items-center mb-4">
          {/* Title Section */}
          <div className="col-span-3">
            <label className="block font-medium mb-1">Title</label>
            <Input
              type="text"
              value={item?.title || ""}
              className="w-full p-2 border rounded bg-gray-200 text-sm"
              readOnly
            />
          </div>

          {/* Availability Section */}
          <div className="col-span-3">
            <label className="block font-medium mb-1">Availability</label>
            <Input
              type="text"
              value={item?.stock_status || ""}
              className="w-full p-2 border rounded bg-gray-200 text-sm"
              readOnly
            />
          </div>
        </div>
      ))}</>)}
    </div>
  </div>
</div>

      </CardContent>
      </Card>
    </Card>}
    </div>
  );
};

export default OOSConfig;
