import React, { useState } from 'react';
import { FileUp, Send, Download, Loader2, Brain, FileText, Sparkles } from 'lucide-react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import { toast } from 'react-hot-toast';
import { processPdf, downloadExcel } from './api';
import { ProcessedData } from './types';

registerAllModules();

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProcessedData[]>([]);
  const [step, setStep] = useState<'upload' | 'process' | 'results'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setFile(selectedFile);
    setStep('process');
  };

  const handleProcess = async () => {
    if (!file || !prompt) {
      toast.error('Please upload a PDF and enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await processPdf(file, prompt);
      if (response.success && response.data) {
        setData(response.data);
        setStep('results');
        toast.success('PDF processed successfully by AI');
      }
    } catch (error) {
      toast.error('Error processing PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadExcel(data);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'intellidocs-export.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      toast.error('Error downloading Excel file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Intellidocs</h1>
          <p className="text-lg text-gray-600">Transform your PDFs into structured data using AI</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === 'upload' ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className="rounded-full bg-white p-2 shadow-md">
                <FileUp className="w-6 h-6" />
              </div>
              <span className="ml-2 font-medium">Upload</span>
            </div>
            <div className="h-px w-12 bg-gray-300" />
            <div className={`flex items-center ${step === 'process' ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className="rounded-full bg-white p-2 shadow-md">
                <Brain className="w-6 h-6" />
              </div>
              <span className="ml-2 font-medium">Process</span>
            </div>
            <div className="h-px w-12 bg-gray-300" />
            <div className={`flex items-center ${step === 'results' ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className="rounded-full bg-white p-2 shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <span className="ml-2 font-medium">Results</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transition-all duration-300">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1">
                  <div className={`flex items-center justify-center w-full px-6 py-4 border-2 border-dashed rounded-lg 
                    ${file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-indigo-400'} 
                    transition-all duration-300 cursor-pointer`}>
                    {file ? (
                      <div className="flex items-center text-green-600">
                        <FileText className="w-6 h-6 mr-2" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-600">
                        <FileUp className="w-8 h-8 mb-2 text-gray-400" />
                        <span className="font-medium">Drop your PDF here or click to browse</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Processing Instructions
            </label>
            <div className="relative">
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tell the AI how to process your PDF (e.g., 'Extract all requirements and categorize them by section')"
              />
              <Sparkles className="absolute right-3 top-3 w-5 h-5 text-indigo-400 opacity-50" />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleProcess}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Process with AI
                </>
              )}
            </button>
          </div>
        </div>

        {data.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  AI Processing Results
                </h2>
                <p className="text-sm text-gray-500">
                  Edit the data directly in the table below
                </p>
              </div>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-300"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Excel
              </button>
            </div>
            
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <HotTable
                data={data}
                colHeaders={['Section', 'Requirements']}
                columns={[
                  { data: 'section' },
                  { data: 'requirements' }
                ]}
                width="100%"
                height={400}
                licenseKey="non-commercial-and-evaluation"
                className="font-sans"
                stretchH="all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;