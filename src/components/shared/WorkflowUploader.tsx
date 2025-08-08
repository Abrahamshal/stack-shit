import { useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WorkflowUploaderProps {
  onFileSelect: (files: FileList) => void;
  multiple?: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  className?: string;
  buttonText?: string;
  description?: string;
}

export const WorkflowUploader = ({
  onFileSelect,
  multiple = true,
  isDragging,
  setIsDragging,
  className,
  buttonText = "Choose Workflow Files",
  description = "Drag and drop your workflow JSON files here or click to browse"
}: WorkflowUploaderProps) => {
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        alert(`${file.name} is not a JSON file and was skipped`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      // Create a new FileList-like object
      const dt = new DataTransfer();
      validFiles.forEach(file => {
        dt.items.add(file);
      });
      onFileSelect(dt.files);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed transition-all duration-300 bg-white",
        isDragging 
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" 
          : "border-gray-300 hover:border-primary/50",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".json,application/json"
        multiple={multiple}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <UploadCloud 
          size={48} 
          className={cn(
            "transition-colors",
            isDragging ? "text-primary" : "text-gray-400"
          )}
        />
        
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {description}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports JSON files from Zapier, Make.com, and more
          </p>
        </div>

        <Button
          type="button"
          onClick={handleClick}
          variant="outline"
          size="lg"
          className="mt-4"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default WorkflowUploader;