import { useState } from 'react';
import { useWorkflowAnalyzer, WorkflowFile } from '@/hooks/useWorkflowAnalyzer';
import FileUploader from '@/components/shared/FileUploader';
import PricingResults from '@/components/shared/PricingResults';
import StandalonePricingCalculator from '@/components/StandalonePricingCalculator';
import { Button } from '@/components/ui/button';

const QuoteCalculator = () => {
  const [showStandalone, setShowStandalone] = useState(false);
  const {
    uploadedFiles,
    analysisResults,
    isAnalyzing,
    handleFileUpload,
    resetAnalysis,
  } = useWorkflowAnalyzer();

  return (
    <section id="quote-calculator" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
            Instant Migration
            <span className="text-gradient"> Quote Calculator</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your workflow JSON files to get an instant migration cost estimate, or use the standalone calculator for a manual estimate.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showStandalone ? (
            <>
              <FileUploader onFileSelect={handleFileUpload} />
              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <PricingResults analysisResults={analysisResults} />
                  <Button onClick={resetAnalysis} variant="outline" className="w-full mt-4">
                    Start Over
                  </Button>
                </div>
              )}
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => setShowStandalone(true)}>
                  Use Manual Calculator
                </Button>
              </div>
            </>
          ) : (
            <>
              <StandalonePricingCalculator />
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => setShowStandalone(false)}>
                  Use File Uploader
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuoteCalculator;
