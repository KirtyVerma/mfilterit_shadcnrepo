import { Button } from "@/components/ui/button";
import React from "react";

const CreateTracker = () => {
  return (
    <div className="relative py-2 px-8">
      <div className="px-8 py-5 bg-white dark:bg-gray-500 rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
          create Trackers
        </h2>
      </div>

      <div className="flex flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <div className="w-2/6 bg-white p-4 rounded-md border-2 border-black border-dashed">
          {[...Array(3)].map((_g, i) => (
            <div className="capitalize mb-2">
              <p className="text-primary"> step {i + 1} </p>
              <p className="text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                laudantium totam aspernatur facere.
              </p>
            </div>
          ))}
        </div>
        <div id="changethis" className="w-full min-h-[70vh] flex justify-center py-16 bg-white rounded-md">
          <div className="w-3/5 flex flex-col gap-y-20">
            <h2 className="capitalize text-primary text-4xl text-center">advertisement type</h2>
            <div className="flex justify-between ">
              <Button className="capitalize border-primary border-2 px-14 py-8 bg-white text-black hover:bg-primary hover:text-white">display advertisement</Button>
              <Button className="capitalize border-primary border-2 px-14 py-8 bg-white text-black hover:bg-primary hover:text-white">video advertisement</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTracker;

// {
//   "advertisement_type": {
//       "display adv": {
//           "is your creative hosted at dsp/ssp/publisher": {
//               "yes": {
//                   "standard Tracker": "",
//                   "native tracker": "",
//                   "ins tracker": ""
//               },
//               "no want to host with mfilterit": "same1"
//           }
//       },
//       "video adv": {
//           "youtbe campaign": "",
//           "non youtube campaign": {
//               "yes": {
//                   "vast Tracker": "",
//                   "1x1 tracker": ""
//               },
//               "no want to host with mfilterit": "same1 with variation"
//           }
//       }
//   }
// }
