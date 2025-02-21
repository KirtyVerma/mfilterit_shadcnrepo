"use client";
import { MFSingleSelect } from "@/components/mf";
import ResizableTable from "@/components/mf/TableComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, CircleMinus } from "lucide-react";
import React, { useState } from "react";

const columns = [
  { title: "Configuration Name", key: "config_name" }, // Date column as the first column
  { title: "Publisher", key: "publisher" },
  { title: "Agency", key: "agency" },
  { title: "Frequency", key: "frequency" },
  { title: "Variation", key: "variation" },
];

const data = [
  {
    config_name: "config_000001",
    publisher: "Publisher A",
    agency: "Agency W",
    frequency: "MTD",
    variation: "v7",
  },
  {
    config_name: "config_000002",
    publisher: "Publisher D",
    agency: "Agency Y",
    frequency: "MTD",
    variation: "v5",
  },
  {
    config_name: "config_000003",
    publisher: "Publisher D",
    agency: "Agency X",
    frequency: "Daily",
    variation: "v8",
  },
  {
    config_name: "config_000004",
    publisher: "Publisher E",
    agency: "Agency Y",
    frequency: "MTD",
    variation: "v7",
  },
  {
    config_name: "config_000005",
    publisher: "Publisher E",
    agency: "Agency Z",
    frequency: "MTD",
    variation: "v4",
  },
  {
    config_name: "config_000006",
    publisher: "Publisher C",
    agency: "Agency Y",
    frequency: "MTD",
    variation: "v4",
  },
  {
    config_name: "config_000007",
    publisher: "Publisher A",
    agency: "Agency X",
    frequency: "Weekly",
    variation: "v4",
  },
  {
    config_name: "config_000008",
    publisher: "Publisher B",
    agency: "Agency W",
    frequency: "Weekly",
    variation: "v7",
  },
  {
    config_name: "config_000009",
    publisher: "Publisher B",
    agency: "Agency X",
    frequency: "Daily",
    variation: "v8",
  },
  {
    config_name: "config_000010",
    publisher: "Publisher D",
    agency: "Agency Z",
    frequency: "MTD",
    variation: "v5",
  },
];
export default function PublisherConfig() {
  return (
    <div className="flex flex-col gap-2">
      <div className="">
        <ResizableTable
          columns={columns}
          data={data}
          isSelectable
          isSearchable
          actionButton={[<ConfigForm key={1} />]}
        />
      </div>
    </div>
  );
}

function ConfigForm() {
  const [Send, setSend] = useState("email");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit">Add Configuration</Button>
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-[600px] md:max-w-[740px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Publisher configuration</DialogTitle>
          <DialogDescription>Add new configuration</DialogDescription>
        </DialogHeader>
        <div className="scrollbar max-h-96 overflow-y-auto pr-2">
          <form
            action=""
            onClick={(e) => e.preventDefault()}
            className="grid gap-2 pb-4 md:grid-cols-3"
          >
            <Card className="shadow-lg md:col-span-2">
              <CardContent className="grid gap-2 p-2 md:grid-cols-2 lg:grid-cols-2">
                <Input placeholder="Configuration Name" />
                <MFSingleSelect
                  items={[
                    { title: "Daily", value: "Daily" },
                    { title: "Weekly", value: "Weekly" },
                    { title: "Monthly", value: "Monthly" },
                    { title: "MTD", value: "MTD" },
                  ]}
                  placeholder="Select Frequency"
                  title="Frequency"
                  className="w-full"
                />
                <MFSingleSelect
                  items={Array.from({ length: 6 }).map((v, i) => ({
                    title: "v" + i,
                    value: "v" + i,
                  }))}
                  placeholder="Select Variation"
                  title="Variation"
                  className="w-full"
                />
                <RadioGroup value={Send} className="h-10 md:col-span-2">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem
                      value="email"
                      id="email"
                      onClick={() => setSend("email")}
                    />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="s3"
                      id="s3"
                      onClick={() => setSend("s3")}
                    />
                    <Label htmlFor="s3">AWS S3</Label>
                  </div>
                </RadioGroup>
                {Send === "email" && <EmailForm />}
                {Send === "s3" && <S3Form />}
              </CardContent>
            </Card>
            <PublisherForm />
          </form>
        </div>
        <DialogFooter>
          <Button type="reset" className="rounded-full">
            Clear
          </Button>
          <Button type="submit" className="rounded-full">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PublisherForm() {
  const options = [
    { value: "Google", label: "Google" },
    { value: "Facebook", label: "Facebook" },
  ];
  return (
    <Card className="shadow-lg">
      <CardContent className="flex flex-col gap-1 p-2">
        <MultiSelect
          options={options}
          onValueChange={console.log}
          variant="inverted"
          placeholder="Select Publisher"
          modalPopover
        />
        <MultiSelect
          options={options}
          onValueChange={console.log}
          variant="inverted"
          placeholder="Select Agency"
          modalPopover
        />
        <MultiSelect
          options={options}
          onValueChange={console.log}
          variant="inverted"
          placeholder="Select Sub Fraud Category"
          modalPopover
        />
      </CardContent>
    </Card>
  );
}

function EmailForm() {
  const [Mail, setMail] = useState<string[]>([]);
  const handleRemoveMail = (i: number) => {
    Mail.splice(i, 1);
    setMail([...Mail]);
  };

  return (
    <>
      <div className="flex">
        <Input
          id="mail"
          placeholder="Email"
          className="rounded-br-none rounded-tr-none"
        />
        <Button
          size="icon"
          className="rounded-md rounded-bl-none rounded-tl-none"
          type="button"
          onClick={() => {
            const m = document.getElementById("mail") as HTMLInputElement;
            if (!m) return;
            if (m.value.length > 0) setMail([...Mail, m.value]);
          }}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="scrollbar max-h-24 overflow-y-auto rounded-md border p-2">
        {Mail.length === 0 && (
          <p className="text-sm font-extralight">Email List</p>
        )}
        {Mail.map((v, i) => (
          <p key={i} className="flex items-center justify-between">
            {v}{" "}
            <span
              title="Remove"
              className="pointer"
              onClick={() => handleRemoveMail(i)}
            >
              <CircleMinus size={15} />
            </span>
          </p>
        ))}
      </div>
    </>
  );
}

function S3Form() {
  return (
    <>
      <Input placeholder="Bucket Name" />
      <Input placeholder="Secret Key" />
      <Input placeholder="Access Key" />
    </>
  );
}
