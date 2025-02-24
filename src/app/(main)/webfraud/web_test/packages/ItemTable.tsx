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
  const FieldNames = Object.keys(data[0]);
  return (
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
        {data.map((items, i) => (
          <TableRow
            className={`${selectable && "cursor-pointer"}`}
            key={i}
            onClick={() => (onclick ? onclick(items) : null)}
          >
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
  );
}
