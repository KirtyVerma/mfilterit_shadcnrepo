"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AddMfDisplayTracker from "./forms/HostedDisplayTracker";
import UploadCreative from "./forms/uploadyoutbe";
import AddNonYTCampTracker from "./forms/AddNonYTCampTracker";
import AddYoutubeTracker from "./forms/AddYoutubeTracker";


interface Question {
  id: string;
  text: string;
  options: {
    [key: string]: {
      next?: string;
      action?: () => void;
      text: string;
      render?: () => JSX.Element;
    };
  };
}

interface QuestionnaireState {
  answers: Record<string, string>;
}

const STEPS = [
  {
    title: "Advertisement type selection",
    text: "Trackes can be created based on the type of Advertisement.",
  },
  {
    title: "Basic Configuration",
    text: "Configure basic details in order to create a tracker.",
  },
  {
    title: "Tracker Creation",
    text: "Create a tracker by entering detailed information about your tracker.",
  },
];

const useQuestionnaire = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step");
  const currentOption = searchParams.get("option");
  const questions: Record<string, Question> = {
    advertisement_type: {
      id: "advertisement_type",
      text: "Advertisement Type",
      options: {
        display_adv: {
          text: "Display Advertisement",
          next: "display_creative_hosted",
        },
        video_adv: {
          text: "Video Advertisement",
          next: "video_campaign_type",
        },
      },
    },
    display_creative_hosted: {
      id: "display_creative_hosted",
      text: "Is your creative hosted at DSP/SSP/Publisher?",
      options: {
        yes: {
          text: "Yes",
          next: "display_tracker_type",
        },
        no: {
          text: "No, want to host with MFilterIt",
          render: () => (
            <UploadCreative acceptType="image" handleNext={() => {}} />
          ),
          action: () => console.log("Redirect to hosting service"),
        },
      },
    },
    display_tracker_type: {
      id: "display_tracker_type",
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
    video_campaign_type: {
      id: "video_campaign_type",
      text: "What is Your Campaign Type",
      options: {
        youtube: {
          text: "YouTube Campaign",
          render: () => <AddYoutubeTracker/>,
        },
        non_youtube: {
          text: "Non-YouTube Campaign",
          next: "non_youtube_hosted",
        },
      },
    },
    non_youtube_hosted: {
      id: "non_youtube_hosted",
      text: "Is your creative hosted at DSP/SSP/Publisher?",
      options: {
        yes: {
          text: "Yes",
          next: "non_youtube_tracker_type",
        },
        no: {
          text: "No, want to host with MFilterIt",
          render: () => (
            <UploadCreative acceptType="video" handleNext={() => {}} />
          ),
          action: () =>
            console.log("Redirect to hosting service with variation"),
        },
      },
    },
    non_youtube_tracker_type: {
      id: "non_youtube_tracker_type",
      text: "What type of Tracker you want to make?",
      options: {
        vast: { text: "VAST Tracker", render: () => <AddNonYTCampTracker /> },
        "1x1": {
          text: "1x1 Tracker",
          render: () => <AddNonYTCampTracker default_page="1x1" />,
        },
      },
    },
  };

  const [state, setState] = useState<QuestionnaireState>(() => ({
    answers: {},
  }));

  const currentQuestion = currentStep
    ? questions[currentStep]
    : questions["advertisement_type"];
  const isComplete = !!currentOption;

  const next = (optionKey: string) => {
    const selectedOption = currentQuestion.options[optionKey];

    const newAnswers = {
      ...state.answers,
      [currentQuestion.id]: optionKey,
    };

    setState((prev) => ({
      ...prev,
      answers: newAnswers,
    }));

    if (selectedOption.next) {
      router.push(`?step=${selectedOption.next}&prev=${currentStep}`, {
        scroll: false,
      });
    } else if (selectedOption.render) {
      router.push(
        `?step=${currentQuestion.id}&option=${optionKey}&prev=${currentStep}`,
        {
          scroll: false,
        }
      );
    }

    if (selectedOption.action) {
      selectedOption.action();
    }
  };

  const renderForm = () => {
    if (!currentStep || !currentOption) return null;
    const question = questions[currentStep];
    if (!question) return null;
    const option = question.options[currentOption];
    if (!option || !option.render) return null;
    return option.render();
  };

  return {
    currentQuestion,
    isComplete,
    next,
    renderForm,
    selectedOption: currentOption,
  };
};

const CreateTracker = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const Step = searchParams.get("step");
  const option = searchParams.get("option");
  const canGoBack = Step;
  const currentStep = (i: number) => {
    if (!Step) return i === 0;
    if (
      [
        "display_creative_hosted",
        "display_tracker_type",
        "video_campaign_type",
        "non_youtube_hosted",
        "non_youtube_tracker_type",
      ].includes(Step) &&
      !option
    )
      return i === 1;
    if (option) return i === 2;
  };

  const { currentQuestion, isComplete, next, renderForm } = useQuestionnaire();

  return (
    <div className="relative py-2 px-8">
      <div className="px-8 py-5 bg-white dark:bg-gray-500 rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
          Create Trackers
        </h2>
      </div>

      <div className="flex flex-row py-2 gap-x-4 rounded-xl mt-3 w-full">
        <div
          id="render_steps"
          className="sticky p-1 top-0 w-2/6 min-h-[70vh] bg-white rounded-md border-2 border-primary border-dashed"
        >
          {STEPS.map((_g, i) => (
            <div
              key={i}
              className={`capitalize p-3 rounded-lg ${currentStep(i) ? "bg-green-100/40" : ""}`}
            >
              <p className={`text-gray-500 ${currentStep(i) ? "text-primary" : ""}`}> Step {i + 1}:</p>
              <p
                className={`text-gray-400 font-medium ${currentStep(i) ? "text-green-600" : ""}`}
              >
                {_g.title}
              </p>
              {currentStep(i) && (
                <p className="font-normal text-green-500">{_g.text}</p>
              )}
            </div>
          ))}
        </div>
        <div
          id="changethis"
          className="w-full flex flex-col  p-1 bg-white rounded-md relative"
        >
          {canGoBack && (
            <div className="absolute top-0px-8 py-2">
              <Button
                onClick={() => router.back()}
                className="text-primary w-fit px-3 "
                variant="ghost"
                size="icon"
              >
                <span className="flex   items-center gap-x-2">
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </span>
              </Button>
            </div>
          )}
          <div className="mt-14 flex flex-col gap-y-20">
            {isComplete ? (
              <div id="render_option_form" className="">
                {renderForm() || (
                  <div className="text-center text-primary">
                    No render specified
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 flex flex-col space-y-11">
                <h2 className="capitalize text-primary text-4xl text-center">
                  {currentQuestion.text}
                </h2>
                <div className="flex gap-x-8 items-center justify-center">
                  {Object.entries(currentQuestion.options).map(
                    ([key, option]) => (
                      <Button
                        key={key}
                        className="w-3/12 capitalize border-primary border-2 px-14 py-8 bg-white text-black hover:bg-primary hover:text-white max-w-md"
                        onClick={() => next(key)}
                      >
                        {option.text}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTracker;
