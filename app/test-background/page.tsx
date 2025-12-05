'use client';

import Image from 'next/image';

export default function TestBackground() {
  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <h1 className="text-white text-2xl mb-4">Background Image Test</h1>
      
      <div className="space-y-4">
        <div>
          <p className="text-white mb-2">Direct Image:</p>
          <Image 
            src="/background-pattern.png" 
            alt="Background Pattern" 
            width={800}
            height={600}
            className="w-full max-w-md border-2 border-white"
            onError={(e) => {
              console.error('Image failed to load');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => console.log('Image loaded successfully')}
          />
        </div>
        
        <div className="text-white">
          <p>If you see the image above, the file path is correct.</p>
          <p>If not, check:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>File exists in public/background-pattern.png</li>
            <li>File name is exactly &quot;background-pattern.png&quot;</li>
            <li>Browser console for errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

