"use client";

import React, { useState, useRef, useEffect } from "react";
import NewConnectionModal from "./new-connection-modal";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

const inputTypes = {
    Text: { placeholder: "Enter text value", type: "text" },
    Array: { placeholder: "Enter comma-separated values", type: "text" },
    Date: { placeholder: "Select a date", type: "date" },
    Boolean: { options: ["True", "False"], type: "select" },
    Custom: { placeholder: "Enter custom value", type: "text" },
};

type Result = {
    type: keyof typeof inputTypes;
    value: string;
};

export default function ActionForm({ condition, onActionsChange, type }) {

    const [results, setResults] = useState<Result[]>([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedDB, setSelectedDB] = useState(null);
    const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    // const [actions, setActions] = useState([
    //     {
    //       platform: "Redshift",
    //       integration_id: "",
    //       action_query: "insert into table_name()",
    //       value: type
    //     },
    // ]);

    const [isModalOpen, setModalOpen] = useState(false);

    const [showPopover, setShowPopover] = useState(false);
    const [actions, setActions] = useState([
        { name: "Snowflake", icon: "❄️" },
        { name: "Oracle", icon: "🛢️" },
        { name: "MS SQL Server", icon: "💾" },
        { name: "Google Sheet", icon: "📄" },
        { name: "Slack", icon: "💬" },
        { name: "Redshift", icon: "🔵" },
        { name: "REST API", icon: "🔗" },
        { name: "PostgreSQL", icon: "🐘" },
        { name: "MySQL", icon: "🐬" },
        { name: "MongoDB", icon: "🍃" },
    ]);


    const handleSelectChange = (value: string) => {
        setSelectedValue(value);

        setTimeout(() => setPopoverOpen(true), 0);
    };

    const options = [
        {
            label: "redshift",
            value: 'Redshift',
        },
        {
            label: "MySQL",
            value: 'MySQL',
        },
        {
            label: "PostgresSQL",
            value: 'PostgresSQL',
        },
        {
            label: "MongoDB",
            value: 'MongoDB',
        },
    ]


    const buttonRef = useRef(null);

    const togglePopover = () => setShowPopover(!showPopover);


    const handleQueryChange = (e, selectedValue) => {
        const { value } = e.target;

        const existingIndex = actions.findIndex(
            (action) => action.platform === selectedValue
        );

        let updatedActions;

        if (existingIndex > -1) {
            updatedActions = [...actions];
            updatedActions[existingIndex].action_query = value;
        } else {
            updatedActions = [
                ...actions,
                {
                    platform: selectedValue,
                    integration_id: "",
                    action_query: value,
                    value: type === "Then" ? "true" : "false"
                },
            ];
        }

        setActions(updatedActions);

        onActionsChange(updatedActions);
    };



    const openDatabaseModal = () => setIsDatabaseModalOpen(true);
    const closeDatabaseModal = () => setIsDatabaseModalOpen(false);


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setShowPopover(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className="p-6 max-w-3xl mx-auto border-2 mt-5">
            {/* <p className="font-bold mb-2">{condition}</p> */}
            <button
                onClick={() => setShowPopover(!showPopover)}
                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
            >
                <span className="text-xl">+</span>
                <span className="ml-1">Add Action</span>
            </button>
            {/* <Card className="p-4 mb-4 flex gap-4 items-center">
                <div className="relative">
                    <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div> */}

            {/* <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                            Add Query
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-4" side="right" align="start">
                        <p className="mb-2 text-sm font-medium">Enter Query</p>
                        <textarea
                            placeholder={`Query for ${selectedValue}`}
                            onChange={(e) => handleQueryChange(e, selectedValue)}
                            className="w-full h-32 p-2 border rounded-md resize-none"
                        ></textarea>
                    </PopoverContent>
                </Popover> */}

            {showPopover && (
                <div className="absolute top-0 mt-2 w-80 rounded-lg bg-white shadow-lg border z-10" ref={popoverRef}>
                    {/* Step 1: Select Type */}
                    {!selectedDB && (
                        <>
                            <div className="p-4 border-b font-semibold">Select Type</div>
                            <div className="grid grid-cols-2 gap-4 p-4">
                                {actions.map((action, index) => (
                                    <button
                                        key={index}
                                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                                        onClick={() => setSelectedDB(action)}
                                    >
                                        <span className="text-xl">{action.icon}</span>
                                        <span className="text-gray-700">{action.name}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Step 2: Show Connector Details */}
                    {selectedDB && (
                        <>
                            <div className="p-4 border-b font-semibold flex items-center">
                                <button
                                    onClick={() => setSelectedDB(null)}
                                    className="text-gray-500 hover:text-gray-700 mr-2"
                                >
                                    ←
                                </button>
                                <span>Select Connector</span>
                                <button
                                    className="ml-auto text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPopover(false)}
                                >
                                    🔄
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center space-x-3" onClick={openDatabaseModal}>
                                    <span className="text-2xl">{selectedDB.icon}</span>
                                    <span className="font-medium">{`NewDemoDB`}</span>
                                    <span className="text-gray-400 text-sm ml-auto">database</span>
                                </div>
                                <Link href="/rules-configuration/action/integrations">
                                    <button
                                        className="w-full flex items-center justify-center py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200"
                                    >
                                        <span className="text-xl mr-2">+</span>
                                        {selectedDB?.name}
                                    </button>
                                </Link>
                            </div>
                            <NewConnectionModal
                                isOpen={isModalOpen}
                                onClose={() => setModalOpen(false)}
                            />
                            <Dialog open={isDatabaseModalOpen} onOpenChange={setIsDatabaseModalOpen}>
                                <DialogTrigger className="hidden" />
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Integration: {selectedDB.name}</DialogTitle>
                                    </DialogHeader>

                                    {/* Query Editor */}
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">INSERT or UPDATE Query</h3>
                                        <textarea
                                            className="w-full h-40 border border-gray-300 p-2 rounded"
                                            placeholder="Write your query here..."
                                        ></textarea>
                                    </div>

                                    {/* Schema Explorer */}
                                    <div className="mt-5">
                                        <h3 className="text-lg font-semibold">Schema</h3>
                                        <ul className="border border-gray-300 p-3 rounded max-h-60 overflow-y-auto">
                                            <li>customers_and_analytics.browsing_preferences</li>
                                            <li>customers_and_analytics.content_preferences</li>
                                            <li>customers_and_analytics.customer_details</li>
                                            <li>...</li>
                                        </ul>
                                    </div>

                                    {/* Footer Buttons */}
                                    <DialogFooter className="flex justify-end mt-5 space-x-3">
                                        <button
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                                            onClick={() => setIsDatabaseModalOpen(false)}
                                        >
                                            Close
                                        </button>
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded">
                                            Save Query
                                        </button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
