"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Search } from "lucide-react";
import React, { useMemo, useReducer } from "react";
import { Filter, FilterPillPropType } from "./types";
import MFSpinner from "../MFSpinner";

interface FilterPillProps {
  id: string;
  title: string;
  filters: Array<{ label: string; checked: boolean }>;
  onSubmit: (id: string, data: FilterState) => void;
  onSearch: (id: string, query: string) => void;
  loading: boolean;
}

export function FilterPill({
  id,
  title,
  filters,
  onSubmit,
  onSearch,
  loading,
}: FilterPillProps) {
  const [state, Dispatch] = useFilterReducer(filters ?? []);
  const handleSubmit = () => {
    onSubmit(id, state);
  };
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const t = e.currentTarget.elements.namedItem("search") as HTMLInputElement;
    const s = t.value;
    onSearch(id, s);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-1 rounded-3xl border bg-card px-2 text-body text-card-foreground shadow-sm hover:opacity-75">
          <span>{title}</span>|
          <span className="text-body text-orange-500">
            {state.is_select_all ? "All" : state.selected_count}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <span className="flex items-center">
          <Checkbox
            title="Select All"
            onClick={() => {
              if (state.is_select_all) Dispatch(unSelectAll());
              else Dispatch(selectAll());
            }}
            checked={state.is_select_all}
          />
          <p className="ml-2 font-thin">{title}</p>
          <p className="ml-auto text-xs text-destructive">
            {state.selected_count}
          </p>
        </span>
        <form className="flex" onSubmit={handleSearch}>
          <Input
            className="rounded-br-none rounded-tr-none"
            sx="sm"
            type="text"
            name="search"
            placeholder="Search..."
          />
          <Button
            variant="default"
            size="icon-xs"
            className="rounded-bl-none rounded-tl-none"
          >
            <Search size={20} />
          </Button>
        </form>
        <hr className="my-1" />
        {!loading && (
          <>
            <div className="scrollbar flex max-h-72 flex-col gap-1 overflow-y-auto">
              {state.filters.map((v, i) => (
                <span key={i}>
                  <Checkbox
                    id={v.label + i}
                    checked={v.checked}
                    onClick={() => {
                      Dispatch(toggle(i));
                    }}
                  />{" "}
                  <Label htmlFor={v.label + i}>{v.label}</Label>
                </span>
              ))}
            </div>
          </>
        )}
        {loading && (
          <>
            <div className="grid h-32 place-items-center">
              <MFSpinner />
            </div>
          </>
        )}
        <hr className="my-1" />
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="mr-1 p-1"
            onClick={() => Dispatch(unSelectAll())}
          >
            Clear All
          </Button>
          <PopoverClose>
            <Button size="icon-xs" title="Apply" onClick={() => handleSubmit()}>
              <Check size={20} />
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// #################### Logic ####################
enum ActionType {
  TOGGLE = "TOGGLE",
  SELECT_ALL = "SELECT_ALL",
  UN_SELECT_ALL = "UN_SELECT_ALL",
}
export type FilterState = {
  is_select_all: boolean;
  selected_count: number;
  filters: Filter[];
};
type Action =
  | { type: ActionType.TOGGLE; payload: number }
  | { type: ActionType.SELECT_ALL }
  | { type: ActionType.UN_SELECT_ALL };

// Reducer Fn
function Reducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case ActionType.TOGGLE: {
      const f = state.filters.at(action.payload);
      let count = state.selected_count;
      if (!f) return state;
      if (f.checked) {
        f.checked = false;
        count--;
      } else {
        f.checked = true;
        count++;
      }
      const filters = [
        ...state.filters.slice(0, action.payload),
        f,
        ...state.filters.slice(action.payload + 1),
      ];
      return {
        ...state,
        is_select_all: count === filters.length,
        filters,
        selected_count: count,
      };
    }
    case ActionType.SELECT_ALL: {
      return {
        ...state,
        is_select_all: true,
        selected_count: state.filters.length,
        filters: state.filters.map((v) => ({ label: v.label, checked: true })),
      };
    }
    case ActionType.UN_SELECT_ALL: {
      return {
        ...state,
        is_select_all: false,
        selected_count: 0,
        filters: state.filters.map((v) => ({ label: v.label, checked: false })),
      };
    }
    default:
      return state;
  }
}
// Actions
function toggle(index: number): { type: ActionType.TOGGLE; payload: number } {
  return { type: ActionType.TOGGLE, payload: index };
}
function selectAll(): { type: ActionType.SELECT_ALL } {
  return { type: ActionType.SELECT_ALL };
}
function unSelectAll(): { type: ActionType.UN_SELECT_ALL } {
  return { type: ActionType.UN_SELECT_ALL };
}
//
function useFilterReducer(filters: Filter[]) {
  const F = useMemo(() => filters, [filters]);
  const count = F.filter((v) => v.checked).length;
  const init: FilterState = {
    filters: F,
    selected_count: count,
    is_select_all: F.length === count,
  };
  return useReducer(Reducer, init);
}
