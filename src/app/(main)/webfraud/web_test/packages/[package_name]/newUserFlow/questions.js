import AddMfDisplayTracker from "./forms/HostedDisplayTracker";
import AddNonYTCampTracker from "./forms/AddNonYTCampTracker";
import AddYoutubeTracker from "./forms/AddYoutubeTracker";
import AddVastTracker from "./forms/AddVast";
import AddDisplayTracker from "./forms/AddDisplay";
import CreateTracker from "./create_tracker/createTrackerOpt";

export const questions = {
  choose_ad_type: {
    id: "choose_ad_type",
    text: "Tracker Type",
    options: {
      display_adv: {
        text: "Display",
        next: "display_hosting_status",
      },
      video_adv: {
        text: "Video",
        next: "video_campaign_platform",
      },

      visit: {
        text: "Visit",
        render: () => <CreateTracker tracker_type="visit" />,
      },

      event: {
        text: "Event",
        render: () => <CreateTracker tracker_type="event" />,
      },
    },
  },
  display_hosting_status: {
    id: "display_hosting_status",
    text: "Is your creative hosted at DSP/SSP/Publisher?",
    options: {
      yes: {
        text: "Yes",
        next: "display_tracker_selection",
      },
      no: {
        text: "No, want to host with MFilterIt",
        render: () => (
          <AddDisplayTracker inputType="upload" />
          // <UploadCreative acceptType="image" handleNext={() => {}} />
        ),
        action: () => console.log("Redirect to hosting service"),
      },
    },
  },
  display_tracker_selection: {
    id: "display_tracker_selection",
    text: "What type of Tracker you want to make?",
    options: {
      standard: {
        text: "Standard Tracker",
        render: () => <AddMfDisplayTracker default_page="display_standard" />,
      },
      native: {
        text: "Native Tracker",
        render: () => <AddMfDisplayTracker default_page="display_native" />,
      },
      ins: {
        text: "INS Tracker",
        render: () => <AddMfDisplayTracker default_page="display_ins" />,
      },
    },
  },
  video_campaign_platform: {
    id: "video_campaign_platform",
    text: "What is Your Campaign Type",
    options: {
      youtube: {
        text: "YouTube Campaign",
        render: () => <AddYoutubeTracker />,
      },
      non_youtube: {
        text: "Non-YouTube Campaign",
        next: "video_hosting_status",
      },
    },
  },
  video_hosting_status: {
    id: "video_hosting_status",
    text: "Is your creative hosted at DSP/SSP/Publisher?",
    options: {
      yes: {
        text: "Yes",
        next: "video_tracker_selection",
      },
      no: {
        text: "No, want to host with MFilterIt",
        render: () => (
          <AddVastTracker inputType="upload" />
          // <UploadCreative acceptType="video" handleNext={() => {}} />
        ),
        action: () => console.log("Redirect to hosting service with variation"),
      },
    },
  },
  video_tracker_selection: {
    id: "video_tracker_selection",
    text: "What type of Tracker you want to make?",
    options: {
      vast: {
        text: "VAST Tracker",
        render: () => <AddNonYTCampTracker />,
      },
      "1x1": {
        text: "1x1 Tracker",
        render: () => <AddNonYTCampTracker default_page="1x1" />,
      },
    },
  },
};
