import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import AddVastTracker from "./AddVast";
import Add1x1Tracker from "./Add1x1";

interface AddNonYTCampTrackerProps {
  default_page?: string;
}

const AddNonYTCampTracker: React.FC<AddNonYTCampTrackerProps> = ({ default_page = "vast" }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(default_page);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div id="VideoDashboardComponent" className=" max-w-7xl mx-auto">
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => handleTabChange("vast")}
            className={`
              group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center text-sm font-medium focus:z-10
              ${
                activeTab === "vast"
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              VAST
              {activeTab === "vast" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-100 transition-transform duration-200" />
              )}
            </span>
            <span
              className={`
                absolute inset-x-0 bottom-0 h-0.5
                ${
                  activeTab === "vast"
                    ? "bg-primary"
                    : "bg-transparent group-hover:bg-gray-300"
                }
                transition-colors duration-200
              `}
            />
          </button>
          <button
            onClick={() => handleTabChange("1x1")}
            className={`
              group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center text-sm font-medium focus:z-10
              ${
                activeTab === "1x1"
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              1x1 Trackers
              {activeTab === "1x1" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-100 transition-transform duration-200" />
              )}
            </span>
            <span
              className={`
                absolute inset-x-0 bottom-0 h-0.5
                ${
                  activeTab === "1x1"
                    ? "bg-primary"
                    : "bg-transparent group-hover:bg-gray-300"
                }
                transition-colors duration-200
              `}
            />
          </button>
        </nav>
      </div>

      <div className="mt-6">
        <div
          className={`transition-all duration-300 ${
            activeTab === "vast"
              ? "opacity-100 translate-y-0"
              : "opacity-0 hidden translate-y-4"
          }`}
        >
          <Card className="border-none">
            <AddVastTracker trackerType="vast_wrapper" />
          </Card>
        </div>
        <div
          className={`transition-all duration-300 ${
            activeTab === "1x1"
              ? "opacity-100 translate-y-0"
              : "opacity-0 hidden translate-y-4"
          }`}
        >
          <Card className="border-none">
            <Add1x1Tracker />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddNonYTCampTracker;





