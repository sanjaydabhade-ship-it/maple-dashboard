
export interface Lead {
  id: number;
  date: string; // ISO or String format from sheet
  name: string;
  mobile: string;
  occupation: string;
  flatType: string;
  budget: string;
  source: 'Walk-in' | 'Social Media' | 'Broker' | 'Reference' | 'Leaflet';
  employeeName: string;
  discussion: string;
  rating: number; // 0 to 5
  siteVisitStatus?: string; // "done" or "not done"
  status?: string; // "Sold", "Booked", "Open", etc.
}

export type TimePeriod = 'Today' | 'MTD' | 'YTD';

export interface DashboardMetrics {
  socialMedia: number;
  walkins: number;
  reference: number;
  broker: number;
  totalLeads: number; // Sum of the 4 primary categories
  siteVisits: number;
  ratio: number;
  totalSoldNumber: number;
  totalSoldValue: string;
  totalRemainingNumber: number;
  totalRemainingValue: string;
  soldNumberPercent: number;
  soldValuePercent: number;
}
