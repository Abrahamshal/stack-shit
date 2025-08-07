import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calculator, CheckCircle, Calendar, X } from 'lucide-react';
import { useWorkflowAnalyzer } from '@/hooks/useWorkflowAnalyzer';
import { WorkflowUploader } from '@/components/shared/WorkflowUploader';

const QuoteCalculator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    uploadedFiles,
    totalNodeCount,
    isAnalyzing,
    estimatedPrice,
    handleFileUpload,
    resetAnalysis,
    removeFile,
  } = useWorkflowAnalyzer();

  const calculateQuote = () => {
    setIsCalculating(true);
    setTimeout(() => {
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
    resetAnalysis();
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
            <WorkflowUploader
              onFileSelect={handleFileUpload}
              multiple={true}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="space-y-1">
                  {uploadedFiles.map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 text-sm p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>{item.file.name}</span>
                        <span className="text-muted-foreground">({item.nodeCount} nodes)</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove ${item.file.name}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Node Count Display */}
            {totalNodeCount > 0 && (
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Nodes Detected:</span>
                  <span className="text-2xl font-bold text-primary">{totalNodeCount}</span>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <Button 
              onClick={calculateQuote}
              disabled={totalNodeCount === 0 || isCalculating || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isCalculating ? (
                <>
                  <Calculator className="mr-2 animate-spin" size={20} />
                  Calculating...
                </>
              ) : isAnalyzing ? (
                <>
                  <Calculator className="mr-2 animate-pulse" size={20} />
                  Analyzing Files...
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
                Based on {totalNodeCount} nodes at $20 per node
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Migration Cost</p>
                <p className="text-4xl font-bold text-primary">
                  ${estimatedPrice.toLocaleString()}
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