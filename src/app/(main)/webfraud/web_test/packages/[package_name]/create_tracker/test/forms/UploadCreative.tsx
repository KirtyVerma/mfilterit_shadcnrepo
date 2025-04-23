"use client"

import React, { useState, useRef } from 'react';

// API base URL
const BASE_URL = process.env.REACT_APP_DISPLAY_VIDEO_API_URL;

interface FormData {
  creativeName: string;
  creativeUrl: string;
  height: number;
  width: number;
  creativeDuration: number;
  file: File | null;
}

interface UploadCreativeProps {
  handleNext: (step: string) => void;
}

const UploadCreative: React.FC<UploadCreativeProps> = ({ handleNext }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoSize, setVideoSize] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    creativeName: "",
    creativeUrl: "",
    height: 0,
    width: 0,
    creativeDuration: 0,
    file: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setVideoSize(sizeInMB);

    if (parseFloat(sizeInMB) > 300) {
      setError("Size is too large. Upload a video less than 300MB!");
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      setFormData(prev => ({
        ...prev,
        file,
        creativeName: file.name,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        creativeDuration: Math.round(videoElement.duration)
      }));
    };

    videoElement.src = URL.createObjectURL(file);
  };

  const generatePresignedUrl = async () => {
    try {
      const package_name = localStorage.getItem('dpackage');
      const apiUrl = `${BASE_URL}/api/generate_presigned_url?package_name=${package_name}`;
      return fetch(apiUrl);
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
      throw error;
    }
  };

  const handleFileUpload = async (file: File, presignedUrl: any) => {
    try {
      if (presignedUrl) {
        const response = await fetch(presignedUrl.presigned_url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'video/mp4',
          },
          body: file,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.creativeName) {
      setError("Creative Name is required");
      return;
    }

    if (!formData.file && !formData.creativeUrl) {
      setError("Please provide either a file or URL");
      return;
    }

    if (formData.file && formData.creativeUrl) {
      setError("Please provide only one: either Creative File or Creative URL");
      return;
    }

    if (parseFloat(videoSize) > 300) {
      setError("Size is too large. Upload a video less than 300MB!");
      return;
    }

    try {
      setIsUploading(true);

      // Generate presigned URL
      const presignedUrlResponse = await generatePresignedUrl();
      if (!presignedUrlResponse.ok) {
        throw new Error('Failed to generate presigned URL');
      }

      const presignedUrlData = await presignedUrlResponse.json();

      // Upload file if present
      if (formData.file) {
        await handleFileUpload(formData.file, presignedUrlData);
      }

      // Submit creative data
      const payload = {
        creative_name: formData.creativeName,
        creative_url: formData.creativeUrl,
        creative_width: formData.width,
        creative_height: formData.height,
        uploaded_file_name: presignedUrlData.file_name,
        package_name: localStorage.getItem('dpackage'),
        creative_duration: formData.creativeDuration,
        creative_type: "video_creative"
      };

      const apiUrl = `${BASE_URL}/api/video_creatives`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to upload creative');
      }

      setSuccess('Creative uploaded successfully');
      handleNext("creative_uploaded");
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Creative</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Creative Name
            </label>
            <input
              type="text"
              name="creativeName"
              value={formData.creativeName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Creative Name"
              required
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Note: Either enter creative URL or Browse file to upload.
            </p>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Creative URL
                </label>
                <input
                  type="text"
                  name="creativeUrl"
                  value={formData.creativeUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter URL"
                />
              </div>
              
              <span className="text-sm font-medium">OR</span>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Browse File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Height"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Width"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (sec)
              </label>
              <input
                type="number"
                name="creativeDuration"
                value={formData.creativeDuration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Duration"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload Creative"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadCreative;