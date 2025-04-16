"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: {
    [key: string]: {
      next?: string;
      action?: () => void;
      text: string;
    };
  };
}

interface QuestionnaireState {
  currentQuestionId: string;
  previousQuestionId: string | null;
  answers: Record<string, string>;
  isComplete: boolean;
}

const useQuestionnaire = () => {
  const router = useRouter();
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
          action: () => console.log("Redirect to hosting service"),
        },
      },
    },
    display_tracker_type: {
      id: "display_tracker_type",
      text: "What type of Tracker you want to make?",
      options: {
        standard: { text: "Standard Tracker" },
        native: { text: "Native Tracker" },
        ins: { text: "INS Tracker" },
      },
    },
    video_campaign_type: {
      id: "video_campaign_type",
      text: "What is Your Campaign Type",
      options: {
        youtube: {
          text: "YouTube Campaign",
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
          action: () =>
            console.log("Redirect to hosting service with variation"),
        },
      },
    },
    non_youtube_tracker_type: {
      id: "non_youtube_tracker_type",
      text: "What type of Tracker you want to make?",
      options: {
        vast: { text: "VAST Tracker" },
        "1x1": { text: "1x1 Tracker" },
      },
    },
  };

  const [state, setState] = useState<QuestionnaireState>({
    currentQuestionId: "advertisement_type",
    previousQuestionId: null,
    answers: {},
    isComplete: false,
  });

  useEffect(() => {
    // Initialize state
    setState(prev => ({
      ...prev,
      currentQuestionId: "advertisement_type",
      previousQuestionId: null,
      answers: {},
      isComplete: false,
    }));

    const handlePopState = () => {
      // When going back, we'll rely on our local state
      setState(prev => {
        if (!prev.previousQuestionId) return prev;
        
        return {
          ...prev,
          currentQuestionId: prev.previousQuestionId,
          previousQuestionId: Object.entries(questions).find(([_, q]) => 
            Object.values(q.options).some(opt => opt.next === prev.previousQuestionId)
          )?.[0] || null,
          isComplete: false,
        };
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const next = (optionKey: string) => {
    const currentQuestion = questions[state.currentQuestionId];
    const selectedOption = currentQuestion.options[optionKey];

    const newAnswers = {
      ...state.answers,
      [currentQuestion.id]: optionKey,
    };

    setState((prev) => ({
      ...prev,
      answers: newAnswers,
      previousQuestionId: prev.currentQuestionId,
      currentQuestionId: selectedOption.next || "",
      isComplete: !selectedOption.next,
    }));

    // Only push to history if we're not at the end
    if (selectedOption.next) {
      router.push("?step=" + selectedOption.next, { scroll: false });
    }

    if (selectedOption.action) {
      selectedOption.action();
    }
  };

  return {
    currentQuestion: questions[state.currentQuestionId],
    previousQuestion: state.previousQuestionId
      ? questions[state.previousQuestionId]
      : null,
    answers: state.answers,
    isComplete: state.isComplete,
    next,
    canGoBack: !!state.previousQuestionId,
  };
};

const CreateTracker = () => {
  const router = useRouter();
  const { currentQuestion, answers, isComplete, next, canGoBack } = useQuestionnaire();

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    }
  };

  return (
    <div className="relative py-2 px-8">
      <div className="px-8 py-5 bg-white dark:bg-gray-500 rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
          Create Trackers
        </h2>
      </div>

      <div className="flex flex-row py-2 gap-x-4 rounded-xl mt-3 w-full">
        <div className="w-2/6 bg-white p-4 rounded-md border-2 border-black border-dashed">
          {[...Array(3)].map((_g, i) => (
            <div key={i} className="capitalize mb-2">
              <p className="text-primary"> step {i + 1} </p>
              <p className="text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                laudantium totam aspernatur facere.
              </p>
            </div>
          ))}
        </div>
        <div
          id="changethis"
          className="w-full min-h-[70vh] flex justify-center py-16 bg-white rounded-md relative"
        >
          {canGoBack && (
            <Button
              onClick={handleBack}
              className="absolute left-4 top-4 text-primary"
              variant="ghost"
              size="icon"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex flex-col gap-y-20">
            {isComplete ? (
              <div className="text-center">
                <h2 className="text-4xl text-primary mb-4">
                  Questionnaire Complete!
                </h2>
                <p className="text-xl">
                  Thank you for completing the questionnaire.
                </p>
                <div className="mt-8 flex gap-x-4 items-center">
                  <Button onClick={handleBack} className="mr-4">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => console.log("Submit answers:", answers)}>
                    Submit
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="capitalize text-primary text-4xl text-center">
                  {currentQuestion.text}
                </h2>
                <div className="flex gap-x-6 items-center">
                  {Object.entries(currentQuestion.options).map(
                    ([key, option]) => (
                      <Button
                        key={key}
                        className="w-2/4 capitalize border-primary border-2 px-14 py-8 bg-white text-black hover:bg-primary hover:text-white max-w-md"
                        onClick={() => next(key)}
                      >
                        {option.text}
                      </Button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTracker;
