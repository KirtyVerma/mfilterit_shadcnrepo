"use client"

import React, { useState, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="block text-[#374151] text-sm font-medium">
            Creative Name
          </Label>
          <input
            type="text"
            name="creativeName"
            value={formData.creativeName}
            onChange={handleInputChange}
            className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Enter Creative Name"
            required
          />
        </div>

        <div className="space-y-4">
          <p className="text-sm text-[#7C3AED]">
            Note: Either enter creative URL or Browse file to upload.
          </p>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="block text-[#374151] text-sm font-medium">
                Creative URL
              </Label>
              <input
                type="text"
                name="creativeUrl"
                value={formData.creativeUrl}
                onChange={handleInputChange}
                className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter URL"
              />
            </div>
            
            <span className="text-sm font-medium text-[#6B7280]">OR</span>
            
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="h-11"
            >
              Browse File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-8">
          <div className="space-y-2">
            <Label className="block text-[#374151] text-sm font-medium">
              Height
            </Label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Height"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="block text-[#374151] text-sm font-medium">
              Width
            </Label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Width"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="block text-[#374151] text-sm font-medium">
              Duration (sec)
            </Label>
            <input
              type="number"
              name="creativeDuration"
              value={formData.creativeDuration}
              onChange={handleInputChange}
              className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Duration"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleNext("")}
            className="h-11"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
            className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white h-11 min-w-[160px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              "Upload Creative"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadCreative;