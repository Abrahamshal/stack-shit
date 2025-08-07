import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateFile, validateJSONContent, MAX_NODE_COUNT } from '@/lib/fileValidation';

export interface WorkflowFile {
  file: File;
  nodeCount: number;
}

export const useWorkflowAnalyzer = () => {
  const [uploadedFiles, setUploadedFiles] = useState<WorkflowFile[]>([]);
  const [totalNodeCount, setTotalNodeCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const { toast } = useToast();

  const countNodesInWorkflow = (workflow: unknown): number => {
    const wf = workflow as Record<string, unknown>;
    
    // Handle n8n workflow format
    if (wf.nodes && Array.isArray(wf.nodes)) {
      return wf.nodes.length;
    }
    
    // Handle Zapier/Make format - count objects with type/action/module
    let count = 0;
    const countNodes = (obj: unknown, depth = 0): void => {
      if (depth > 20) return; // Prevent infinite recursion
      
      if (obj && typeof obj === 'object' && obj !== null) {
        const record = obj as Record<string, unknown>;
        if (record.type || record.action || record.module) {
          count++;
        }
        
        for (const key in record) {
          if (Object.prototype.hasOwnProperty.call(record, key) && typeof record[key] === 'object') {
            countNodes(record[key], depth + 1);
          }
        }
      }
    };
    
    countNodes(workflow);
    
    // Fallback: if no nodes found, count ID occurrences
    if (count === 0) {
      const stringified = JSON.stringify(workflow);
      const idMatches = stringified.match(/"id":/g);
      count = idMatches ? idMatches.length : 0;
    }
    
    return count || 5; // Default estimate if nothing found
  };

  const analyzeFile = useCallback(async (file: File): Promise<number | null> => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      toast({
        title: "File validation failed",
        description: validation.error,
        variant: "destructive"
      });
      return null;
    }

    try {
      const content = await file.text();
      
      // Validate JSON content
      const contentValidation = await validateJSONContent(content);
      if (!contentValidation.isValid) {
        toast({
          title: "Invalid JSON content",
          description: contentValidation.error,
          variant: "destructive"
        });
        return null;
      }
      
      const parsed = JSON.parse(content);
      const nodeCount = countNodesInWorkflow(parsed);
      
      // Check if adding this file would exceed the limit
      if (totalNodeCount + nodeCount > MAX_NODE_COUNT) {
        toast({
          title: "Node limit exceeded",
          description: `Total nodes would exceed the maximum limit of ${MAX_NODE_COUNT}`,
          variant: "destructive"
        });
        return null;
      }
      
      return nodeCount;
    } catch (error) {
      toast({
        title: "Error analyzing file",
        description: "Failed to parse workflow file",
        variant: "destructive"
      });
      return null;
    }
  }, [totalNodeCount, toast]);

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setIsAnalyzing(true);
    const fileArray = Array.from(files);
    const newFiles: WorkflowFile[] = [];
    let newNodeCount = 0;

    for (const file of fileArray) {
      const nodeCount = await analyzeFile(file);
      if (nodeCount !== null) {
        newFiles.push({ file, nodeCount });
        newNodeCount += nodeCount;
      }
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setTotalNodeCount(prev => prev + newNodeCount);
      setEstimatedPrice(Math.max((totalNodeCount + newNodeCount) * 20, 200));
    }

    setIsAnalyzing(false);
  }, [analyzeFile, totalNodeCount]);

  const resetAnalysis = useCallback(() => {
    setUploadedFiles([]);
    setTotalNodeCount(0);
    setEstimatedPrice(0);
    setIsAnalyzing(false);
  }, []);

  const removeFile = useCallback((index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setTotalNodeCount(prev => prev - fileToRemove.nodeCount);
    setEstimatedPrice(prev => {
      const newTotal = totalNodeCount - fileToRemove.nodeCount;
      return Math.max(newTotal * 20, 200);
    });
  }, [uploadedFiles, totalNodeCount]);

  return {
    uploadedFiles,
    totalNodeCount,
    isAnalyzing,
    estimatedPrice,
    handleFileUpload,
    resetAnalysis,
    removeFile,
  };
};