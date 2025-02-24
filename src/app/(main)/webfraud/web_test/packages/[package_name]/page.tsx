"use client";
import React from "react";
import { tracker } from "../../DATA";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import ItemTable from "../ItemTable";
export default function ListTrackers() {
  const extrafields = [
    {
      title: "Actions",
      render: (item:any) => (
        <div className="flex gap-x-2">
          <Button className="bg-white text-blue-500 hover:text-blue-600">
            Edit
          </Button>
          <Button className="bg-white ml-5 text-red-500 hover:text-red-600">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  function handleClick(t) {
    console.log(t);
  }

  return (
    <div className="py-2 px-8">
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between">
        <h2 className="text-2xl font-medium text-gray-900 capitalize">
          Package Trackers
        </h2>
        <div>
          <Button className="px-6 py-2 rounded-full capitalize text-white bg-purple-400 hover:bg-purple-600">
            analytics
          </Button>
          <Button className="px-6 py-2 rounded-full capitalize text-white ml-9 bg-purple-400 hover:bg-purple-600">
            create tracker
          </Button>
        </div>
      </div>
      <div className=" w-full px-3 py-2 bg-white rounded-xl mt-5">
        <ItemTable data={tracker} onclick={handleClick} extraFields={extrafields} />
      </div>
    </div>
  );
}
