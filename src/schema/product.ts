

import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().positive("Price must be a positive number"),
    tags: z.array(z.string()).optional(),
    description: z.string().min(1, "Description is required"),
    // Add other fields as necessary
  });