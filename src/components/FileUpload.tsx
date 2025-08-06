import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Calculator, CheckCircle } from 'lucide-react';

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Count occurrences of "id": in the JSON
      const idMatches = text.match(/"id":/g);
      const count = idMatches ? idMatches.length : 0;
      
      setNodeCount(count);
      setEstimatedPrice(Math.max(count * 20, 200)); // Minimum $200
      
    } catch (error) {
      console.error('Error analyzing file:', error);
      alert('Error: Please upload a valid JSON file');
      setUploadedFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setUploadedFile(file);
        analyzeFile(file);
      } else {
        alert('Please upload a JSON file');
      }
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setUploadedFile(file);
        analyzeFile(file);
      } else {
        alert('Please upload a JSON file');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setNodeCount(0);
    setEstimatedPrice(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
              Claim Your
              <span className="text-gradient-premium bg-gradient-to-r from-gold via-gold-light to-accent bg-clip-text text-transparent"> $2.4M Savings</span>
              <br />
              <span className="text-white">Migration Plan</span>
            </h2>
            <p className="text-2xl text-white/90 max-w-3xl mx-auto">
              Upload your current workflow and get your personalized escape plan in 30 seconds
            </p>
          </div>

          <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
            {!uploadedFile ? (
              <div
                className="border-2 border-dashed border-muted hover:border-primary transition-colors rounded-xl p-12 text-center cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Upload Your Workflow JSON</h3>
                <p className="text-muted-foreground mb-6">
                  Drag and drop your exported JSON file or click to browse
                </p>
                <Button variant="cta" size="lg" className="font-bold">
                  Choose Your Workflow File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-lg">
                  <FileText size={24} className="text-accent" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{uploadedFile.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
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
                      <p className="text-3xl font-bold text-primary">{nodeCount}</p>
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
                  <Button variant="outline" onClick={resetUpload} size="lg">
                    Upload Different File
                  </Button>
                  <Button variant="cta" className="px-12 font-bold" size="lg">
                    GET MY COMPLETE $2.4M SAVINGS PLAN
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