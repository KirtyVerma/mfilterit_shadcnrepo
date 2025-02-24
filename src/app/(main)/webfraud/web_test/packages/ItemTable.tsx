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
  onclick?: (item: any) => any;
  extraFields?: extraFields[];
};

export default function ItemTable({
  data,
  onclick: onclick,
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
        <TableRow className="bg-gray-300">
          {FieldNames.map((field) => (
            <TableHead className="capitalize text-center w-[200px] py-3 px-4 tex-left text-sm font-medium text-gray-600">
              {field}
            </TableHead>
          ))}
          {extraFields
            ? extraFields.map((field) => (
                <TableHead className="capitalize text-center w-[200px] py-3 px-4 tex-left text-sm font-medium text-gray-600">
                  {field.title}
                </TableHead>
              ))
            : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentItems.map((items, i) => (
          <TableRow key={i} onClick={() => (onclick ? onclick(items) : null)}>
            {Object.values(items).map((values, i) => (
              <TableCell key={i} className="text-center">
                {values}
              </TableCell>
            ))}

            {extraFields
              ? extraFields.map((field) => (
                  <TableCell
                    className="flex justify-center gap-x-4"
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
    <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
    
  );
}
