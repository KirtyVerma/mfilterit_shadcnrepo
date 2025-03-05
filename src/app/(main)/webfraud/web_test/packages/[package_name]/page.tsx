"use client";
import React from "react";
import { TRACKER } from "../../DATA";
import { Button } from "@/components/ui/button";
import ItemTable from "../ItemTable";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDeleteTracker, useGetTrackers } from "../../api";
import Loader from "../../Loader";

function ActionButton({ packageName, trackerId,cb }: any) {
  const nav = useRouter();
  const { mutate: deleteTracker, data, isLoading} = useDeleteTracker(cb);
  function onDelete() {
    deleteTracker({ packageName, trackerId });
  }
  return (
    <div className="flex gap-x-2">
      <Button
        onClick={() => nav.push(`/webfraud/web_test/trackers/${trackerId}`)}
        className="bg-white dark:bg-gray-400 dark:text-white text-blue-500 hover:text-blue-600"
      >
        config
      </Button>
     
        <Button
          className="bg-white dark:bg-gray-400 dark:text-white ml-5 text-red-500 hover:text-red-600"
          onClick={onDelete}
        >
          Delete {isLoading?<Loader className="!h-4 !w-4 ml-3"/>:null}
        </Button>

    </div>
  );
}
export default function ListTrackers() {
  const packageName: any = useParams()?.package_name;
  const { data, isLoading ,refetch } = useGetTrackers(packageName);
  const extrafields = [
    {
      title: "Actions",
      render: (item: any) => (
        <ActionButton trackerId={item.tracker_id} packageName={packageName} cb={refetch}/>
      ),
    },
  ];

  function renderHeader() {
    return (
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between dark:bg-gray-500 ">
        <h2 className="text-xl font-medium text-gray-900 capitalize dark:text-white">
          Package Trackers
        </h2>
        <div>
          <Link
            href={`${packageName}/analytics`}
            className="px-6 py-2 rounded-full capitalize text-white bg-purple-400 dark:bg-gray-400 hover:bg-purple-600"
          >
            analytics
          </Link>
          <Link
            href={`${packageName}/create_tracker`}
            className="px-6 py-2 rounded-full capitalize text-white ml-9 bg-purple-400 dark:bg-gray-400 hover:bg-purple-600"
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
      <div className=" w-full px-3 py-2 bg-white dark:bg-gray-300 rounded-xl mt-5">
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
