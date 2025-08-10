import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ArrowUpDown, FileJson, Power, PowerOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ZapierWorkflow {
  id: string | number;
  title: string;
  status: 'on' | 'off';
  nodeCount: number;
  price: number;
  fileName: string;
  selected?: boolean;
}

interface ZapierWorkflowSelectorProps {
  workflows: ZapierWorkflow[];
  onSelectionChange: (selectedWorkflows: ZapierWorkflow[]) => void;
  onCalculate: () => void;
  initialSelections?: ZapierWorkflow[];
}

type FilterStatus = 'all' | 'active' | 'inactive';
type SortBy = 'name' | 'nodes' | 'status' | 'price';

export default function ZapierWorkflowSelector({ 
  workflows, 
  onSelectionChange, 
  onCalculate,
  initialSelections = [] 
}: ZapierWorkflowSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(initialSelections.map(w => w.id))
  );
  const [selectAll, setSelectAll] = useState(false);

  // Filter and sort workflows
  const processedWorkflows = useMemo(() => {
    let filtered = workflows.filter(workflow => {
      // Search filter
      const matchesSearch = workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           workflow.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && workflow.status === 'on') ||
                           (filterStatus === 'inactive' && workflow.status === 'off');
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'nodes':
          return b.nodeCount - a.nodeCount;
        case 'status':
          return a.status === b.status ? 0 : a.status === 'on' ? -1 : 1;
        case 'price':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [workflows, searchQuery, filterStatus, sortBy]);

  // Initialize selections on mount or when initialSelections change
  React.useEffect(() => {
    if (initialSelections.length > 0) {
      setSelectedIds(new Set(initialSelections.map(w => w.id)));
    }
  }, [initialSelections]);

  // Handle selection changes
  const handleWorkflowToggle = (workflowId: string | number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(workflowId)) {
      newSelectedIds.delete(workflowId);
    } else {
      newSelectedIds.add(workflowId);
    }
    setSelectedIds(newSelectedIds);
    
    const selectedWorkflows = workflows.filter(w => newSelectedIds.has(w.id));
    onSelectionChange(selectedWorkflows);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      onSelectionChange([]);
    } else {
      const allIds = new Set(processedWorkflows.map(w => w.id));
      setSelectedIds(allIds);
      onSelectionChange(processedWorkflows);
    }
    setSelectAll(!selectAll);
  };

  // Calculate totals
  const selectedWorkflows = workflows.filter(w => selectedIds.has(w.id));
  const totalSelected = selectedWorkflows.length;
  const totalNodes = selectedWorkflows.reduce((sum, w) => sum + w.nodeCount, 0);
  const totalPrice = selectedWorkflows.reduce((sum, w) => sum + w.price, 0);

  // Group workflows by file
  const workflowsByFile = useMemo(() => {
    const grouped = new Map<string, ZapierWorkflow[]>();
    processedWorkflows.forEach(workflow => {
      const existing = grouped.get(workflow.fileName) || [];
      grouped.set(workflow.fileName, [...existing, workflow]);
    });
    return grouped;
  }, [processedWorkflows]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Select Workflows to Migrate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workflows</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
              <SelectTrigger>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="nodes">Node Count</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="cursor-pointer">
                Select All ({processedWorkflows.length} workflows)
              </Label>
            </div>
            <div className="text-sm text-muted-foreground">
              {totalSelected} selected • {totalNodes} nodes • ${totalPrice}
            </div>
          </div>

          {/* Workflows List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Array.from(workflowsByFile.entries()).map(([fileName, fileWorkflows]) => (
              <div key={fileName} className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground px-2">
                  {fileName} ({fileWorkflows.length} workflows)
                </div>
                {fileWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedIds.has(workflow.id) 
                        ? 'bg-primary/5 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedIds.has(workflow.id)}
                        onCheckedChange={() => handleWorkflowToggle(workflow.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{workflow.title}</span>
                          <Badge variant={workflow.status === 'on' ? 'default' : 'secondary'}>
                            {workflow.status === 'on' ? (
                              <><Power className="h-3 w-3 mr-1" /> Active</>
                            ) : (
                              <><PowerOff className="h-3 w-3 mr-1" /> Inactive</>
                            )}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workflow.nodeCount} nodes
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${workflow.price}</div>
                      <div className="text-xs text-muted-foreground">migration cost</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {processedWorkflows.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No workflows found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{totalSelected} Workflows Selected</div>
              <div className="text-muted-foreground">
                Total: {totalNodes} nodes • ${totalPrice} migration cost
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={onCalculate}
              disabled={totalSelected === 0}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}