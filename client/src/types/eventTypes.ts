export type Event = {
  _id: string;
  title: string;
  description: string;
  category:
    | "conference"
    | "workshop"
    | "seminar"
    | "networking"
    | "entertainment"
    | "sports"
    | "other";
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  venue: {
    name: string;
    address?: string;
    city: string;
    state: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  } | null; // 👈 ensures you always have either a venue object or null
  isVirtual: boolean;
  virtualLink?: string;
  startDate: string;
  endDate: string;
  images: string[];
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
    sold: number;
    description?: string;
    benefits?: string[];
  }[];
  tags: string[];
  status: "draft" | "published" | "cancelled" | "completed";
  capacity: number;
  attendees: string[];
  ratings: {
    user: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }[];
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
};
