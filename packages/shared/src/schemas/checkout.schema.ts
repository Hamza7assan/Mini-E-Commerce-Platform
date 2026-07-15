import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Enter your full name"),
  customerEmail: z.string().email("Enter a valid email"),
  customerPhone: z.string().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
  shippingAddress: z.string().min(10, "Enter your full shipping address"),
  items: z.array(
    z.object({
      productId: z.union([z.string(), z.number()]),
      quantity: z.number().min(1),
      size: z.string(),
      color: z.string(),
    })
  ).min(1, "Cart is empty")
});

// to infer the type of the checkoutSchema
export type CheckoutInput = z.infer<typeof checkoutSchema>;