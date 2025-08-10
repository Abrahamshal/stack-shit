import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateFile, validateJSONContent, MAX_NODE_COUNT } from '@/lib/fileValidation';
import type { ZapierWorkflow } from '@/components/ZapierWorkflowSelector';

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
  platform: 'make' | 'zapier' | 'n8n' | 'unknown';
}

export interface PendingZapierFile {
  fileName: string;
  workflows: ZapierWorkflow[];
}

export interface AnalysisSummary {
  totalNodes: number;
  totalPrice: number;
  totalWorkflows: number;
  pricePerNode: number;
  makeCount: number;
  zapierCount: number;
  n8nCount: number;
}

export interface GroupedWorkflows {
  make?: Workflow[];
  zapier?: Workflow[];
  n8n?: Workflow[];
}

export interface AnalysisResults {
  workflows: Workflow[];
  groupedWorkflows: GroupedWorkflows;
  summary: AnalysisSummary;
}

// Helper to identify platform
const getPlatform = (content: any): 'make' | 'zapier' | 'n8n' | 'unknown' => {
  if (content.flow && Array.isArray(content.flow)) return 'make';
  if (content.zaps && Array.isArray(content.zaps)) return 'zapier';
  if (content.nodes && Array.isArray(content.nodes) && content.connections) return 'n8n';
  return 'unknown';
};

// Enhanced workflow analyzer hook
export const useEnhancedWorkflowAnalyzer = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [pendingZapierFiles, setPendingZapierFiles] = useState<PendingZapierFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showZapierSelector, setShowZapierSelector] = useState(false);
  const { toast } = useToast();

  // Validate that file is JSON
  const validateFileType = (file: File): boolean => {
    const validTypes = ['application/json'];
    const validExtensions = ['.json'];
    
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidType && !hasValidExtension) {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not a JSON file. Only JSON files are allowed.`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  // Process Make.com workflow
  const processMakeWorkflow = (parsed: any, fileName: string): Workflow | null => {
    const nodes: Node[] = [];
    const seenIds = new Set<string>();
    
    function collectNodesRecursive(item: any) {
      if (!item || typeof item !== 'object' || !item.id || seenIds.has(item.id)) {
        return;
      }
      
      seenIds.add(item.id);
      nodes.push({
        name: item.name || item.metadata?.designer?.name || item.module || 'Unknown',
        type: item.module || 'unknown',
      });
      
      // Check for nested structures
      if (item.routes && Array.isArray(item.routes)) {
        item.routes.forEach((route: any) => {
          if (route.flow && Array.isArray(route.flow)) {
            route.flow.forEach(collectNodesRecursive);
          }
        });
      }
      
      if (item.onerror && Array.isArray(item.onerror)) {
        item.onerror.forEach(collectNodesRecursive);
      }
      
      if (item.iterate?.flow && Array.isArray(item.iterate.flow)) {
        item.iterate.flow.forEach(collectNodesRecursive);
      }
    }
    
    const mainFlow = parsed.flow || [];
    mainFlow.forEach(collectNodesRecursive);
    
    return {
      fileName,
      workflowName: parsed.name || fileName,
      totalNodes: nodes.length,
      totalPrice: nodes.length * 20,
      nodes,
      platform: 'make',
    };
  };

  // Process n8n workflow
  const processN8nWorkflow = (parsed: any, fileName: string): Workflow | null => {
    const nodes = parsed.nodes?.map((node: any) => ({
      name: node.name || 'Unknown',
      type: node.type || 'unknown',
    })) || [];
    
    return {
      fileName,
      workflowName: parsed.name || fileName,
      totalNodes: nodes.length,
      totalPrice: nodes.length * 20,
      nodes,
      platform: 'n8n',
    };
  };

  // Process Zapier workflows (returns pending workflows for selection)
  const processZapierFile = (parsed: any, fileName: string): PendingZapierFile | null => {
    if (!parsed.zaps || !Array.isArray(parsed.zaps)) {
      return null;
    }
    
    const workflows: ZapierWorkflow[] = parsed.zaps.map(zap => {
      const nodeCount = zap.nodes ? Object.keys(zap.nodes).length : 0;
      
      return {
        id: zap.id || Math.random().toString(36).substr(2, 9),
        title: zap.title || `Zap ${zap.id || 'Unknown'}`,
        status: zap.status || 'off',
        nodeCount,
        price: nodeCount * 20,
        fileName,
        selected: false,
      };
    });
    
    return {
      fileName,
      workflows,
    };
  };

  // Analyze a single file
  const analyzeFile = async (file: File): Promise<{
    workflows?: Workflow[];
    pendingZapier?: PendingZapierFile;
  } | null> => {
    // Validate file type
    if (!validateFileType(file)) {
      return null;
    }
    
    // Validate file size and content
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
      const platform = getPlatform(parsed);
      
      // Handle different platforms
      switch (platform) {
        case 'zapier':
          const pendingZapier = processZapierFile(parsed, file.name);
          if (pendingZapier) {
            return { pendingZapier };
          }
          break;
          
        case 'make':
          const makeWorkflow = processMakeWorkflow(parsed, file.name);
          if (makeWorkflow) {
            return { workflows: [makeWorkflow] };
          }
          break;
          
        case 'n8n':
          const n8nWorkflow = processN8nWorkflow(parsed, file.name);
          if (n8nWorkflow) {
            return { workflows: [n8nWorkflow] };
          }
          break;
          
        default:
          toast({ 
            title: "Unknown workflow format", 
            description: `Could not identify the platform for ${file.name}`, 
            variant: "destructive" 
          });
          return null;
      }
    } catch (error) {
      toast({ 
        title: "Error analyzing file", 
        description: `Failed to parse ${file.name}`, 
        variant: "destructive" 
      });
      return null;
    }
    
    return null;
  };

  // Handle multiple file uploads
  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setIsAnalyzing(true);
    const fileArray = Array.from(files);
    
    const immediateWorkflows: Workflow[] = [];
    const newPendingZapierFiles: PendingZapierFile[] = [];
    
    // Process all files
    for (const file of fileArray) {
      const result = await analyzeFile(file);
      
      if (result) {
        if (result.workflows) {
          immediateWorkflows.push(...result.workflows);
        }
        if (result.pendingZapier) {
          newPendingZapierFiles.push(result.pendingZapier);
        }
      }
    }
    
    // Add immediate workflows (Make, n8n)
    if (immediateWorkflows.length > 0) {
      addWorkflowsToResults(immediateWorkflows);
    }
    
    // If there are Zapier files, show the selector
    if (newPendingZapierFiles.length > 0) {
      setPendingZapierFiles(prev => [...prev, ...newPendingZapierFiles]);
      setShowZapierSelector(true);
    }
    
    setIsAnalyzing(false);
    
    // Show summary toast
    const totalFiles = fileArray.length;
    const successfulFiles = immediateWorkflows.length + newPendingZapierFiles.length;
    
    if (successfulFiles > 0) {
      toast({
        title: "Files processed",
        description: `Successfully processed ${successfulFiles} of ${totalFiles} files`,
      });
    }
  }, []);

  // Add workflows to results
  const addWorkflowsToResults = (newWorkflows: Workflow[]) => {
    setAnalysisResults(prevResults => {
      const allWorkflows = [...(prevResults?.workflows || []), ...newWorkflows];
      const totalWorkflows = allWorkflows.length;
      const totalNodes = allWorkflows.reduce((sum, wf) => sum + wf.totalNodes, 0);
      const totalPrice = allWorkflows.reduce((sum, wf) => sum + wf.totalPrice, 0);
      const makeCount = allWorkflows.filter(wf => wf.platform === 'make').length;
      const zapierCount = allWorkflows.filter(wf => wf.platform === 'zapier').length;
      const n8nCount = allWorkflows.filter(wf => wf.platform === 'n8n').length;

      const groupedWorkflows: GroupedWorkflows = {
        make: allWorkflows.filter(wf => wf.platform === 'make'),
        zapier: allWorkflows.filter(wf => wf.platform === 'zapier'),
        n8n: allWorkflows.filter(wf => wf.platform === 'n8n'),
      };
      
      const summary: AnalysisSummary = {
        totalNodes,
        totalPrice,
        totalWorkflows,
        pricePerNode: 20,
        makeCount,
        zapierCount,
        n8nCount,
      };
      
      return { workflows: allWorkflows, groupedWorkflows, summary };
    });
  };

  // Process selected Zapier workflows
  const processSelectedZapierWorkflows = useCallback((selectedWorkflows: ZapierWorkflow[]) => {
    // First, remove any existing Zapier workflows from the same files
    setAnalysisResults(prevResults => {
      // Get existing non-Zapier workflows or empty array if no previous results
      const filteredWorkflows = prevResults 
        ? prevResults.workflows.filter(w => w.platform !== 'zapier')
        : [];
      
      // Now create new workflows from selections
      const newZapierWorkflows: Workflow[] = selectedWorkflows.map(zw => ({
        fileName: zw.fileName,
        workflowName: zw.title,
        totalNodes: zw.nodeCount,
        totalPrice: zw.price,
        nodes: [], // We don't have detailed node info at this point
        platform: 'zapier' as const,
      }));
      
      // Combine and recalculate
      const allWorkflows = [...filteredWorkflows, ...newZapierWorkflows];
      
      // If no workflows selected, return null
      if (allWorkflows.length === 0) return null;
      
      const totalWorkflows = allWorkflows.length;
      const totalNodes = allWorkflows.reduce((sum, wf) => sum + wf.totalNodes, 0);
      const totalPrice = allWorkflows.reduce((sum, wf) => sum + wf.totalPrice, 0);
      const makeCount = allWorkflows.filter(wf => wf.platform === 'make').length;
      const zapierCount = allWorkflows.filter(wf => wf.platform === 'zapier').length;
      const n8nCount = allWorkflows.filter(wf => wf.platform === 'n8n').length;

      const groupedWorkflows: GroupedWorkflows = {
        make: allWorkflows.filter(wf => wf.platform === 'make'),
        zapier: allWorkflows.filter(wf => wf.platform === 'zapier'),
        n8n: allWorkflows.filter(wf => wf.platform === 'n8n'),
      };
      
      const summary: AnalysisSummary = {
        totalNodes,
        totalPrice,
        totalWorkflows,
        pricePerNode: 20,
        makeCount,
        zapierCount,
        n8nCount,
      };
      
      return { workflows: allWorkflows, groupedWorkflows, summary };
    });
    
    // Don't clear pending Zapier files - keep them for editing
    setShowZapierSelector(false);
    
    toast({
      title: "Zapier workflows updated",
      description: `Selected ${selectedWorkflows.length} Zapier workflows`,
    });
  }, []);

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setAnalysisResults(null);
    setPendingZapierFiles([]);
    setShowZapierSelector(false);
    setIsAnalyzing(false);
  }, []);
  
  // Remove Zapier workflows from results (for re-selection)
  const clearZapierWorkflows = useCallback(() => {
    setAnalysisResults(prevResults => {
      if (!prevResults) return null;
      const filteredWorkflows = prevResults.workflows.filter(
        w => w.platform !== 'zapier'
      );
      
      if (filteredWorkflows.length === 0) return null;
      
      const totalWorkflows = filteredWorkflows.length;
      const totalNodes = filteredWorkflows.reduce((sum, wf) => sum + wf.totalNodes, 0);
      const totalPrice = filteredWorkflows.reduce((sum, wf) => sum + wf.totalPrice, 0);
      const makeCount = filteredWorkflows.filter(wf => wf.platform === 'make').length;
      const zapierCount = 0;
      const n8nCount = filteredWorkflows.filter(wf => wf.platform === 'n8n').length;

      const groupedWorkflows: GroupedWorkflows = {
        make: filteredWorkflows.filter(wf => wf.platform === 'make'),
        zapier: [],
        n8n: filteredWorkflows.filter(wf => wf.platform === 'n8n'),
      };
      
      const summary: AnalysisSummary = {
        totalNodes,
        totalPrice,
        totalWorkflows,
        pricePerNode: 20,
        makeCount,
        zapierCount,
        n8nCount,
      };
      
      return { workflows: filteredWorkflows, groupedWorkflows, summary };
    });
  }, []);
  
  // Remove workflows by filename
  const removeWorkflowsByFileName = useCallback((fileName: string) => {
    // Remove from pending Zapier files
    setPendingZapierFiles(prev => prev.filter(f => f.fileName !== fileName));
    
    // Remove from analysis results
    setAnalysisResults(prevResults => {
      if (!prevResults) return null;
      
      const filteredWorkflows = prevResults.workflows.filter(
        w => w.fileName !== fileName
      );
      
      if (filteredWorkflows.length === 0) return null;
      
      const totalWorkflows = filteredWorkflows.length;
      const totalNodes = filteredWorkflows.reduce((sum, wf) => sum + wf.totalNodes, 0);
      const totalPrice = filteredWorkflows.reduce((sum, wf) => sum + wf.totalPrice, 0);
      const makeCount = filteredWorkflows.filter(wf => wf.platform === 'make').length;
      const zapierCount = filteredWorkflows.filter(wf => wf.platform === 'zapier').length;
      const n8nCount = filteredWorkflows.filter(wf => wf.platform === 'n8n').length;

      const groupedWorkflows: GroupedWorkflows = {
        make: filteredWorkflows.filter(wf => wf.platform === 'make'),
        zapier: filteredWorkflows.filter(wf => wf.platform === 'zapier'),
        n8n: filteredWorkflows.filter(wf => wf.platform === 'n8n'),
      };
      
      const summary: AnalysisSummary = {
        totalNodes,
        totalPrice,
        totalWorkflows,
        pricePerNode: 20,
        makeCount,
        zapierCount,
        n8nCount,
      };
      
      return { workflows: filteredWorkflows, groupedWorkflows, summary };
    });
    
    // If this was the last Zapier file and selector is showing, hide it
    setPendingZapierFiles(prev => {
      if (prev.filter(f => f.fileName !== fileName).length === 0) {
        setShowZapierSelector(false);
      }
      return prev;
    });
  }, []);
  
  // Get all pending Zapier workflows
  const allPendingZapierWorkflows = pendingZapierFiles.flatMap(f => f.workflows);
  
  return {
    analysisResults,
    pendingZapierWorkflows: allPendingZapierWorkflows,
    showZapierSelector,
    isAnalyzing,
    handleFileUpload,
    processSelectedZapierWorkflows,
    resetAnalysis,
    clearZapierWorkflows,
    removeWorkflowsByFileName,
    totalNodeCount: analysisResults?.summary.totalNodes || 0,
    estimatedPrice: analysisResults?.summary.totalPrice || 0,
  };
};