import type { getCalApi } from "@calcom/embed-react";
import {
  buildDatafastMetadata,
  readCurrentAttribution,
  trackDatafastGoal,
} from "./datafast-client";

type CalApi = Awaited<ReturnType<typeof getCalApi>>;

/** Which Cal.com embed the visitor booked through. */
export type BookingVia = "popup" | "call_page";

/**
 * Sends the booking funnel goals to DataFast for one Cal.com embed namespace:
 * book_call_opened once the booker has loaded, call_booked once a booking is
 * confirmed. DataFast ties both to the visitor, so they break down by the
 * visit's referrer and channel. Returns a cleanup that removes the listeners.
 */
export function trackCalBookingGoals(cal: CalApi, via: BookingVia) {
  const metadata = () => ({
    ...buildDatafastMetadata(readCurrentAttribution()),
    booking_via: via,
  });
  const onOpened = () => trackDatafastGoal("book_call_opened", metadata());
  const onBooked = () => trackDatafastGoal("call_booked", metadata());

  cal("on", { action: "linkReady", callback: onOpened });
  cal("on", { action: "bookingSuccessfulV2", callback: onBooked });

  return () => {
    cal("off", { action: "linkReady", callback: onOpened });
    cal("off", { action: "bookingSuccessfulV2", callback: onBooked });
  };
}
