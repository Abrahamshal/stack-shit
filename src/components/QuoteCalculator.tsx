import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Upload, Calculator, CheckCircle, FileJson, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuoteCalculator = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [nodeCount, setNodeCount] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [migrationCost, setMigrationCost] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file => 
      file.type === 'application/json' || file.name.endsWith('.json')
    );

    if (newFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload JSON workflow files",
        variant: "destructive"
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Parse files and count nodes
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          // Simple node counting logic - in real app would be more sophisticated
          const nodes = countNodesInWorkflow(content);
          setNodeCount(prev => prev + nodes);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    });
  }, [toast]);

  const countNodesInWorkflow = (workflow: any): number => {
    // Simplified node counting - in production would handle various workflow formats
    if (workflow.nodes && Array.isArray(workflow.nodes)) {
      return workflow.nodes.length;
    }
    // Fallback for different formats
    return Object.keys(workflow).filter(key => 
      key.includes('node') || key.includes('action') || key.includes('step')
    ).length || 5; // Default estimate
  };

  const calculateQuote = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const cost = nodeCount * 20;
      setMigrationCost(cost);
      setIsCalculating(false);
      setShowResults(true);
    }, 1500);
  };

  const scrollToCalendly = () => {
    const element = document.getElementById('calendly');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setShowResults(false);
  };

  const resetCalculator = () => {
    setUploadedFiles([]);
    setNodeCount(0);
    setMigrationCost(0);
    setShowResults(false);
  };

  return (
    <section id="quote-calculator" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
            Instant Migration 
            <span className="text-gradient"> Quote Calculator</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your workflow JSON files to get an instant migration cost estimate
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-8">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload size={48} className="mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold text-lg mb-2">Upload Your Workflow Files</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop or click to upload JSON workflow files
              </p>
              <input
                type="file"
                multiple
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <FileJson className="mr-2" size={16} />
                    Choose Files
                  </span>
                </Button>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Node Count Display */}
            {nodeCount > 0 && (
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Nodes Detected:</span>
                  <span className="text-2xl font-bold text-primary">{nodeCount}</span>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <Button 
              onClick={calculateQuote}
              disabled={nodeCount === 0 || isCalculating}
              className="w-full"
              size="lg"
            >
              {isCalculating ? (
                <>
                  <Calculator className="mr-2 animate-spin" size={20} />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2" size={20} />
                  Calculate Migration Cost
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results Modal */}
        <Dialog open={showResults} onOpenChange={setShowResults}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-sora">Your Migration Quote</DialogTitle>
              <DialogDescription>
                Based on {nodeCount} nodes at $20 per node
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Migration Cost</p>
                <p className="text-4xl font-bold text-primary">
                  ${migrationCost.toLocaleString()}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5" />
                  <span>Complete workflow analysis & mapping</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5" />
                  <span>Full migration & testing</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5" />
                  <span>30-day post-migration support</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={scrollToCalendly} 
                  className="w-full"
                  size="lg"
                >
                  <Calendar className="mr-2" size={16} />
                  Book Free Strategy Session
                </Button>
                <Button 
                  onClick={resetCalculator} 
                  variant="outline"
                  className="w-full"
                >
                  Calculate Another Quote
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                This is an estimate. Final pricing may vary based on workflow complexity.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default QuoteCalculator;