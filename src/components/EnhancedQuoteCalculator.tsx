import { useState, useEffect, useRef } from 'react';
import { useEnhancedWorkflowAnalyzer } from '@/hooks/useEnhancedWorkflowAnalyzer';
import PricingResults from '@/components/shared/PricingResults';
import ZapierWorkflowSelector from '@/components/ZapierWorkflowSelector';
import MigrationSavingsDisplay from '@/components/MigrationSavingsDisplay';
import FileManager from '@/components/FileManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileJson, TrendingUp, RefreshCw, ArrowRight, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
// Removed Stripe imports - navigation only now

const EnhancedQuoteCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showSavings, setShowSavings] = useState(false);
  const [showNodeBreakdown, setShowNodeBreakdown] = useState(false);
  const [showZapierSelectorOverride, setShowZapierSelectorOverride] = useState(false);
  const [selectedZapierWorkflows, setSelectedZapierWorkflows] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [hasProcessedZapier, setHasProcessedZapier] = useState(false);
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false);
  
  const {
    analysisResults,
    pendingZapierWorkflows,
    showZapierSelector,
    isAnalyzing,
    handleFileUpload,
    processSelectedZapierWorkflows,
    resetAnalysis,
    clearZapierWorkflows,
    removeWorkflowsByFileName,
    totalNodeCount,
    estimatedPrice,
  } = useEnhancedWorkflowAnalyzer();

  const handleContinueFromZapier = () => {
    // Process selected Zapier workflows
    if (selectedZapierWorkflows.length > 0) {
      // Clear existing Zapier workflows before adding new selections
      clearZapierWorkflows();
      processSelectedZapierWorkflows(selectedZapierWorkflows);
      setHasProcessedZapier(true);
      setShowZapierSelectorOverride(false);
      
      // If we already have other workflows (Make.com), go back to main view
      // Otherwise show node breakdown
      if (analysisResults && analysisResults.workflows.some(w => w.platform !== 'zapier')) {
        setShowNodeBreakdown(false);
      } else {
        setShowNodeBreakdown(true);
      }
    } else {
      // No workflows selected, show a message
      toast({
        title: "No workflows selected",
        description: "Please select at least one workflow to continue",
        variant: "destructive"
      });
    }
  };

  const handleCalculateSavings = () => {
    setShowSavings(true);
  };

  const handleBackToZapierSelection = () => {
    setShowNodeBreakdown(false);
    setShowZapierSelectorOverride(true);
    // Keep the selected workflows so user can edit
  };

  const handleEditZapierSelections = () => {
    // Don't clear workflows yet - let user make changes first
    // Show Zapier selector with current selections
    setShowNodeBreakdown(false);
    setShowSavings(false);
    setShowZapierSelectorOverride(true);
  };

  const handleFilesSelected = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
    handleFileUpload(files);
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    if (fileToRemove) {
      // Remove workflows associated with this file
      removeWorkflowsByFileName(fileToRemove.name);
    }
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFullReset = () => {
    resetAnalysis();
    setShowSavings(false);
    setShowNodeBreakdown(false);
    setShowZapierSelectorOverride(false);
    setSelectedZapierWorkflows([]);
    setUploadedFiles([]);
    setHasProcessedZapier(false);
    
    // Scroll to top of calculator section after reset
    setTimeout(() => {
      if (sectionRef.current) {
        const yOffset = -100;
        const element = sectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  // Removed handleContinueToCheckout - no longer needed

  const handleProceedToCheckout = async () => {
    if (!analysisResults || isPreparingCheckout) return;
    
    setIsPreparingCheckout(true);
    
    try {
      // Store workflow data for Stripe checkout (no customer info needed)
      const checkoutData = {
        amount: estimatedPrice,
        totalNodes: totalNodeCount,
        workflows: analysisResults.workflows,
        files: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })), // Don't store File objects
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      
      // Read files and convert to base64 BEFORE navigating
      if (uploadedFiles.length > 0) {
        console.log('Converting files to base64. File count:', uploadedFiles.length);
        
        try {
          const filesWithData = await Promise.all(uploadedFiles.map((file, index) => {
            return new Promise<any>((resolve, reject) => {
              console.log(`Converting file ${index + 1}/${uploadedFiles.length}: ${file.name}`);
              const reader = new FileReader();
              reader.onloadend = () => {
                console.log(`File converted: ${file.name}, size: ${file.size}`);
                resolve({
                  name: file.name,
                  size: file.size,
                  type: file.type || 'application/json',
                  data: reader.result
                });
              };
              reader.onerror = (error) => {
                console.error(`Error reading file ${file.name}:`, error);
                reject(error);
              };
              reader.readAsDataURL(file);
            });
          }));
          
          console.log('All files converted to base64:', filesWithData.length);
          
          // Store in both sessionStorage and localStorage for redundancy
          console.log('Storing files in sessionStorage...');
          const filesDataStr = JSON.stringify(filesWithData);
          sessionStorage.setItem('uploadedFiles', filesDataStr);
          
          console.log('Storing files in localStorage as backup...');
          localStorage.setItem('uploadedFiles', filesDataStr);
          
          // Verify storage
          const verifySession = sessionStorage.getItem('uploadedFiles');
          const verifyLocal = localStorage.getItem('uploadedFiles');
          console.log('Files stored - sessionStorage:', !!verifySession, 'localStorage:', !!verifyLocal);
          
          if (verifySession) {
            const parsed = JSON.parse(verifySession);
            console.log('Verified files in sessionStorage:', parsed.length, 'files');
          }
        } catch (error) {
          console.error('Error converting files to base64:', error);
          // Still navigate even if file conversion fails
          sessionStorage.setItem('uploadedFiles', JSON.stringify([]));
        }
      } else {
        console.log('No files to upload');
        sessionStorage.setItem('uploadedFiles', JSON.stringify([]));
      }
      
      // Navigate directly to embedded checkout
      console.log('Navigating to checkout...');
      navigate('/checkout-payment');
    } finally {
      setIsPreparingCheckout(false);
    }
  };

  const canContinue = analysisResults && analysisResults.workflows.length > 0;

  // Scroll to section when state changes
  useEffect(() => {
    if (sectionRef.current) {
      const yOffset = -100; // Offset for fixed header
      const element = sectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [showSavings, showNodeBreakdown, showZapierSelectorOverride, analysisResults]);

  // Debug effect to log state changes
  useEffect(() => {
    if (showNodeBreakdown && !analysisResults) {
      console.log('Warning: showNodeBreakdown is true but analysisResults is null');
    }
  }, [showNodeBreakdown, analysisResults]);

  return (
    <section id="enhanced-quote-calculator" className="py-20 bg-muted/50" ref={sectionRef}>
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
          {!showZapierSelector && !showZapierSelectorOverride && !showNodeBreakdown && !showSavings && (
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
                      <PricingResults 
                        analysisResults={analysisResults} 
                        onEditZapier={pendingZapierWorkflows.length > 0 ? handleEditZapierSelections : undefined}
                      />
                      
                      {/* Edit Zapier Workflows Button */}
                      {pendingZapierWorkflows.length > 0 && (
                        <div className="mt-4 flex justify-center">
                          <Button
                            onClick={handleEditZapierSelections}
                            variant="outline"
                            size="default"
                            className="gap-2"
                          >
                            <FileJson className="h-4 w-4" />
                            Edit Zapier Workflow Selections
                          </Button>
                        </div>
                      )}
                      
                      <div className="space-y-4 mt-6">
                        <div className="flex gap-4">
                          <Button 
                            onClick={() => setShowSavings(true)} 
                            size="lg"
                            className="flex-1"
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Calculate Savings
                          </Button>
                          <Button 
                            onClick={handleProceedToCheckout}
                            size="lg"
                            variant="default"
                            className="flex-1"
                            disabled={!canContinue || isPreparingCheckout}
                          >
                            {isPreparingCheckout ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Preparing Checkout...
                              </>
                            ) : (
                              <>
                                Continue to Checkout
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            onClick={handleFullReset}
                            variant="outline"
                            size="default"
                            className="gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Reset Calculator
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add More Files Button and Edit Zapier if not in results yet */}
              {uploadedFiles.length > 0 && (
                <div className="flex justify-center gap-4">
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
                  {/* Show Edit Zapier button here too if no results yet */}
                  {pendingZapierWorkflows.length > 0 && !analysisResults && (
                    <Button
                      onClick={() => setShowZapierSelectorOverride(true)}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                    >
                      <FileJson className="h-4 w-4" />
                      Select Zapier Workflows
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Zapier Workflow Selector */}
          {(showZapierSelector || showZapierSelectorOverride) && !showNodeBreakdown && !showSavings && (
            <>
              <ZapierWorkflowSelector
                workflows={pendingZapierWorkflows}
                onSelectionChange={setSelectedZapierWorkflows}
                onCalculate={handleContinueFromZapier}
                initialSelections={selectedZapierWorkflows}
              />
              {showZapierSelectorOverride && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowZapierSelectorOverride(false);
                      // Return to wherever we came from
                      if (hasProcessedZapier && analysisResults) {
                        // If we have results, go back to main view
                        setShowNodeBreakdown(false);
                      } else {
                        // Otherwise go to node breakdown
                        setShowNodeBreakdown(true);
                      }
                    }}
                  >
                    Cancel Edit
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Node Breakdown Display */}
          {showNodeBreakdown && !showSavings && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileJson className="h-5 w-5" />
                      Node Breakdown
                    </span>
                    {pendingZapierWorkflows.length > 0 && (
                      <Button
                        onClick={handleEditZapierSelections}
                        variant="outline"
                        size="sm"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Edit Zapier Selections
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResults ? (
                    <>
                      <PricingResults 
                        analysisResults={analysisResults} 
                        onEditZapier={pendingZapierWorkflows.length > 0 ? handleEditZapierSelections : undefined}
                      />
                      
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
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Processing your selections...</p>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  )}

                  {analysisResults && (
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
                              setHasProcessedZapier(false); // Reset so new Zapier files can be processed
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
                  )}
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
                {pendingZapierWorkflows.length > 0 && (
                  <Button 
                    onClick={handleEditZapierSelections} 
                    variant="outline" 
                    size="lg"
                  >
                    Edit Zapier Selections
                  </Button>
                )}
                <Button 
                  onClick={handleProceedToCheckout}
                  size="lg"
                  variant="default"
                  disabled={!canContinue || isPreparingCheckout}
                >
                  {isPreparingCheckout ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Preparing Checkout...
                    </>
                  ) : (
                    <>
                      Continue to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
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