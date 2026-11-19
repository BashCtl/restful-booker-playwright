import { z } from "zod";

export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string(),
    checkout: z.string(),
  }),
  additionalneeds: z.string().optional(),
});

export const createBookingResponseSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: bookingSchema,
});

export const bookingIdListSchema = z.array(
  z.object({ bookingid: z.number().int() }),
);

export const authResponseSchema = z.object({ token: z.string().min(1) });
