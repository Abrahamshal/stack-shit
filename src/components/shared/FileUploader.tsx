import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];

    for (const file of files) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        alert(`${file.name} is not a JSON file and was skipped`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".json"
        multiple
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4">
        <UploadCloud className={`h-12 w-12 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground/50'}`} />
        <div>
          <p className="font-semibold">Drag & drop files here, or click to browse</p>
          <p className="text-sm text-muted-foreground">Supports multiple JSON files.</p>
        </div>
      </div>
    </div>
  );
}
