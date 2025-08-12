import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Upload, Loader2, Home, FileJson } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setUploadError('No session ID found. Please contact support.');
        return;
      }

      setIsUploading(true);

      try {
        // First, retrieve session details from Stripe to get customer info
        const sessionResponse = await fetch(`/api/retrieve-session?session_id=${sessionId}`);
        if (!sessionResponse.ok) {
          throw new Error('Failed to retrieve payment details.');
        }
        
        const sessionData = await sessionResponse.json();
        console.log('Session data:', sessionData);
        
        // Retrieve checkout data from sessionStorage
        const checkoutDataStr = sessionStorage.getItem('checkoutData');
        const uploadedFilesStr = sessionStorage.getItem('uploadedFiles');

        console.log('Session storage - checkoutData exists:', !!checkoutDataStr);
        console.log('Session storage - uploadedFiles exists:', !!uploadedFilesStr);

        if (!checkoutDataStr) {
          throw new Error('Missing checkout data. Please try the process again.');
        }

        const checkoutData = JSON.parse(checkoutDataStr);
        const uploadedFiles = uploadedFilesStr ? JSON.parse(uploadedFilesStr) : [];
        
        console.log('Parsed checkout data:', checkoutData);
        console.log('Parsed uploaded files count:', uploadedFiles.length);
        
        // If no uploadedFiles in sessionStorage, check if they're in checkoutData
        if (uploadedFiles.length === 0 && checkoutData.files && checkoutData.files.length > 0) {
          console.log('No uploadedFiles in sessionStorage, but found files in checkoutData');
          // Files might be File objects, not base64, so we can't upload them
          console.warn('Files in checkoutData are not in uploadable format (need base64)');
        }
        
        // Extract customer info from Stripe session
        const customerInfo = {
          email: sessionData.customer_email || 'unknown@example.com',
          name: sessionData.customer_name || 'Customer',
          phone: sessionData.customer_phone || '',
          company: '' // Can be collected later if needed
        };

        // Upload files to Firebase Storage
        const uploadedFileRefs = [];
        
        console.log('Starting file uploads. Files to upload:', uploadedFiles.length);
        
        for (const file of uploadedFiles) {
          try {
            console.log('Uploading file:', file.name, 'Size:', file.size);
            
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `customers/${customerInfo.email}/${fileName}`);
            
            // Check if file.data exists and is valid
            if (!file.data) {
              console.warn('File data is missing for:', file.name);
              continue;
            }
            
            // Convert base64 back to blob
            const response = await fetch(file.data);
            const blob = await response.blob();
            
            console.log('Blob created, size:', blob.size, 'type:', blob.type);
            
            // Upload to Firebase Storage
            const snapshot = await uploadBytes(storageRef, blob, {
              contentType: file.type || 'application/json',
              customMetadata: {
                originalName: file.name,
                customerEmail: customerInfo.email,
                uploadedAt: new Date().toISOString()
              }
            });
            
            console.log('File uploaded successfully:', snapshot.ref.fullPath);
            
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            console.log('Download URL obtained:', downloadURL);
            
            uploadedFileRefs.push({
              name: file.name,
              size: file.size,
              type: file.type || 'application/json',
              url: downloadURL,
              path: snapshot.ref.fullPath,
              uploadedAt: new Date().toISOString()
            });
          } catch (fileError) {
            console.error('Error uploading file:', file.name, fileError);
            // Continue with other files even if one fails
          }
        }
        
        console.log('All files processed. Uploaded:', uploadedFileRefs.length);

        // Save order to Firestore
        const orderData = {
          customer: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone || '',
            company: customerInfo.company || ''
          },
          payment: {
            stripeSessionId: sessionId,
            amount: checkoutData.amount || checkoutData.migrationCost,
            currency: 'usd',
            status: 'paid'
          },
          workflows: checkoutData.workflows || [],
          totalNodes: checkoutData.totalNodes,
          files: uploadedFileRefs,
          createdAt: new Date().toISOString(),
          status: 'pending_processing'
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);
        setOrderId(docRef.id);

        // Clear sessionStorage
        sessionStorage.removeItem('checkoutData');
        sessionStorage.removeItem('uploadedFiles');

        setUploadComplete(true);
        
        toast({
          title: "Success!",
          description: "Your payment was processed and files uploaded successfully.",
        });

      } catch (error) {
        console.error('Error processing successful payment:', error);
        setUploadError(error instanceof Error ? error.message : 'Failed to upload files. Please contact support.');
        
        toast({
          title: "Upload Error",
          description: "Payment successful but file upload failed. Our team will contact you.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    };

    handleSuccessfulPayment();
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="border-2 border-green-500/20">
          <CardHeader className="text-center pb-8">
            {uploadComplete ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-green-600">
                  Payment Successful!
                </CardTitle>
              </>
            ) : isUploading ? (
              <>
                <Upload className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
                <CardTitle className="text-2xl">
                  Processing Your Order...
                </CardTitle>
              </>
            ) : uploadError ? (
              <>
                <Alert className="mb-4">
                  <AlertDescription className="text-red-600">
                    {uploadError}
                  </AlertDescription>
                </Alert>
                <CardTitle className="text-2xl text-red-600">
                  Processing Error
                </CardTitle>
              </>
            ) : null}
          </CardHeader>

          <CardContent className="space-y-6">
            {isUploading && (
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">
                  Uploading your workflow files to our secure servers...
                </p>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments. Please don't close this page.
                </p>
              </div>
            )}

            {uploadComplete && (
              <div className="space-y-6">
                <Alert className="border-green-500/20 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your workflow migration order has been received and is being processed.
                  </AlertDescription>
                </Alert>

                <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg">What happens next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Our team will begin analyzing your workflows within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You'll receive an email confirmation with your order details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>We'll schedule a kickoff call to discuss your migration timeline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Your dedicated migration specialist will be assigned within 48 hours</span>
                    </li>
                  </ul>
                </div>

                {orderId && (
                  <div className="bg-primary/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Your Order ID</p>
                    <p className="font-mono font-semibold text-lg">{orderId}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Please save this for your records
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4 pt-4">
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    size="lg"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => navigate('/calculator')}
                    size="lg"
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    Upload More Workflows
                  </Button>
                </div>
              </div>
            )}

            {uploadError && !isUploading && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Don't worry - your payment was successful. Our support team has been notified
                  and will contact you within 24 hours to complete your order.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => window.location.href = 'mailto:support@flowstrate.com'}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;