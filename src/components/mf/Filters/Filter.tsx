"use client";

import React, { useReducer, useState, ReactNode, useEffect } from "react";
import { FilterPill, FilterState } from "./FilterPill";
import { session } from "@/lib/utils";
import { onSubmit } from "./types";

interface FilterProps {
  report?: boolean;
  component?: ReactNode;
  filter: { [key in string]: FilterState };
  onChange: (d: State) => void;
}

export function Filter({
  report = false,
  component,
  filter,
  onChange,
}: FilterProps) {
  const [state, Dispatch] = useFilterReducer(filter);

  // console.log("Filter Props:", filter);
  // console.log("Filter State:", state);

  const handleSubmit: onSubmit = (id, data) => {
    // console.log("Filter Submit:", id, data);
    Dispatch(Set(id, data));
  };

  useEffect(() => {
    Object.entries(filter).forEach(([key, value]) => {
      if (value.filters.length > 0) {
        handleSubmit(key, value);
      }
    });
  }, [filter]);

  useEffect(() => {
    onChange(state);
  }, [onChange, state]);

  return (
    <>
      {Object.entries(state ?? {}).map(([k, v]) => {
        const filterState: FilterState & { loading?: boolean } = v;
        return (
          <FilterPill
            key={k}
            id={k}
            title={k}
            filters={filterState.filters}
            onSubmit={handleSubmit}
            onSearch={console.log}
            loading={filterState.loading ?? false}
          />
        );
      })}
      {/* ... rest of the component remains the same ... */}
    </>
  );
}

// #################### Logic ####################

enum ActionType {
  SET = "SET",
  GET = "GET",
}

type State = {
  [key in string]: FilterState;
};

type Action = {
  type: ActionType;
  payload?: Record<string, FilterState>;
};

// Actions
function Set(id: string, p: FilterState): Action {
  return { type: ActionType.SET, payload: { [id]: p } };
}

function Reducer(state: State, action: Action): State {
  // console.log("Filter Reducer:", action.type, action.payload);
  switch (action.type) {
    case ActionType.SET: {
      if (!action.payload) return state;
      const s = { ...state, ...action.payload };
      session.set("filter", s);
      return s;
    }
    case ActionType.GET: {
      return state;
    }
    default:
      return state;
  }
}

function useFilterReducer(filter: { [key in string]: FilterState }) {
  return useReducer(Reducer, filter);
}
