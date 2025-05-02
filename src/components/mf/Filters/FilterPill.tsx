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
<<<<<<< HEAD
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
=======
import React, { useEffect, useMemo, useReducer, useState, useRef, useCallback } from "react";
import MFSpinner from "../MFSpinner";

// #################### Types ####################
interface Filter {
  label: string;
  checked: boolean;
}

interface FilterPillProps {
  id: string;
  title: string;
  filters: Array<Filter>;
  onSubmit: (id: string, data: FilterState) => void;
  onSearch?: (id: string, query: string) => void;
  loading: boolean;
  isSearchable?: boolean;
}

>>>>>>> d1452b7 (Initial commit)
export type FilterState = {
  is_select_all: boolean;
  selected_count: number;
  filters: Filter[];
};
<<<<<<< HEAD
type Action =
  | { type: ActionType.TOGGLE; payload: number }
  | { type: ActionType.SELECT_ALL }
  | { type: ActionType.UN_SELECT_ALL };

// Reducer Fn
=======

enum ActionType {
  TOGGLE = "TOGGLE",
  SELECT_ALL = "SELECT_ALL",
  UN_SELECT_ALL = "UN_SELECT_ALL",
  SET_FILTERS = "SET_FILTERS",
}

type Action =
  | { type: ActionType.TOGGLE; payload: number }
  | { type: ActionType.SELECT_ALL }
  | { type: ActionType.UN_SELECT_ALL }
  | { type: ActionType.SET_FILTERS; payload: Filter[] };

// #################### Reducer ####################
>>>>>>> d1452b7 (Initial commit)
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
<<<<<<< HEAD
=======
    case ActionType.SET_FILTERS: {
      const newFilters = action.payload;
      const selectedCount = newFilters.filter((v) => v.checked).length;
      return {
        ...state,
        filters: newFilters,
        selected_count: selectedCount,
        is_select_all: newFilters.length === selectedCount,
      };
    }
>>>>>>> d1452b7 (Initial commit)
    default:
      return state;
  }
}
<<<<<<< HEAD
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
=======

// #################### Actions ####################
function toggle(index: number): { type: ActionType.TOGGLE; payload: number } {
  return { type: ActionType.TOGGLE, payload: index };
}

function selectAll(): { type: ActionType.SELECT_ALL } {
  return { type: ActionType.SELECT_ALL };
}

function unSelectAll(): { type: ActionType.UN_SELECT_ALL } {
  return { type: ActionType.UN_SELECT_ALL };
}

function setFilters(filters: Filter[]): { type: ActionType.SET_FILTERS; payload: Filter[] } {
  return { type: ActionType.SET_FILTERS, payload: filters };
}

// #################### Custom Hook ####################
>>>>>>> d1452b7 (Initial commit)
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
<<<<<<< HEAD
=======

// #################### Component ####################
export function FilterPill({ id, title, filters, onSubmit, onSearch = () => {}, loading, isSearchable = false }: FilterPillProps) {
  const [state, Dispatch] = useFilterReducer(filters ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState(500);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group filters by first letter
  const groupedFilters = useMemo(() => {
    const groups: { [key: string]: Filter[] } = {};
    state.filters.forEach(filter => {
      const firstLetter = filter.label.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(filter);
    });
    return groups;
  }, [state.filters]);

  // Alphabet index
  const alphabet = useMemo(() => {
    return Object.keys(groupedFilters).sort();
  }, [groupedFilters]);

  // Calculate total number of items
  const totalItems = useMemo(() => {
    return Object.values(groupedFilters).reduce((sum, items) => sum + items.length, 0);
  }, [groupedFilters]);

  // Check if there are more items to load
  const hasMoreItems = useMemo(() => {
    return visibleItems < totalItems;
  }, [visibleItems, totalItems]);

  // Handle scroll to detect when user reaches bottom
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current && !isLoadingMore && hasMoreItems) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // If scrolled to bottom (with a small threshold)
      if (scrollHeight - scrollTop - clientHeight < 50) {
        setIsLoadingMore(true);
        // Simulate loading delay
        setTimeout(() => {
          setVisibleItems(prev => prev + 500);
          setIsLoadingMore(false);
        }, 500);
      }
    }
  }, [isLoadingMore, hasMoreItems]);

  // Handle letter selection
  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    Dispatch(setFilters(filters));
  }, [filters, Dispatch]);

  const handleSubmit = () => {
    onSubmit(id, state);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSearchable) {
      const filteredFilters = searchQuery
        ? state.filters.filter((filter) => filter.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : filters;
      Dispatch(setFilters(filteredFilters));
      onSearch(id, searchQuery);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      Dispatch(setFilters(filters));
    }
  }, [searchQuery, filters]);

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-1 rounded-3xl border bg-card px-2 text-body text-card-foreground shadow-sm hover:opacity-75">
          <span>{title}</span>|{" "}
          <span className="text-body text-orange-500">{state.is_select_all ? "All" : state.selected_count}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="z-[200] w-[400px]">
        <span className="flex items-center">
          <Checkbox
            title="Select All"
            onClick={() => {
              if (state.is_select_all) Dispatch(unSelectAll());
              else Dispatch(selectAll());
            }}
            checked={state.is_select_all}
          />
          <p className="ml-2 font-thin text-small-font">{title}</p>
          <p className="ml-auto text-xs text-destructive text-small-font">{state.selected_count}</p>
        </span>
        
        {isSearchable && (
          <form className="flex mt-2" onSubmit={handleSearch}>
            <Input
              className="rounded-br-none rounded-tr-none text-small-font" 
            //  sx="sm"
              type="text"
              name="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="default"  size="icon-xs" className=" w-5 h-5 rounded-bl-none rounded-tl-none" type="submit">
              <Search size={10} />
            </Button>
          </form>
        )}
        
        <hr className="my-2" />
        
        {!loading && (
          <div className="relative flex h-[400px]">
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              onScroll={handleScroll}
            >
              {alphabet.map(letter => {
                // Calculate how many items to show for this letter
                const letterItems = groupedFilters[letter] || [];
                const totalItemsBeforeThisLetter = alphabet
                  .slice(0, alphabet.indexOf(letter))
                  .reduce((sum, l) => sum + (groupedFilters[l]?.length || 0), 0);
                
                const itemsToShow = Math.max(
                  0,
                  Math.min(
                    letterItems.length,
                    visibleItems - totalItemsBeforeThisLetter
                  )
                );
                
                if (itemsToShow <= 0) return null;
                
                return (
                  <div key={letter} id={`letter-${letter}`}>
                    <div className="sticky top-0 bg-background py-1 font-semibold">
                      {letter}
                    </div>
                    {letterItems.slice(0, itemsToShow).map((filter, index) => (
                      <span key={`${letter}-${index}`} className="flex items-center py-1">
                        <Checkbox
                          id={filter.label + index}
                          checked={filter.checked}
                          onClick={() => {
                            const filterIndex = state.filters.findIndex(f => f.label === filter.label);
                            if (filterIndex !== -1) {
                              Dispatch(toggle(filterIndex));
                            }
                          }}
                        />
                        <Label htmlFor={filter.label + index} className="ml-2">{filter.label}</Label>
                      </span>
                    ))}
                  </div>
                );
              })}
              
              {isLoadingMore && hasMoreItems && (
                <div className="flex justify-center py-4">
                  <MFSpinner />
                </div>
              )}
            </div>
            
            <div className="w-8 flex flex-col items-center py-2 border-l">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  className={`text-xs px-1 py-0.5 rounded ${
                    selectedLetter === letter ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                  onClick={() => handleLetterClick(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {loading && (
          <div className="grid h-32 place-items-center">
            <MFSpinner />
          </div>
        )}
        
        <hr className="my-2" />
        
        <div className="flex justify-between">
          <Button variant="ghost" className="mr-1 p-1 text-small-font" onClick={() => Dispatch(unSelectAll())}>
            Clear All
          </Button>
          <PopoverClose>
            <Button className="w-5 h-5" size="icon-xs" title="Apply" onClick={() => handleSubmit()}>
              <Check size={10} />
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}

>>>>>>> d1452b7 (Initial commit)
