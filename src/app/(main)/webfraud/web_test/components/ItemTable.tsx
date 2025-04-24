import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

type extraFields = {
  title: string;
  render: (item: any) => JSX.Element;
};
type Props = {
  data: Object[];
  selectable?: boolean;
  onclick?: (item: any) => any;
  extraFields?: extraFields[];
};

export default function ItemTable({
  data,
  onclick: onclick,
  selectable = true,
  extraFields,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const FieldNames = Object.keys(data[0]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      <Table className="mt-4 ">
        <TableHeader>
          <TableRow className="bg-gray-200 dark:text-white">
            {FieldNames.map((field) => (
              <TableHead
                key={field}
                className="capitalize text-center w-[200px] py-3 px-4 tex-left text-sm font-medium text-gray-600"
              >
                {field.replace("_"," ")}
              </TableHead>
            ))}
            {extraFields
              ? extraFields.map((field, i) => (
                  <TableHead
                    key={i}
                    className="capitalize text-center w-[200px] py-3 px-4 tex-left text-sm font-medium text-gray-600"
                  >
                    {field.title}
                  </TableHead>
                ))
              : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((items: any, i) => (
            <TableRow
              className={`${selectable && "cursor-pointer"}`}
              key={i}
              onClick={() => (onclick ? onclick(items) : null)}
            >
              {Object.keys(items).map((key) =>
                key === "status" ? (
                  <TableCell key={key} className="text-center capitalize">
                    {items[key]?<p className="text-green-500">active</p>:<p className="text-red-400">active</p>}
                  </TableCell>
                ) : (
                  <TableCell key={key} className="text-center">
                    {items[key]}
                  </TableCell>
                )
              )}

              {extraFields
                ? extraFields.map((field) => (
                    <TableCell
                      className=""
                      key={field.title}
                    >
                      {field.render(items)}
                    </TableCell>
                  ))
                : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 ? (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      ) : null}
    </>
  );
}
