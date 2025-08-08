import { useState } from 'react';
import { useEnhancedWorkflowAnalyzer } from '@/hooks/useEnhancedWorkflowAnalyzer';
import FileUploader from '@/components/shared/FileUploader';
import PricingResults from '@/components/shared/PricingResults';
import ZapierWorkflowSelector from '@/components/ZapierWorkflowSelector';
import MigrationSavingsDisplay from '@/components/MigrationSavingsDisplay';
import StandalonePricingCalculator from '@/components/StandalonePricingCalculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Upload, FileJson, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EnhancedQuoteCalculator = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [showSavings, setShowSavings] = useState(false);
  const [selectedZapierWorkflows, setSelectedZapierWorkflows] = useState<any[]>([]);
  
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

  const handleCalculateSavings = () => {
    // Process selected Zapier workflows first
    if (selectedZapierWorkflows.length > 0) {
      processSelectedZapierWorkflows(selectedZapierWorkflows);
    }
    setShowSavings(true);
  };

  const handleContactSales = () => {
    // Scroll to contact section or open modal
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    resetAnalysis();
    setShowSavings(false);
    setSelectedZapierWorkflows([]);
  };

  return (
    <section id="enhanced-quote-calculator" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
            Instant Migration
            <span className="text-gradient"> Cost & Savings Calculator</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your workflow JSON files to calculate migration costs and discover your potential savings 
            when switching from Zapier or Make.com to n8n.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Manual Calculator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              {/* File Upload Section */}
              {!showZapierSelector && !showSavings && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileJson className="h-5 w-5" />
                      Upload Workflow Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUploader onFileSelect={handleFileUpload} />
                    
                    <Alert className="mt-4">
                      <AlertDescription>
                        <strong>Supported formats:</strong> JSON files from Zapier, Make.com, and n8n.
                        You can upload multiple files at once. Only JSON files are accepted.
                      </AlertDescription>
                    </Alert>

                    {analysisResults && analysisResults.workflows.length > 0 && (
                      <div className="mt-6">
                        <PricingResults analysisResults={analysisResults} />
                        <div className="flex gap-4 mt-4">
                          <Button 
                            onClick={() => setShowSavings(true)} 
                            size="lg"
                            className="flex-1"
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Calculate Savings
                          </Button>
                          <Button 
                            onClick={handleReset} 
                            variant="outline"
                          >
                            Start Over
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Zapier Workflow Selector */}
              {showZapierSelector && !showSavings && (
                <ZapierWorkflowSelector
                  workflows={pendingZapierWorkflows}
                  onSelectionChange={setSelectedZapierWorkflows}
                  onCalculate={handleCalculateSavings}
                />
              )}

              {/* Savings Display */}
              {showSavings && analysisResults && (
                <>
                  <PricingResults analysisResults={analysisResults} />
                  <MigrationSavingsDisplay
                    totalNodes={totalNodeCount}
                    workflowCount={analysisResults.workflows.length}
                    migrationCost={estimatedPrice}
                    onContactSales={handleContactSales}
                  />
                  <div className="flex justify-center mt-6">
                    <Button onClick={handleReset} variant="outline" size="lg">
                      Analyze More Workflows
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
            </TabsContent>

            <TabsContent value="manual">
              <StandalonePricingCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default EnhancedQuoteCalculator;