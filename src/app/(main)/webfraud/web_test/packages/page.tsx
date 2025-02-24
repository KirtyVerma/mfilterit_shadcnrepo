"use client";
import React from "react";
import { PACKAGES } from "../DATA";
import { Button } from "@/components/ui/button";
import ItemTable from "./ItemTable";
import { useRouter } from "next/navigation";



export default function ListPackages() {
  const router = useRouter();

  
  const handleRowClick = (pkg: typeof PACKAGES[0]) => {
    console.log(pkg)
    router.push(`packages/${pkg.package_name}`);
  };
  

  return (
    <div className="py-2 px-8">
     
      <div className=" w-full px-3 py-2 bg-white rounded-xl mt-5">
        <ItemTable data={PACKAGES} onclick={handleRowClick}  />
      </div>
    </div>
  );
}
