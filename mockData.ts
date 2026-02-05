
import { Lead } from './types';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const lastMonth = '2025-04-15';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 1,
    date: today,
    name: "Arjun Sharma",
    mobile: "+91 9876543210",
    occupation: "Business Owner",
    flatType: "3BHK",
    budget: "1.5 Cr",
    source: "Social Media",
    employeeName: "Rohan V.",
    discussion: "Very interested, asked for a site visit this weekend. Budget is flexible.",
    rating: 5
  },
  {
    id: 2,
    date: today,
    name: "Priya Patel",
    mobile: "+91 8765432109",
    occupation: "Software Engineer",
    flatType: "2BHK",
    budget: "85L",
    source: "Walk-in",
    employeeName: "Sanya M.",
    discussion: "Looking for near-possession flats. Liked the 2BHK layout. Will discuss with family.",
    rating: 4
  },
  {
    id: 3,
    date: yesterday,
    name: "Vikram Singh",
    mobile: "+91 7654321098",
    occupation: "Doctor",
    flatType: "4BHK Penthouse",
    budget: "3.2 Cr",
    source: "Broker",
    employeeName: "Rohan V.",
    discussion: "Negotiating on parking space. High intent but price concern mentioned.",
    rating: 4
  },
  {
    id: 4,
    date: today,
    name: "Meera Iyer",
    mobile: "+91 6543210987",
    occupation: "Interior Designer",
    flatType: "3BHK",
    budget: "1.2 Cr",
    source: "Reference",
    employeeName: "Amit K.",
    discussion: "Referred by current resident. Wants to book immediately if layout matches.",
    rating: 5
  },
  {
    id: 5,
    date: lastMonth,
    name: "Rahul Gupta",
    mobile: "+91 5432109876",
    occupation: "Corporate Manager",
    flatType: "2BHK",
    budget: "70L",
    source: "Leaflet",
    employeeName: "Sanya M.",
    discussion: "Just checking prices. No immediate plan. Follow up in 6 months.",
    rating: 2
  },
  {
    id: 6,
    date: today,
    name: "Suresh Reddy",
    mobile: "+91 4321098765",
    occupation: "Real Estate Investor",
    flatType: "Studio",
    budget: "45L",
    source: "Walk-in",
    employeeName: "Amit K.",
    discussion: "Missed the call twice. Need to re-engage.",
    rating: 0
  }
];
