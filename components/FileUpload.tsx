
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onStart: (prompt: string, file: File) => void;
  isRunning: boolean;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onStart, isRunning }) => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('Run a standard external aerodynamics simulation on this CAD model.');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
    }
  };
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a geometry file to upload.');
      return;
    }
    if (!prompt) {
      setError('Please provide a simulation prompt.');
      return;
    }
    onStart(prompt, file);
  }, [file, prompt, onStart]);

  return (
    <div className="w-full max-w-2xl text-center">
      <div className="bg-gray-800/60 backdrop-blur-md border-2 border-dashed border-gray-600 rounded-xl p-8 shadow-2xl transition-colors duration-300 hover:border-blue-500/80">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadIcon />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="font-semibold text-blue-400 hover:text-blue-300">Upload a file</span>
              <span className="text-gray-400"> or drag and drop</span>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".step,.iges,.stl" />
            <p className="text-xs text-gray-500">.step, .iges, .stl up to 100MB</p>
            {file && <p className="text-sm text-green-400 mt-2">Selected: {file.name}</p>}
          </div>

          <div className="mt-6 text-left">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Simulation Prompt
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={3}
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Run a standard external aerodynamics simulation..."
            />
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isRunning || !file}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isRunning && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isRunning ? 'Processing...' : 'Start Simulation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};