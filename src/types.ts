export interface ProcessedData {
  section: string;
  requirements: string;
  [key: string]: string;
}

export interface ApiResponse {
  success: boolean;
  data?: ProcessedData[];
  error?: string;
}