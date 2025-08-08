import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateFile, validateJSONContent, MAX_NODE_COUNT } from '@/lib/fileValidation';

// Interfaces
export interface Node {
  name: string;
  type: string;
}

export interface Workflow {
  workflowName: string;
  fileName: string;
  totalNodes: number;
  totalPrice: number;
  nodes: Node[];
  platform: 'make' | 'zapier' | 'unknown';
}

export interface WorkflowFile {
  file: File;
  nodeCount: number;
}

export interface AnalysisSummary {
  totalNodes: number;
  totalPrice: number;
  totalWorkflows: number;
  pricePerNode: number;
  makeCount: number;
  zapierCount: number;
}

export interface GroupedWorkflows {
  make?: Workflow[];
  zapier?: Workflow[];
}

export interface AnalysisResults {
  workflows: Workflow[];
  groupedWorkflows: GroupedWorkflows;
  summary: AnalysisSummary;
}

// Helper to identify platform
const getPlatform = (content: any): 'make' | 'zapier' | 'unknown' => {
  if (content.flow && Array.isArray(content.flow)) return 'make';
  if (content.zaps && Array.isArray(content.zaps)) return 'zapier';
  return 'unknown';
};

// Hook
export const useWorkflowAnalyzer = () => {
  const [uploadedFiles, setUploadedFiles] = useState<WorkflowFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const countNodesInWorkflow = (workflow: unknown, platform: 'make' | 'zapier' | 'unknown'): { nodes: Node[], count: number } => {
    let nodes: Node[] = [];
    if (platform === 'make' && (workflow as any).flow) {
      nodes = (workflow as any).flow.map((n: any) => ({ name: n.label, type: n.module }));
    } else if (platform === 'zapier' && (workflow as any).zaps) {
      nodes = (workflow as any).zaps.flatMap((zap: any) => zap.steps.map((s: any) => ({ name: s.name, type: s.app })));
    }
    return { nodes, count: nodes.length };
  };

  const analyzeFile = async (file: File): Promise<Workflow | null> => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      toast({ title: "File validation failed", description: validation.error, variant: "destructive" });
      return null;
    }

    try {
      const content = await file.text();
      const contentValidation = await validateJSONContent(content);
      if (!contentValidation.isValid) {
        toast({ title: "Invalid JSON content", description: contentValidation.error, variant: "destructive" });
        return null;
      }

      const parsed = JSON.parse(content);
      const platform = getPlatform(parsed);
      const { nodes, count } = countNodesInWorkflow(parsed, platform);

      if ((analysisResults?.summary.totalNodes || 0) + count > MAX_NODE_COUNT) {
        toast({ title: "Node limit exceeded", description: `Total nodes would exceed the maximum limit of ${MAX_NODE_COUNT}`, variant: "destructive" });
        return null;
      }
      
      return {
        fileName: file.name,
        workflowName: parsed.name || file.name,
        totalNodes: count,
        totalPrice: count * 20,
        nodes,
        platform,
      };
    } catch (error) {
      toast({ title: "Error analyzing file", description: "Failed to parse workflow file", variant: "destructive" });
      return null;
    }
  };

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setIsAnalyzing(true);
    const fileArray = Array.from(files);
    const newWorkflows: Workflow[] = [];

    for (const file of fileArray) {
      const workflow = await analyzeFile(file);
      if (workflow) {
        newWorkflows.push(workflow);
      }
    }

    if (newWorkflows.length > 0) {
      setAnalysisResults(prevResults => {
        const allWorkflows = [...(prevResults?.workflows || []), ...newWorkflows];
        const totalWorkflows = allWorkflows.length;
        const totalNodes = allWorkflows.reduce((sum, wf) => sum + wf.totalNodes, 0);
        const totalPrice = allWorkflows.reduce((sum, wf) => sum + wf.totalPrice, 0);
        const makeCount = allWorkflows.filter(wf => wf.platform === 'make').length;
        const zapierCount = allWorkflows.filter(wf => wf.platform === 'zapier').length;

        const groupedWorkflows: GroupedWorkflows = {
          make: allWorkflows.filter(wf => wf.platform === 'make'),
          zapier: allWorkflows.filter(wf => wf.platform === 'zapier'),
        };
        
        const summary: AnalysisSummary = {
          totalNodes,
          totalPrice,
          totalWorkflows,
          pricePerNode: 20,
          makeCount,
          zapierCount
        };
        
        return { workflows: allWorkflows, groupedWorkflows, summary };
      });
    }

    setIsAnalyzing(false);
  }, [analysisResults]);

  const resetAnalysis = useCallback(() => {
    setUploadedFiles([]);
    setAnalysisResults(null);
    setIsAnalyzing(false);
  }, []);
  
  return {
    uploadedFiles,
    analysisResults,
    isAnalyzing,
    handleFileUpload,
    resetAnalysis,
  };
};
