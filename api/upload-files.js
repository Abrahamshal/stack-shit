// Vercel Serverless Function for uploading files to Firebase Storage
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    // Check for required environment variables
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL', 
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_STORAGE_BUCKET'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error:', error.message);
    console.error('Full error:', error);
  }
}

export default async function handler(req, res) {
  // Configure CORS - ONLY allow your domain
  const allowedOrigins = [
    'https://stack-shit.vercel.app',
    'https://stackshift.com',
    'https://www.stackshift.com',
    process.env.DOMAIN_URL,
    // Only allow localhost in development
    process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : null
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for Firebase configuration early
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL', 
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_STORAGE_BUCKET'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error(`Missing Firebase environment variables: ${missingVars.join(', ')}`);
    return res.status(500).json({ 
      error: 'Firebase Storage not configured',
      details: `Missing environment variables: ${missingVars.join(', ')}. Please configure these in Vercel project settings.`,
      missingVars
    });
  }

  try {
    const { files, customerEmail, orderId } = req.body;

    console.log('Upload request received:', {
      filesCount: files?.length,
      customerEmail,
      orderId,
      hasAdminApp: !!admin.apps.length
    });

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    // Check if Firebase Admin is properly initialized
    if (!admin.apps.length) {
      console.error('Firebase Admin SDK not initialized');
      return res.status(500).json({ 
        error: 'Firebase configuration error',
        details: 'Firebase Admin SDK is not initialized. Check environment variables.'
      });
    }

    console.log(`Uploading ${files.length} files for customer: ${customerEmail}`);

    const bucket = admin.storage().bucket();
    const uploadedFiles = [];

    for (const file of files) {
      try {
        // Extract base64 data
        const base64Data = file.data.split(',')[1]; // Remove data:application/json;base64, prefix
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Create file path
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `customers/${customerEmail}/${fileName}`;
        
        // Create a file reference
        const fileRef = bucket.file(filePath);
        
        // Upload the file
        await fileRef.save(buffer, {
          metadata: {
            contentType: file.type || 'application/json',
            metadata: {
              originalName: file.name,
              customerEmail: customerEmail,
              orderId: orderId || '',
              uploadedAt: new Date().toISOString(),
            },
          },
        });

        // File remains private - no public access
        // Generate a signed URL for internal access only (expires in 7 days)
        const [signedUrl] = await fileRef.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type || 'application/json',
          url: signedUrl, // Temporary signed URL for internal use only
          path: filePath,
          uploadedAt: new Date().toISOString(),
        });

        console.log(`Successfully uploaded: ${file.name}`);
      } catch (fileError) {
        console.error(`Error uploading file ${file.name}:`, fileError);
        // Continue with other files even if one fails
        uploadedFiles.push({
          name: file.name,
          error: fileError.message,
          uploadedAt: new Date().toISOString(),
        });
      }
    }

    console.log(`Upload complete. Successfully uploaded ${uploadedFiles.filter(f => !f.error).length} of ${files.length} files`);

    return res.status(200).json({
      success: true,
      uploadedFiles: uploadedFiles,
      totalUploaded: uploadedFiles.filter(f => !f.error).length,
      totalFailed: uploadedFiles.filter(f => f.error).length,
    });

  } catch (error) {
    console.error('Server error during file upload:', error);
    return res.status(500).json({
      error: 'Failed to upload files',
      details: error.message,
    });
  }
}