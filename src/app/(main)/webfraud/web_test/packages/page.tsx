"use client";
import React from "react";
import { PACKAGES } from "../DATA";
import { Button } from "@/components/ui/button";
import ItemTable from "./ItemTable";
import { useRouter } from "next/navigation";
import { useGetPackages } from "../api";
import Loader from "../Loader";

export default function ListPackages() {
  const router = useRouter();
  const { data, isLoading } = useGetPackages();
  const handleRowClick = (pkg: (typeof PACKAGES)[0]) => {
    console.log(pkg);
    router.push(`packages/${pkg.package_name}`);
  };

  return (
    <div className="py-2 px-8">
      <div className="px-8 py-5 bg-white  rounded-xl flex items-center justify-between dark:bg-gray-500 ">
        <h2 className="text-xl font-medium text-gray-900 capitalize dark:text-white">
          Packages
        </h2>
      </div>
      <div className="w-full px-3 py-2 bg-white dark:bg-gray-300 rounded-xl mt-5">
        {isLoading ? (
          <Loader />
        ) : data.length ? (
          <ItemTable data={data} onclick={handleRowClick} />
        ) : (
          <p className="capitalize text-center"> No Package available</p>
        )}
      </div>
    </div>
  );
}
