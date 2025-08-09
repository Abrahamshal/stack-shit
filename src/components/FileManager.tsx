import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UploadCloud, 
  X, 
  FileJson,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface FileManagerProps {
  onFilesSelected: (files: FileList | File[]) => void;
  uploadedFiles: File[];
  onRemoveFile: (index: number) => void;
}

export default function FileManager({ 
  onFilesSelected, 
  uploadedFiles, 
  onRemoveFile 
}: FileManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type === 'application/json' || file.name.endsWith('.json')
      );
      
      if (files.length > 0) {
        onFilesSelected(files);
      } else {
        alert('Only JSON files are allowed');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50 bg-white"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".json,application/json"
          multiple
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <UploadCloud className="h-12 w-12 text-muted-foreground/50" />
          <div>
            <p className="font-semibold text-lg">
              Drop your JSON files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Support for multiple files • JSON format only
            </p>
          </div>
          <Button type="button" variant="outline" size="sm">
            Select Files
          </Button>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <Badge variant="secondary">
                Total: {formatFileSize(uploadedFiles.reduce((sum, f) => sum + f.size, 0))}
              </Badge>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 group hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileJson className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.type === 'application/json' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFile(index);
                      }}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}