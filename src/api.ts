import { ApiResponse } from './types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API endpoints with AI processing simulation
export const processPdf = async (file: File, prompt: string): Promise<ApiResponse> => {
  await delay(2000); // Simulate AI processing time
  
  // Mock AI-processed response data
  return {
    success: true,
    data: [
      { 
        section: "Executive Summary",
        requirements: "High-level overview of system capabilities and business objectives"
      },
      {
        section: "Technical Architecture",
        requirements: "Cloud-native infrastructure with microservices architecture"
      },
      {
        section: "Security Requirements",
        requirements: "OAuth2 authentication, role-based access control, data encryption at rest"
      },
      {
        section: "User Interface",
        requirements: "Responsive design, accessibility compliance, dark mode support"
      },
      {
        section: "Integration Points",
        requirements: "REST APIs, event-driven messaging, third-party service connectors"
      }
    ]
  };
};

export const downloadExcel = async (data: any): Promise<Blob> => {
  await delay(1000);
  // In real implementation, this would return an Excel file
  return new Blob(['Mock Excel data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};