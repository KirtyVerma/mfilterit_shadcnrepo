"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  MdEdit,
  MdDelete,
  MdVisibility,
  MdFileDownload,
  MdArrowDropDown,
  MdSearch,
  MdRefresh,
  MdArrowDownward,
  MdArrowUpward,
  MdPause,
  MdPlayArrow,
<<<<<<< HEAD
} from "react-icons/md";
=======
  MdDownload,
  MdUnfoldMore,
} from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { FaClone } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
>>>>>>> d1452b7 (Initial commit)
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
<<<<<<< HEAD
import Pagination from "../ui/pagination";
=======
import Pagination from "@/components/ui/pagination";
>>>>>>> d1452b7 (Initial commit)
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import ShadCN Select components
import { Loader2 } from "lucide-react"; // Add this import
<<<<<<< HEAD
import { Button } from "../ui/button";
=======
// import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon,RefreshCw } from "lucide-react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
>>>>>>> d1452b7 (Initial commit)

export type Column<T = void> =
  | { title: string; key: string }
  | { title: string; key: string; render: (data: T) => React.ReactNode };

interface ResizableTableProps<T> {
<<<<<<< HEAD
  columns: Column<T>[];
=======
  buttonTextName?: string;
  columns: Column<T>[];
  isbuttonText?: boolean;
>>>>>>> d1452b7 (Initial commit)
  data: T[];
  headerColor?: string;
  isEdit?: boolean;
  isDelete?: boolean;
<<<<<<< HEAD
  isView?: boolean;
  isDownload?: boolean;
  isPaginated?: boolean;
=======
  isClone?: boolean;
  isRefetch?: boolean;
  isSend?: boolean;
  isView?: boolean;
  isDownload?: boolean;
  onRefetch?: (params?: { startDate?: Date; endDate?: Date }) => void;
  isPaginated?: boolean;
  SearchTerm?: string;
  setSearchTerm: (term: string) => void;
>>>>>>> d1452b7 (Initial commit)
  isSearchable?: boolean;
  isSelectable?: boolean;
  isCount?: boolean;
  isLoading?: boolean; // Add this prop
<<<<<<< HEAD
  isFile?:boolean;
=======
  isFile?: boolean;
>>>>>>> d1452b7 (Initial commit)
  actionButton?: React.ReactNode | React.ReactNode[];
  onEdit?: (item: T) => void;
  onDownloadAll?: (item: T[]) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onDownload?: (item: T) => void;
  onRefresh?: () => void;
  onSelect?: (selectedItems: T[]) => void;
  itemCount?: (count: number) => void;
  isPause?: boolean;
  isPlay?: boolean;
  onPause?: (item: T) => void;
  onPlay?: (item: T) => void;
<<<<<<< HEAD
  height?: number; // New height prop
  isSearchDelete?:boolean;
  isSearchDownload?:boolean;
=======
  onClone?: (item: T) => void;
  onSend?: (item: T) => void;
  onGenerateReport?: () => void;
  height?: number;
  onPageChangeP?: (page: number) => void;
  onLimitChange?: (page: number) => void;
  pageNo?: any;
  totalPages?: number;
>>>>>>> d1452b7 (Initial commit)
}

const DropdownMenu: React.FC<{
  columns: Column<Record<string, string | number>>[];
  onToggle: (key: string) => void;
  visibleColumns: Column<Record<string, string | number>>[];
}> = ({ columns, onToggle, visibleColumns }) => {
<<<<<<< HEAD
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-56 items-center justify-between rounded border bg-card p-2 text-card-foreground">
          <span>Columns</span>
          <div className="ml-auto flex items-center space-x-2">
            {/* <div className="h-6 border-l-2 border-black" />  */}|
            <span className="ml-2 mt-1 text-sm text-primary">
=======
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-28 items-center  text-small-font justify-between rounded border bg-card p-2 text-card-foreground">
          <span>Columns</span>
          <div className="ml-auto flex items-center space-x-2">
            {/* <div className="h-6 border-l-2 border-black" />  */}|
            <span className="ml-2 mt-1 text-sm text-primary text-small-font">
>>>>>>> d1452b7 (Initial commit)
              {columns.length === visibleColumns.length
                ? "All"
                : visibleColumns.length}
            </span>
            <MdArrowDropDown className="ml-2" />
          </div>
        </button>
      </PopoverTrigger>
<<<<<<< HEAD
      <PopoverContent className="w-56">
        {columns.map((column) => (
          <div key={column.key} className="flex items-center px-4 py-2">
=======
      <PopoverContent className="w-40">
        {columns.map((column) => (
          <div key={column.key} className="flex items-center px-4 py-2 text-small-font">
>>>>>>> d1452b7 (Initial commit)
            <Checkbox
              checked={visibleColumns.some((col) => col.key === column.key)}
              onCheckedChange={() => onToggle(column.key)}
            />
            <span className="ml-2">{column.title}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

const ResizableTable: React.FC<
  ResizableTableProps<Record<string, string | number>>
> = ({
<<<<<<< HEAD
  columns,
  data,
  headerColor = "#ccc",
  isEdit = false,
  isDelete = false,
=======
  buttonTextName = "New Report",
  columns,
  data = [],
  headerColor = "#ccc",
  isEdit = false,
  isDelete = false,
  isClone = false,
  isRefetch = false,
  onRefetch,
  isSend = false,
>>>>>>> d1452b7 (Initial commit)
  isView = false,
  isPaginated = true,
  isDownload = false,
  isSearchable = false,
<<<<<<< HEAD
  isSelectable = false,
  isCount = false,
  isLoading = false, // Add this prop
  actionButton,
  onEdit,
  onDelete,
=======
  SearchTerm = "",
  setSearchTerm,
  isSelectable = false,
  isCount = false,
  isLoading = false,
  actionButton,
  onEdit,
  onDelete,
  isbuttonText = false,
>>>>>>> d1452b7 (Initial commit)
  onView,
  onDownload,
  onSelect,
  onDownloadAll,
  onRefresh,
  itemCount,
  isPause = false,
  isPlay = false,
  onPause,
  onPlay,
<<<<<<< HEAD
  isSearchDownload,
  height, // Accept the height prop
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<
    Record<string, string | number>[]
  >([]);
  const [isMounted, setIsMounted] = useState(false);
  const [visibleColumns, setVisibleColumns] =
    useState<Column<Record<string, string | number>>[]>(columns);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {},
  );
  const tableRef = useRef<HTMLTableElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerHeight, setContainerHeight] = useState<number>(0);


  useEffect(() => {
    setIsMounted(true);
    const initialWidths: { [key: string]: number } = {};
    columns.forEach((col) => {
      initialWidths[col.key] = 150;
    });
    setColumnWidths(initialWidths);
  }, [columns]);


  useEffect(() => {
    const calculateHeight = () => {
      if (!height) {
      const vh = window.innerHeight;
      const otherElementsHeight = 200;
      setContainerHeight(vh - otherElementsHeight);
      }else{
        setContainerHeight(height);
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => window.removeEventListener('resize', calculateHeight);
  }, [height]);

  const handleColumnToggle = (key: string) => {
    const newVisibleColumns = visibleColumns.some((col) => col.key === key)
      ? visibleColumns.filter((col) => col.key !== key)
      : [...visibleColumns, columns.find((col) => col.key === key)!];
    setVisibleColumns(newVisibleColumns);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter((item) => {
    return visibleColumns.some((column) =>
      String(item[column.key]).toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleCheckboxChange = (item: Record<string, string | number>) => {
    if (selectedItems.includes(item)) {
      const items = selectedItems.filter((i) => i !== item);
      setSelectedItems(items);
      if (onSelect) onSelect(items);
    } else {
      const items = [...selectedItems, item];
      setSelectedItems(items);
      if (onSelect) onSelect(items);
    }
  };
  // Column Resize Handlers
  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    const startX = e.clientX;
    const startWidth = columnWidths[key];

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + moveEvent.clientX - startX;
      setColumnWidths((prevWidths) => ({
        ...prevWidths,
        [key]: newWidth,
      }));
    }; 

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (typeof itemCount === "function") itemCount(selectedItems.length);
  }, [selectedItems.length]);

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap w-full items-center text-body space-x-2 rounded-lg border bg-card p-1.5">
        {isSearchable && (
          <div className="flex flex-grow items-center space-x-2 sm:w-full md:w-1/2 lg:w-1/2 p-2">
            <MdSearch className="text-xl text-card-foreground transition-colors duration-200 hover:text-primary" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card text-card-foreground outline-none "
            />
          </div>
        )}
        {/* Separator */}
        <div className="mx-2 h-6 sm:hidden md:block lg:block border-l" />
        <DropdownMenu
          columns={columns}
          onToggle={handleColumnToggle}
          visibleColumns={visibleColumns}
        />
        {actionButton && <div className="mx-2 h-6 sm:hidden md:block lg:block border-l" />}
        {actionButton}
        <div className="mx-2 h-6 sm:hidden md:block lg:block border-l" />
        {isCount && (
          <span
            title="Total Selected Rows"
            onClick={() =>
              typeof onDownloadAll === "function" ? onDownloadAll(data) : null
            }
            className="rounded-lg bg-purple-100 p-2 text-primary"
          >
            <span>{selectedItems.length}</span>
          </span>
        )}
        {/* Separator */}
        <div className="mx-2 h-6 sm:hidden md:block lg:block" />
        {isSearchDownload && (
          <MdFileDownload
            title="Table Data Download"
            className="cursor-pointer text-xl text-primary transition-colors duration-200 hover:text-gray-400"
          />
        )}
        {/* Separator */}

        {/* <div className="mx-2 h-6 border-l" />
        <Button variant="ghost" size="icon-xs" onClick={() => onRefresh()}>
          <MdRefresh
            title="Table Data Refresh"
            className="cursor-pointer text-xl text-primary transition-colors duration-200 hover:text-gray-400"
          />
        </Button> */}
        {/* Separator */}
         {/* New Action Buttons in the search row */}
      
        <div className="relative"></div>
      </div>

      <div 
        className="relative"
        style={{ 
          height: `${containerHeight}px`,
          overflowY: 'auto',
          overflowX: 'auto'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/5">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <Table ref={tableRef} className="min-w-full border ">
          <TableHeader className="sticky top-0 z-10 ">
            <TableRow>
              {isSelectable && (
                <TableHead
                  className="border-r "
                  style={{
                    width: "50px",
                    minWidth: "50px",
                    maxWidth: "50px",
                    backgroundColor: headerColor,
                  }}
                >
                  <Checkbox
                    onCheckedChange={(checked) => {
                      const allItems = checked ? filteredData : [];
                      setSelectedItems(allItems);
                      if (onSelect) {
                        onSelect(allItems);
                      }
                    }}
                  />
                </TableHead>
              )}
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className="relative border-r"
                  style={{
                    backgroundColor: headerColor,
                    color: "black",
                    width: `${columnWidths[column.key]}px`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <div className="flex items-center justify-center text-center text-body font-semibold">
                    <span
                      onClick={() => handleSort(column.key)}
                      className="cursor-pointer text-center"
                      style={{ width: "100%" }}
                    >
                      {column.title}
                      {sortConfig?.key === column.key &&
                        (sortConfig?.direction === "asc" ? (
                          <MdArrowUpward className="inline-block" />
                        ) : sortConfig?.direction === "desc" ? (
                          <MdArrowDownward className="inline-block" />
                        ) : null)}
                    </span>
                    <div
                      onMouseDown={(e) => handleMouseDown(e, column.key)}
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-gray-400 "
                      style={{ backgroundColor: "transparent" }}
                    />
                  </div>
                </TableHead>
              ))}

              {(isEdit || isDelete || isView || isDownload || isPause || isPlay) && (
                <TableHead
                  className="border-r text-center"
                  style={{
                    backgroundColor: headerColor,
                    color: "black",
                    width: `${columnWidths}px`,
                    whiteSpace: "nowrap",
                  }}
                >
                  Action
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={index}>
                {isSelectable && (
                  <TableCell
                    className="border-r "
                    style={{
                      width: "20px",
                      minWidth: "20px",
                      maxWidth: "20px",
                    }}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item)}
                      onCheckedChange={() => handleCheckboxChange(item)}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((column) => (
                  <TableCell key={column.key} className="border-r text-center dark:text-white text-small-font">
                    {"render" in column ? column.render(item) : item[column.key]}
                  </TableCell>
                ))}
                {(isEdit || isDelete || isView || isDownload || isPause || isPlay) && (
                  <TableCell className="border-r dark:text-white">
                    <div className="flex space-x-2">
                      {isEdit && (
                        <button
                          onClick={() => onEdit?.(item)}
                          className="text-primary hover:text-gray-500"
                        >
                          <MdEdit size={18} />
                        </button>
                      )}
                      {isDelete && (
                        <button
                          onClick={() => onDelete?.(item)}
                          className="text-primary hover:text-gray-500"
                        >
                          <MdDelete size={18} />
                        </button>
                      )}
                      {isView && (
                        <button
                          onClick={() => onView?.(item)}
                          className="text-primary hover:text-gray-500"
                        >
                          <MdVisibility size={18} />
                        </button>
                      )}
                      {isDownload && (
                        <button
                          onClick={() => onDownload?.(item)}
                          className="text-primary hover:text-gray-500"
                        >
                          <MdFileDownload size={18} />
                        </button>
                      )}
                      {isPause && (
                        <button
                          onClick={() => onPause?.(item)}
                          className="text-primary hover:text-gray-500"
                        >
                          <MdPause size={18} />
                        </button>
                      )}
                      {isPlay && (
                        <button
                          onClick={() => onPlay?.(item)}
                          className="text-primary hover:text-gray-500"
                        >
                          <MdPlayArrow size={18} />
                        </button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isPaginated && (
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center">
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[90px] outline-none focus:ring-0 dark:text-white">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent className="border-none outline-none focus:ring-0">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">50</SelectItem>
                <SelectItem value="40">200</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / itemsPerPage)}
            onPageChange={handlePageChange}
            showFirstLast={true}
          />
        </div>
      )}
    </div>
  );
};

export default ResizableTable;
=======
  onClone,
  onSend,
  onGenerateReport,
  onPageChangeP,
  onLimitChange,
  pageNo,    // Total number of records
  totalPages = 1,
  height, // Accept the height prop
}) => {
    const [selectedItems, setSelectedItems] = useState<
      Record<string, string | number>[]
    >([]);
    const [isMounted, setIsMounted] = useState(false);
    const [visibleColumns, setVisibleColumns] =
      useState<Column<Record<string, string | number>>[]>(columns);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
      {},
    );
    const tableRef = useRef<HTMLTableElement>(null);
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRefetchModalOpen, setIsRefetchModalOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const displayData = isLoading ? [] : data; // Clear data when loading

    const calculateInitialColumnWidth = (columns: Column[], containerWidth: number) => {
      const minWidth = 100; // Minimum width for each column
      const actionColumnWidth = 100; // Width for action column
      const selectColumnWidth = 50; // Width for select column
      
      // Calculate available width
      let availableWidth = containerWidth;
      if (isSelectable) availableWidth -= selectColumnWidth;
      if (isEdit || isDelete || isView || isDownload || isPause || isPlay || isRefetch || isSend || isClone) {
        availableWidth -= actionColumnWidth;
      }

      // Calculate width per column
      const widthPerColumn = Math.max(minWidth, availableWidth / columns.length);
      
      const initialWidths: { [key: string]: number } = {};
      columns.forEach((col) => {
        initialWidths[col.key] = widthPerColumn;
      });
      
      return initialWidths;
    };

    useEffect(() => {
      setIsMounted(true);
      const tableContainer = tableRef.current?.parentElement;
      const containerWidth = tableContainer?.clientWidth || 800; // Default width if container not found
      const initialWidths = calculateInitialColumnWidth(columns, containerWidth);
      setColumnWidths(initialWidths);
    }, [columns, tableRef, isSelectable, isEdit, isDelete, isView, isDownload, isPause, isPlay, isRefetch, isSend, isClone]);

    useEffect(() => {
      if (onPageChangeP) {
        onPageChangeP(currentPage); // page change handler
      }
    }, [currentPage]);

    useEffect(() => {
      if (onLimitChange) {
        onLimitChange(itemsPerPage); // limit change handler
      }
    }, [itemsPerPage]);

    useEffect(() => {
      const calculateHeight = () => {
        if (!height) {
          const vh = window.innerHeight;
          const otherElementsHeight = 200;
          setContainerHeight(vh - otherElementsHeight);
        } else {
          setContainerHeight(height);
        }
      };

      calculateHeight();
      window.addEventListener("resize", calculateHeight);

      return () => window.removeEventListener("resize", calculateHeight);
    }, [height]);

    const handleColumnToggle = (key: string) => {
      const newVisibleColumns = visibleColumns.some((col) => col.key === key)
        ? visibleColumns.filter((col) => col.key !== key)
        : [...visibleColumns, columns.find((col) => col.key === key)!];
      setVisibleColumns(newVisibleColumns);
    };

    const handleSort = (key: string) => {
      let direction: "asc" | "desc" = "asc";
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "asc"
      ) {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
      if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        return []; // Return an empty array to prevent the error
      }
      const sortableData = Array.isArray(data) ? [...data] : [];
      if (sortConfig !== null) {
        sortableData.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableData;
    }, [data, sortConfig]);

    const filteredData = React.useMemo(() => {
      if (!SearchTerm.trim()) return sortedData;
      
      return sortedData.filter((item) => {
        return visibleColumns.some((column) => {
          const cellValue = String(item[column.key] || '').toLowerCase();
          return cellValue.includes(SearchTerm.toLowerCase());
        });
      });
    }, [sortedData, visibleColumns, SearchTerm]);

    // const paginatedData = React.useMemo(() => {
    //    const startIndex = (currentPage - 1) * itemsPerPage;
    //    return filteredData.slice(startIndex, startIndex + itemsPerPage);
    //  }, [filteredData, currentPage, itemsPerPage]);
    // console.log(sortedData,filteredData,itemsPerPage,"1stchild")



    const handleCheckboxChange = (item: Record<string, string | number>) => {
      if (selectedItems.includes(item)) {
        const items = selectedItems.filter((i) => i !== item);
        setSelectedItems(items);
        if (onSelect) onSelect(items);
      } else {
        const items = [...selectedItems, item];
        setSelectedItems(items);
        if (onSelect) onSelect(items);
      }
    };

    // Column Resize Handlers
    const handleMouseDown = (e: React.MouseEvent, key: string) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = columnWidths[key];
      const minWidth = 100; // Minimum column width

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(minWidth, startWidth + moveEvent.clientX - startX);
        setColumnWidths((prevWidths) => ({
          ...prevWidths,
          [key]: newWidth,
        }));
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
      if (typeof itemCount === "function") itemCount(selectedItems.length);
    }, [selectedItems.length]);

    const handlePageChange = (newPage: number) => {
      //  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setCurrentPage(validPage);
      if (onPageChangeP) {
        onPageChangeP(validPage); // API call only on user change
      }
    };

    const handleRefetch = () => {
      if (startDate && endDate) {
        onRefetch?.({ startDate, endDate });
        setIsRefetchModalOpen(false);
      }
    };

    const downloadTableAsCSV = async () => {
      try {
        // Create a new instance of JSZip
        const zip = new JSZip();

        // Fetch the dummy.csv file
        const response = await fetch('/dummy.csv');
        const csvData = await response.blob();

        // Add the CSV to the zip file
        zip.file('dummy.csv', csvData);

        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: 'blob' });

        // Create a download link
        const link = document.createElement('a');
        const currentDate = format(new Date(), 'yyyyMMdd');
        const fileName = `web.mfilterit.cpv_${currentDate}.zip`;

        link.href = URL.createObjectURL(zipContent);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };

    if (!isMounted) return null;

    return (
      <div className="w-full">
        <div className="flex flex-wrap w-full items-center text-body space-x-2 rounded-lg border bg-card ">
          {isSearchable && (
            <div className="flex flex-grow items-center space-x-2 p-2 sm:w-full md:w-1/2 lg:w-1/2">
              <MdSearch className="text-xl text-card-foreground transition-colors duration-200 hover:text-primary" />
              <input
                type="text"
                placeholder="Search"
                value={SearchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-card text-card-foreground outline-none text-small-font"
              />
              <RefreshCw 
                className="cursor-pointer text-card-foreground hover:text-primary"
                onClick={() => {
                  setSearchTerm('');
                  // Remove the API call
                  // if (onRefresh) onRefresh();
                }}
              />
            </div>
          )}
          {/* Separator */}
          <div className="mx-2 h-6 border-l sm:hidden md:block lg:block" />
          <DropdownMenu
            columns={columns}
            onToggle={handleColumnToggle}
            visibleColumns={visibleColumns}
          />
          {/* {actionButton && (
          <div className="mx-2 h-6 border-l sm:hidden md:block lg:block" />
        )} */}
          {actionButton}
          {isCount && (
            <div>
              <div className="mx-2 h-6 border-l sm:hidden md:block lg:block" />

              <span
                title="Total Selected Rows"
                onClick={() =>
                  typeof onDownloadAll === "function" ? onDownloadAll(data) : null
                }
                className="rounded-lg bg-purple-100 p-2 text-primary"
              >
                <span>{selectedItems.length}</span>
              </span>
            </div>
          )}
          {/* Separator */}

          {/* */}
          {/* {isDownload &&(
          <MdFileDownload
            title="Table Data Download"
            className="cursor-pointer text-xl text-primary transition-colors duration-200 hover:text-gray-400"
            title="Download Table Data as CSV"
          >
            <MdFileDownload />
          </button>
        )} */}
          {/* Separator */}

          {/*  <div className="mx-2 h-6 border-l" /> */}
          {/* <Button variant="ghost" size="icon-xs" onClick={() => onRefresh()}>
          <MdRefresh
            title="Table Data lauds"
            className="cursor-pointer text-xl text-primary transition-colors duration-200 hover:text-gray-400"
          />
        </Button> */}
          {isDownload && (
            <div>
              <div className="mx-2 h-6 sm:hidden md:block lg:block" />
              <button
                onClick={downloadTableAsCSV}
                className="cursor-pointer text-xl text-primary transition-colors duration-200 hover:text-gray-400"
                title="Download Table Data as CSV"
              >
                <MdFileDownload />
              </button>
            </div>
          )}


          {isbuttonText && (<div>
            <div className="mx-2 h-6 border-l" />
            <Button
              variant="default"
              className="bg-primary text-white hover:bg-secondary"
              onClick={onGenerateReport}
            >
              {buttonTextName}
            </Button>
          </div>
          )}
        </div>



        <div
          className="relative"
          style={{
            height: `${containerHeight}px`,
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <Table ref={tableRef} className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-10">
              <TableRow>
                {isSelectable && (
                  <TableHead
                    className="border-r"
                    style={{
                      width: "50px",
                      minWidth: "50px",
                      maxWidth: "50px",
                      backgroundColor: headerColor,
                    }}
                  >
                    <Checkbox
                      onCheckedChange={(checked) => {
                        const allItems = checked ? filteredData : [];
                        setSelectedItems(allItems);
                        if (onSelect) {
                          onSelect(allItems);
                        }
                      }}
                    />
                  </TableHead>
                )}
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="relative border-r h-8"
                    style={{
                      backgroundColor: headerColor,
                      color: "black",
                      width: `${columnWidths[column.key]}px`,
                      minWidth: "10px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <div className="flex items-center justify-between px-2">
                      <div className="flex-1 overflow-hidden">
                        <span
                          className="block truncate text-small-font  font-bold "
                          title={column.title}
                        >
                          {column.title}
                        </span>
                      </div>
                      <div className="flex items-center ml-2">
                        <span
                          onClick={() => handleSort(column.key)}
                          className="cursor-pointer text-small-font"
                        >
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === "asc" ? (
                              <MdArrowUpward className="text-primary" />
                            ) : (
                              <MdArrowDownward className="text-primary" />
                            )
                          ) : (
                            <MdUnfoldMore className="text-gray-400" />
                          )}
                        </span>
                      </div>
                      <div
                        onMouseDown={(e) => handleMouseDown(e, column.key)}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-gray-400"
                      />
                    </div>
                  </TableHead>
                ))}
                {(isEdit || isDelete || isView || isDownload || isPause || isPlay || isRefetch || isSend || isClone) && (
                  <TableHead
                    className="border-r text-center text-small-font font-bold "
                    style={{
                      backgroundColor: headerColor,
                      color: "black",
                      width: "100px",
                      minWidth: "100px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Action
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="h-16">
                  <TableCell
                    colSpan={visibleColumns.length + (isSelectable ? 1 : 0) + ((isEdit || isDelete || isView || isDownload || isPause || isPlay) ? 1 : 0)}
                    className="h-32 text-center"
                  >
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (isSelectable ? 1 : 0) + ((isEdit || isDelete || isView || isDownload || isPause || isPlay) ? 1 : 0)}
                    className="h-32 text-center"
                  >
                    <div className="flex justify-center items-center h-full">
                      <span className="text-small-font">
                        {SearchTerm.trim() ? "No matching results found" : "No Data Found!"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow
                    key={index}
                    className="h-8" // Add height class
                  >
                    {isSelectable && (
                      <TableCell
                        className="border-r p-4" // Add padding
                        style={{
                          width: "20px",
                          minWidth: "20px",
                          maxWidth: "20px",
                          height: "24px", // Explicit height
                          lineHeight: "24px" // Match height for vertical centering
                        }}
                      >
                        <Checkbox
                          checked={selectedItems.includes(item)}
                          onCheckedChange={() => handleCheckboxChange(item)}
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={column.key}
                        className="border-r text-center dark:text-white text-small-font p-2" // Add padding
                        style={{
                          maxWidth: `${columnWidths[column.key]}px`,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={String(item[column.key])} // Add tooltip for truncated content
                      >
                        {"render" in column ? column.render(item) : item[column.key]}
                      </TableCell>
                    ))}
                    {(isEdit || isDelete || isView || isDownload || isPause || isPlay) && (
                      <TableCell
                        className="border-r dark:text-white p-2" // Add padding
                        style={{ height: "24px", lineHeight: "24px" }} // Explicit height
                      >
                        <div className="flex space-x-2 justify-center">
                          {isEdit && (
                            <button
                              onClick={() => onEdit?.(item)}
                              className="text-primary hover:text-gray-500"
                            >
                              <MdEdit size={18} />
                            </button>
                          )}
                          {isDelete && (
                            <button
                              onClick={() => onDelete?.(item)}
                              className="text-primary hover:text-gray-500"
                            >
                              <MdDelete size={18} />
                            </button>
                          )}
                          {isView && (
                            <button
                              onClick={() => onView?.(item)}
                              className="text-primary hover:text-gray-500"
                            >
                              <MdVisibility size={18} />
                            </button>
                          )}
                          {isDownload && (
                            <button
                              onClick={() => onDownload?.(item)}
                              className="text-primary hover:text-gray-500"
                            >
                              <MdFileDownload size={18} />
                            </button>
                          )}
                          {isPause && (
                            <button
                              onClick={() => onPause?.(item)}
                              className="text-primary hover:text-gray-500"
                            >
                              <MdPause size={18} />
                            </button>
                          )}
                          {isPlay && (
                            <button
                              onClick={() => onPlay?.(item)}
                              className="text-primary hover:text-gray-500"
                            >
                              <MdPlayArrow size={18} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {isPaginated && data.length > 0 && (
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center">
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}

              >
                <SelectTrigger className="w-[70px]  h-[30px] outline-none focus:ring-0  text-small-font dark:text-white">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent className="border-none outline-none focus:ring-0">
                  {/* <SelectItem value="5">5</SelectItem> */}
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showFirstLast={true}

            />
          </div>
        )}

        <Dialog open={isRefetchModalOpen} onOpenChange={setIsRefetchModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select Date Range</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleRefetch} disabled={!startDate || !endDate}>
                Refetch Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default ResizableTable;
>>>>>>> d1452b7 (Initial commit)
