import { useState } from 'react';
import { useEnhancedWorkflowAnalyzer } from '@/hooks/useEnhancedWorkflowAnalyzer';
import PricingResults from '@/components/shared/PricingResults';
import ZapierWorkflowSelector from '@/components/ZapierWorkflowSelector';
import MigrationSavingsDisplay from '@/components/MigrationSavingsDisplay';
import FileManager from '@/components/FileManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileJson, TrendingUp, RefreshCw, ArrowRight, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const EnhancedQuoteCalculator = () => {
  const navigate = useNavigate();
  const [showSavings, setShowSavings] = useState(false);
  const [showNodeBreakdown, setShowNodeBreakdown] = useState(false);
  const [selectedZapierWorkflows, setSelectedZapierWorkflows] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const {
    analysisResults,
    pendingZapierWorkflows,
    showZapierSelector,
    isAnalyzing,
    handleFileUpload,
    processSelectedZapierWorkflows,
    resetAnalysis,
    totalNodeCount,
    estimatedPrice,
  } = useEnhancedWorkflowAnalyzer();

  const handleContinueFromZapier = () => {
    // Process selected Zapier workflows and show node breakdown
    if (selectedZapierWorkflows.length > 0) {
      processSelectedZapierWorkflows(selectedZapierWorkflows);
    }
    setShowNodeBreakdown(true);
  };

  const handleCalculateSavings = () => {
    setShowSavings(true);
  };

  const handleBackToZapierSelection = () => {
    setShowNodeBreakdown(false);
    // Keep the selected workflows so user can edit
  };

  const handleFilesSelected = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
    handleFileUpload(files);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    // Note: You may want to also remove associated workflows from analysis
  };

  const handleFullReset = () => {
    resetAnalysis();
    setShowSavings(false);
    setShowNodeBreakdown(false);
    setSelectedZapierWorkflows([]);
    setUploadedFiles([]);
  };

  const handleContinueToCheckout = () => {
    // Store the current state in sessionStorage or context
    const checkoutData = {
      workflows: analysisResults?.workflows || [],
      totalNodes: totalNodeCount,
      migrationCost: estimatedPrice,
      selectedZapierWorkflows,
    };
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    navigate('/checkout');
  };

  const canContinue = analysisResults && analysisResults.workflows.length > 0;

  return (
    <section id="enhanced-quote-calculator" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            {(uploadedFiles.length > 0 || showZapierSelector || showNodeBreakdown || showSavings) && (
              <Button 
                onClick={handleFullReset} 
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Calculator
              </Button>
            )}
          </div>
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
            Instant Migration
            <span className="text-gradient"> Cost & Savings Calculator</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your workflow JSON files to calculate migration costs and discover your potential savings 
            when switching from Zapier or Make.com to n8n.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* File Upload Section */}
          {!showZapierSelector && !showNodeBreakdown && !showSavings && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileJson className="h-5 w-5" />
                      Upload Workflow Files
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <FileManager
                    onFilesSelected={handleFilesSelected}
                    uploadedFiles={uploadedFiles}
                    onRemoveFile={handleRemoveFile}
                  />
                  
                  <Alert className="mt-4">
                    <AlertDescription>
                      <strong>Supported formats:</strong> JSON files from Zapier, Make.com, and n8n.
                      You can upload multiple files and manage them before processing.
                    </AlertDescription>
                  </Alert>

                  {analysisResults && analysisResults.workflows.length > 0 && (
                    <div className="mt-6">
                      <PricingResults analysisResults={analysisResults} />
                      <div className="flex gap-4 mt-6">
                        <Button 
                          onClick={() => setShowSavings(true)} 
                          size="lg"
                          className="flex-1"
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Calculate Savings
                        </Button>
                        <Button 
                          onClick={handleContinueToCheckout}
                          size="lg"
                          variant="default"
                          className="flex-1"
                          disabled={!canContinue}
                        >
                          Continue to Checkout
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add More Files Button */}
              {uploadedFiles.length > 0 && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = '.json';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) handleFilesSelected(files);
                      };
                      input.click();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add More Files
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Zapier Workflow Selector */}
          {showZapierSelector && !showNodeBreakdown && !showSavings && (
            <ZapierWorkflowSelector
              workflows={pendingZapierWorkflows}
              onSelectionChange={setSelectedZapierWorkflows}
              onCalculate={handleContinueFromZapier}
            />
          )}

          {/* Node Breakdown Display */}
          {showNodeBreakdown && !showSavings && analysisResults && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileJson className="h-5 w-5" />
                      Node Breakdown
                    </span>
                    <Button
                      onClick={handleBackToZapierSelection}
                      variant="outline"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                      Back to Selection
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PricingResults analysisResults={analysisResults} />
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Total Migration Summary</h3>
                        <p className="text-muted-foreground">
                          {analysisResults.workflows.length} workflows • {totalNodeCount} total nodes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${estimatedPrice}</p>
                        <p className="text-sm text-muted-foreground">Migration Cost</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = '.json';
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) {
                            handleFilesSelected(files);
                            setShowNodeBreakdown(false);
                          }
                        };
                        input.click();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add More Automations
                    </Button>
                    <Button 
                      onClick={handleCalculateSavings} 
                      size="lg"
                      className="flex-1"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Calculate Savings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Savings Display */}
          {showSavings && analysisResults && (
            <>
              <PricingResults analysisResults={analysisResults} />
              <MigrationSavingsDisplay
                totalNodes={totalNodeCount}
                workflowCount={analysisResults.workflows.length}
                migrationCost={estimatedPrice}
                onContactSales={() => {}}
              />
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={handleFullReset} 
                  variant="outline" 
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
                <Button 
                  onClick={handleContinueToCheckout}
                  size="lg"
                  variant="default"
                  disabled={!canContinue}
                >
                  Continue to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Analyzing workflow files...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default EnhancedQuoteCalculator;