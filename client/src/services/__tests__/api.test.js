import * as api from '../api';

describe('api service', () => {
  it('exports all required functions', () => {
    expect(typeof api.getDashboardSummary).toBe('function');
    expect(typeof api.getBookings).toBe('function');
    expect(typeof api.createBooking).toBe('function');
    expect(typeof api.getBookingById).toBe('function');
    expect(typeof api.updateBooking).toBe('function');
    expect(typeof api.cancelBooking).toBe('function');
    expect(typeof api.getRoomAvailability).toBe('function');
    expect(typeof api.getDailyRevenueReport).toBe('function');
    expect(typeof api.getStaff).toBe('function');
  });
});
