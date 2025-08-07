import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, CheckCircle } from 'lucide-react';
import { useWorkflowAnalyzer } from '@/hooks/useWorkflowAnalyzer';
import { WorkflowUploader } from '@/components/shared/WorkflowUploader';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const {
    uploadedFiles,
    totalNodeCount,
    isAnalyzing,
    estimatedPrice,
    handleFileUpload,
    resetAnalysis,
  } = useWorkflowAnalyzer();

  // Only show the first uploaded file for this component
  const uploadedFile = uploadedFiles[0];

  const handleSingleFileUpload = (files: FileList) => {
    // Only process the first file
    if (files.length > 0) {
      const firstFile = new FileList();
      // Create a new FileList with just the first file
      const dt = new DataTransfer();
      dt.items.add(files[0]);
      handleFileUpload(dt.files);
    }
  };

  return (
    <section id="contact" className="py-32 bg-gradient-to-br from-primary via-primary-dark to-dark-section">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-3 mb-8">
              <Calculator size={20} className="text-gold" />
              <span className="text-gold font-semibold text-lg">Instant Quote Calculator</span>
            </div>
            <h2 className="font-sora font-bold text-4xl lg:text-6xl mb-8 text-white">
              See Your Exact
              <span className="text-gradient-premium bg-gradient-to-r from-gold via-gold-light to-accent bg-clip-text text-transparent"> Annual Savings</span>
              <br />
              <span className="text-white">In 30 Seconds</span>
            </h2>
            <p className="text-2xl text-white/90 max-w-3xl mx-auto">
              Upload your current workflow and get your personalized escape plan in 30 seconds
            </p>
          </div>

          <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
            {!uploadedFile ? (
              <WorkflowUploader
                onFileSelect={handleSingleFileUpload}
                multiple={false}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                className="rounded-xl p-12"
                buttonText="Choose Your Workflow File"
                description="Drag and drop your exported JSON file or click to browse"
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-lg">
                  <FileText size={24} className="text-accent" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{uploadedFile.file.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {!isAnalyzing && (
                    <CheckCircle size={24} className="text-accent" />
                  )}
                </div>

                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Analyzing your workflow...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-primary/5 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Calculator size={20} className="text-primary" />
                        <h4 className="font-semibold">Nodes Detected</h4>
                      </div>
                      <p className="text-3xl font-bold text-primary">{totalNodeCount}</p>
                    </div>

                    <div className="bg-accent/5 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle size={20} className="text-accent" />
                        <h4 className="font-semibold">Estimated Price</h4>
                      </div>
                      <p className="text-3xl font-bold text-accent">${estimatedPrice}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={resetAnalysis} size="lg">
                    Upload Different File
                  </Button>
                  <Button variant="cta" className="px-12 font-bold" size="lg">
                    GET MY $15K+ ANNUAL SAVINGS PLAN
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileUpload;