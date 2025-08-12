// Vercel Serverless Function for uploading files to Firebase Storage
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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

  try {
    const { files, customerEmail, orderId } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email is required' });
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

        // Make the file publicly accessible (optional - remove if you want private files)
        await fileRef.makePublic();

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filePath}`;

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type || 'application/json',
          url: publicUrl,
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