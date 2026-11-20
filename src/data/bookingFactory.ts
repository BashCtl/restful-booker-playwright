import { faker } from "@faker-js/faker";
import bookingTemplate from "../../request-objects/POST-booking.json";
import { Booking } from "../types/booking";

let counter = 0;
export const uniqueId = (): string =>
  `${Date.now().toString(36)}${(counter++).toString(36)}`;

const toDate = (d: Date) => d.toISOString().slice(0, 10);

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const checkin = faker.date.future({ years: 1 });
  const checkout = faker.date.soon({ days: 14, refDate: checkin });

  return {
    ...structuredClone(bookingTemplate),
    firstname: `${faker.person.firstName()}${uniqueId()}`,
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 1000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: { checkin: toDate(checkin), checkout: toDate(checkout) },
    additionalneeds: faker.helpers.arrayElement([
      "Breakfast",
      "Late checkout",
      "Parking",
    ]),
    ...overrides,
  };
}
