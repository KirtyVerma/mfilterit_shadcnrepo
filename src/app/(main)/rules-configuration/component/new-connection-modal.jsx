import React, { useState } from "react";

const NewConnectionModal = ({ isOpen, onClose }) => {
  const [connectionData, setConnectionData] = useState({
    name: "",
    host: "127.0.0.1",
    port: "5432",
    username: "",
    password: "",
    database: "",
    ssl: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConnectionData({
      ...connectionData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🐘</span>
                <h2 className="text-lg font-semibold">PostgreSQL</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b text-gray-700">
              <button className="border-b-2 border-blue-600 px-4 py-2 font-semibold text-blue-600">
                Staging
              </button>
              <button className="px-4 py-2 hover:text-blue-600">
                Production
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="rounded bg-blue-50 p-2 text-sm text-blue-700">
                Here, Integration is only tested in Staging. Click on Production
                tab to test in Production.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Connector name"
                    value={connectionData.name}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Host</label>
                  <input
                    type="text"
                    name="host"
                    value={connectionData.host}
                    onChange={handleChange}
                    disabled
                    className="w-full rounded border bg-gray-100 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Port</label>
                  <input
                    type="text"
                    name="port"
                    value={connectionData.port}
                    onChange={handleChange}
                    disabled
                    className="w-full rounded border bg-gray-100 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={connectionData.username}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Password (Encrypted)
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••"
                    value={connectionData.password}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Database
                  </label>
                  <input
                    type="text"
                    name="database"
                    placeholder="db"
                    value={connectionData.database}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ssl"
                  checked={connectionData.ssl}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="text-sm text-gray-700">Enable SSL</label>
              </div>

              <div className="text-sm text-gray-600">
                Expand to see the IP addresses to add to your allow-list:
                <pre className="mt-1 rounded bg-gray-50 p-2 text-gray-700">
                  {`[
  43.205.43.45
]`}
                </pre>
              </div>
            </div>

            <div className="flex justify-end space-x-2 border-t p-4">
              <button className="px-4 py-2 font-medium text-blue-700 hover:underline">
                Test Connection
              </button>
              <button
                className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                disabled
              >
                Publish in Staging
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewConnectionModal;
