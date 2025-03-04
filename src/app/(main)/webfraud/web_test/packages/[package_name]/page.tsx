"use client";
import React from "react";
import { TRACKER } from "../../DATA";
import { Button } from "@/components/ui/button";
import ItemTable from "../ItemTable";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGetPackage } from "../../api";
import Loader from "../../Loader";

export default function ListTrackers() {
  const packageName: any = useParams()?.package_name;
  const { data, isLoading } = useGetPackage(packageName);
  const nav = useRouter();
  const extrafields = [
    {
      title: "Actions",
      render: (item: any) => (
        <div className="flex gap-x-2">
          <Button
            onClick={() =>
              nav.push(`/webfraud/web_test/trackers/${item.TrackerID}`)
            }
            className="bg-white text-blue-500 hover:text-blue-600"
          >
            config
          </Button>
          <Button className="bg-white ml-5 text-red-500 hover:text-red-600">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  function renderHeader() {
    return (
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 capitalize">
          Package Trackers
        </h2>
        <div>
          <Link
            href={`${packageName}/analytics`}
            className="px-6 py-2 rounded-full capitalize text-white bg-purple-400 hover:bg-purple-600"
          >
            analytics
          </Link>
          <Link
            href={`${packageName}/create_tracker`}
            className="px-6 py-2 rounded-full capitalize text-white ml-9 bg-purple-400 hover:bg-purple-600"
          >
            create tracker
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="py-2 px-8">
      {renderHeader()}
      <div className=" w-full px-3 py-2 bg-white rounded-xl mt-5">
        {isLoading ? (
          <Loader />
        ) : data.length ? (
          <ItemTable data={data} selectable={false} extraFields={extrafields} />
        ) : (
          <p className="capitalize text-center"> No Trackers available</p>
        )}
      </div>
    </div>
  );
}
