import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface Node {
  name: string;
  type: string;
}

interface Workflow {
  workflowName: string;
  fileName: string;
  totalNodes: number;
  totalPrice: number;
  nodes: Node[];
}

interface AnalysisSummary {
  totalNodes: number;
  totalPrice: number;
  totalWorkflows: number;
  pricePerNode: number;
  makeCount: number;
  zapierCount: number;
}

interface GroupedWorkflows {
  make?: Workflow[];
  zapier?: Workflow[];
}

interface AnalysisResults {
  workflows: Workflow[];
  groupedWorkflows: GroupedWorkflows;
  summary: AnalysisSummary;
}

interface PricingResultsProps {
  analysisResults: AnalysisResults | null;
  onEditZapier?: () => void;
}

export default function PricingResults({ analysisResults, onEditZapier }: PricingResultsProps) {
  if (!analysisResults) return null;

  const { workflows, groupedWorkflows, summary } = analysisResults;
  const { totalNodes, totalPrice, totalWorkflows, pricePerNode, makeCount, zapierCount } = summary;

  const renderWorkflowGroup = (platformName: string, platformWorkflows: Workflow[] | undefined) => {
    if (!platformWorkflows || platformWorkflows.length === 0) return null;

    const platformNodes = platformWorkflows.reduce((sum, w) => sum + w.totalNodes, 0);
    const platformPrice = platformWorkflows.reduce((sum, w) => sum + w.totalPrice, 0);

    return (
      <div key={platformName}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold capitalize">{platformName} Workflows</h4>
          {platformName.toLowerCase() === 'zapier' && onEditZapier && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditZapier}
              className="gap-2"
            >
              <Edit2 className="h-3 w-3" />
              Edit Selection
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground mb-3">
          {platformWorkflows.length} workflow{platformWorkflows.length !== 1 ? 's' : ''} &bull; {platformNodes} nodes &bull; ${platformPrice}
        </div>

        <Accordion type="single" collapsible className="w-full">
          {platformWorkflows.map((workflow, index) => (
            <AccordionItem value={`item-${index}`} key={`${platformName}-${index}`}>
              <AccordionTrigger>
                <div className="flex justify-between w-full pr-4">
                  <span>{workflow.workflowName || workflow.fileName}</span>
                  <span className="text-primary">{workflow.totalNodes} nodes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-muted-foreground">Cost: {workflow.totalNodes} &times; ${pricePerNode} = ${workflow.totalPrice}</div>
                {workflow.nodes && workflow.nodes.length > 0 && (
                  <ul className="mt-2 pl-5 text-sm text-gray-700 max-h-40 overflow-y-auto">
                    {workflow.nodes.map((node, nodeIndex) => (
                      <li key={`node-${platformName}-${index}-${nodeIndex}`} className="mb-1">
                        {node.name || `Node ${nodeIndex + 1}`} ({node.type})
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Workflow Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="inline-block bg-primary text-primary-foreground rounded-full p-4">
            <div className="text-4xl font-bold">{totalNodes}</div>
          </div>
          <p className="mt-2 font-medium text-lg">Total Nodes</p>
          <p className="text-sm text-muted-foreground">
            {totalWorkflows} workflow{totalWorkflows !== 1 ? 's' : ''}
            {makeCount > 0 && zapierCount > 0 && (
              <span> ({makeCount} Make.com, {zapierCount} Zapier)</span>
            )}
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4">Workflow Breakdown</h3>
          {groupedWorkflows.make || groupedWorkflows.zapier ? (
            <div className="space-y-4">
              {renderWorkflowGroup('Make.com', groupedWorkflows.make)}
              {renderWorkflowGroup('Zapier', groupedWorkflows.zapier)}
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {workflows.map((workflow, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                      <span>{workflow.fileName}</span>
                      <span className="text-primary">{workflow.totalNodes} nodes</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground">Cost: {workflow.totalNodes} &times; ${pricePerNode} = ${workflow.totalPrice}</div>
                    {workflow.nodes && workflow.nodes.length > 0 && (
                       <ul className="mt-2 pl-5 text-sm text-gray-700 max-h-40 overflow-y-auto">
                        {workflow.nodes.map((node, nodeIndex) => (
                          <li key={`node-${index}-${nodeIndex}`} className="mb-1">
                            {node.name || `Node ${nodeIndex + 1}`} ({node.type})
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 mt-6">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-xl font-bold">Total Migration Cost</h3>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">{totalNodes} nodes &times; ${pricePerNode}</div>
            <div className="text-3xl font-bold text-primary">${totalPrice}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
