import { z } from 'zod';

export const CreateCartSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
});

export const ChangeQuantitySchema = z.object({
  quantity: z.number(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  tags: z.array(z.string()).optional(),
  // Add other fields as necessary
});