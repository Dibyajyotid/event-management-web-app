export interface OverviewStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  newUsers: number;
  newEvents: number;
  newBookings: number;
  revenueInRange: number;
}

export interface CategoryStat {
  _id: string; // category name
  count: number;
}

export interface DailyStat {
  date: string; // or number if timestamp
  bookings: number;
  revenue: number;
}

export interface TopEvent {
  _id: string;
  name: string;
  bookings: number;
  revenue: number;
}

export interface StatsResponse {
  overview: OverviewStats;
  charts: {
    dailyStats: DailyStat[];
    categoryStats: CategoryStat[];
    topEvents: TopEvent[];
  };
}
