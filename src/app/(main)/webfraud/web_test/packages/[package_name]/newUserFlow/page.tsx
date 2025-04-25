"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { questions } from "./questions";

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

const useQuestionnaire = (questions: Record<string, Question>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step");
  const currentOption = searchParams.get("option");

  const [state, setState] = useState<QuestionnaireState>(() => ({
    answers: {},
  }));

  const currentQuestion = currentStep
    ? questions[currentStep] || questions["choose_ad_type"]
    : questions["choose_ad_type"];
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
      router.push(`?step=${selectedOption.next}`, {
        scroll: false,
      });
    } else if (selectedOption.render) {
      router.push(`?step=${currentQuestion.id}&option=${optionKey}`, {
        scroll: false,
      });
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
        "display_hosting_status",
        "display_tracker_selection",
        "video_campaign_platform",
        "video_hosting_status",
        "video_tracker_selection",
      ].includes(Step) &&
      !option
    )
      return i === 1;
    if (option) return i === 2;
  };

  const { currentQuestion, isComplete, next, renderForm } =
    useQuestionnaire(questions);

  return (
    <div className="relative py-2 px-8">
      <div className="flex flex-row py-2 gap-x-4 rounded-xl w-full">
        <div
          id="render_steps"
          className="p-2 sticky top-0 h-[85vh] w-1/4 bg-white rounded-md border-2 border-primary border-dashed overflow-y-auto"
        >
          {STEPS.map((_g, i) => (
            <div
              key={i}
              className={`capitalize p-3 rounded-lg ${currentStep(i) ? "bg-purple-100/40" : ""}`}
            >
              <p
                className={`text-gray-500 ${currentStep(i) ? "text-primary" : ""}`}
              >
                {" "}
                Step {i + 1}:
              </p>
              <p
                className={`text-gray-400 font-medium ${currentStep(i) ? "text-primary" : ""}`}
              >
                {_g.title}
              </p>
              {currentStep(i) && (
                <p className="font-normal text-primary">{_g.text}</p>
              )}
            </div>
          ))}
        </div>
        <div
          id="changethis"
          className="w-full flex flex-col p-1 bg-white rounded-md relative overflow-y-auto"
        >
          <div className="h-14 px-3 bg-white py-2">
            {canGoBack && (
              <Button
                onClick={() => router.back()}
                className="text-primary w-fit px-3"
                variant="ghost"
                size="icon"
              >
                <span className="flex items-center gap-x-2">
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </span>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-y-20 px-3 pb-3">
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
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  {Object.entries(currentQuestion.options).map(
                    ([key, option]) => (
                      <Button
                        key={key}
                        className="w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1rem)] capitalize border-primary border-2 px-14 py-8 bg-white text-black hover:bg-primary hover:text-white max-w-md"
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
