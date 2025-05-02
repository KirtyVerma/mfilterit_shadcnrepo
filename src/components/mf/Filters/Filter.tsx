"use client";

<<<<<<< HEAD
import React, { useReducer, useState, ReactNode, useEffect } from "react";
=======
import React, {
  useReducer,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
>>>>>>> d1452b7 (Initial commit)
import { FilterPill, FilterState } from "./FilterPill";
import { session } from "@/lib/utils";
import { onSubmit } from "./types";

interface FilterProps {
  report?: boolean;
  component?: ReactNode;
  filter: { [key in string]: FilterState };
  onChange: (d: State) => void;
<<<<<<< HEAD
=======
  isSearchable?: boolean;
  onSearch?: (id: string, query: string) => void;
  itemsPerPage?: number;
>>>>>>> d1452b7 (Initial commit)
}

export function Filter({
  report = false,
  component,
  filter,
  onChange,
<<<<<<< HEAD
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
=======
  isSearchable = false,
  onSearch,
  itemsPerPage = 5,
}: FilterProps) {
  const handleSubmit = useCallback((id: string, data: FilterState) => {
    const newState = {
      ...filter,
      [id]: {
        ...data,
        filters: data.filters.map(f => ({
          ...f,
          checked: f.checked ?? true
        }))
      }
    };
    
    console.log("Submitting filter change:", newState);
    onChange(newState);
    //console.log("📢 onChange triggered with:", newState);
  }, [filter, onChange]);

  useEffect(() => {
    //console.log("Filter received:", filter);
  }, [filter]);

  const loadingRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(filter ?? {}).map(([k, v]) => {
        const filterState: FilterState & { loading?: boolean } = v;

>>>>>>> d1452b7 (Initial commit)
        return (
          <FilterPill
            key={k}
            id={k}
            title={k}
<<<<<<< HEAD
            filters={filterState.filters}
            onSubmit={handleSubmit}
            onSearch={console.log}
            loading={filterState.loading ?? false}
          />
        );
      })}
      {/* ... rest of the component remains the same ... */}
    </>
=======
            filters={filterState.filters || []}
            onSubmit={handleSubmit}
            onSearch={onSearch}
            loading={filterState.loading ?? false}
            isSelectAll={filterState.is_select_all}
            totalItems={filterState.filters?.length || 0}
            itemsPerPage={itemsPerPage}
            isSearchable={true}
          />
        );
      })}
      <div ref={loadingRef} className="h-10" />
    </div>
>>>>>>> d1452b7 (Initial commit)
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
<<<<<<< HEAD
  // console.log("Filter Reducer:", action.type, action.payload);
=======
>>>>>>> d1452b7 (Initial commit)
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
