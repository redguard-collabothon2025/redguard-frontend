import { useState } from "react";
import { Upload, FileText, Shield, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

interface UploadPageProps {
  onDocumentUploaded: () => void;
}

export function UploadPage({ onDocumentUploaded }: UploadPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onDocumentUploaded();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-white mb-4">Upload Contract Document</h2>
        <p className="text-gray-400">
          Drag & drop your contract or click to browse
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 mb-8 transition-all ${
          isDragging
            ? "border-[#EE0000] bg-[#EE0000]/10"
            : "border-gray-700 bg-[#1a1a1a] hover:border-gray-600"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.txt,.docx"
          onChange={handleFileSelect}
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="w-16 h-16 text-[#EE0000] mb-4" />

          {file ? (
            <div className="text-center">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-[#EE0000]" />
                <span className="text-white">{file.name}</span>
              </div>
              <p className="text-gray-400 text-sm">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-white mb-2">
                Drop your contract here or click to browse
              </h3>
              <p className="text-gray-400">Supported formats: PDF, TXT, DOCX</p>
            </>
          )}
        </label>

        {/* Format Badges */}
        <div className="flex justify-center gap-3 mt-6">
          <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm border border-gray-700">
            PDF
          </span>
          <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm border border-gray-700">
            TXT
          </span>
          <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm border border-gray-700">
            DOCX
          </span>
        </div>
      </div>

      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
        <Shield className="w-5 h-5 text-green-500" />
        <div>
          <p className="text-white">
            <span className="inline-flex items-center gap-2">
              Processing in memory - no disk storage
              <Check className="w-4 h-4 text-green-500" />
            </span>
          </p>
          <p className="text-gray-400 text-sm">
            Your data never leaves this cluster
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Analyzing document...</span>
            <span className="text-gray-300">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2 bg-gray-800" />
        </div>
      )}

      {/* Analyze Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleAnalyze}
          disabled={!file || isUploading}
          className="px-8 py-6 bg-[#EE0000] hover:bg-[#CC0000] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Analyzing..." : "Analyze Contract"}
        </Button>
      </div>
    </div>
  );
}
