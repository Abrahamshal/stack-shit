import { useRef } from 'react';
import { Upload, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkflowUploaderProps {
  onFileSelect: (files: FileList) => void;
  multiple?: boolean;
  isDragging?: boolean;
  setIsDragging?: (dragging: boolean) => void;
  className?: string;
  showButton?: boolean;
  buttonText?: string;
  description?: string;
}

export const WorkflowUploader = ({
  onFileSelect,
  multiple = false,
  isDragging = false,
  setIsDragging,
  className = '',
  showButton = true,
  buttonText = 'Choose Files',
  description = 'Drag and drop or click to upload JSON workflow files',
}: WorkflowUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = `workflow-upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging?.(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging?.(true);
  };

  const handleDragLeave = () => {
    setIsDragging?.(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed transition-colors rounded-lg p-8 text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary'
      } ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={multiple ? "Click or drag and drop to upload workflow files" : "Click or drag and drop to upload workflow file"}
      onKeyDown={handleKeyDown}
    >
      <Upload size={48} className="mx-auto mb-4 text-muted-foreground/50" />
      <h3 className="font-semibold text-lg mb-2">Upload Your Workflow Files</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
        id={inputId}
        aria-label={multiple ? "Upload JSON workflow files" : "Upload JSON workflow file"}
      />
      <label htmlFor={inputId} className="sr-only">
        Choose workflow files to upload
      </label>
      
      {showButton && (
        <label htmlFor={inputId}>
          <Button variant="outline" className="cursor-pointer" asChild>
            <span>
              <FileJson className="mr-2" size={16} />
              {buttonText}
            </span>
          </Button>
        </label>
      )}
    </div>
  );
};