import prisma from 'config/db.config';
import { NotFoundException } from 'exceptions/not-found';
import { ErrorCodes } from 'exceptions/root';
import { Request, Response } from 'express';
import { z } from 'zod';
import { productSchema } from 'schema/product';

//? ---> Create Product
export const createProduct = async (req: Request, res: Response) => {
  // TODO create validator for this request
  try {
    // Validate the request body
    const validatedData = productSchema.parse(req.body);
    const tags = Array.isArray(validatedData.tags) ? validatedData.tags.join(', ') : '';
    
    if (!validatedData.name) {
      throw new Error('Name is required');
    }
    if (!validatedData.description) {
      throw new Error('Description is required');
    }
    if (validatedData.price === undefined || validatedData.price === null) {
      throw new Error('Price is required');
    }
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        tags: tags,
      },
    });
    res.json(product);
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).json({ errors: err.errors });
    } else {
      // Handle other errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

//? ---> Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(', ').map(tag => tag.trim());;
    }
    const updateProduct = await prisma.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    res.status(200).json({ message: 'Product Updated!', data: updateProduct });
  } catch (err) {
    throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};

//? ---> Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const deleteProduct = await prisma.product.delete({
      where: {
        id: +productId,
      },
    });
    res.status(200).json({ message: `Product ${productId} delete Successfully` });
    console.log(deleteProduct)
  } catch (err) {
    throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};

//? ---> List Products
export const listProducts = async (req: Request, res: Response) => {
  const count = await prisma.product.count();
  const products = await prisma.product.findMany({
    skip: Number(req.query.skip) || 0,
    take: 5,
  });
  res.json({
    count,
    data: products,
  });
};
//? ---> Get ProductById
export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const getProductById = await prisma.product.findFirstOrThrow({
      where: {
        id: +productId,
      },
    });
    res.status(200).json(getProductById);
  } catch (err) {
    throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND);
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      name: {
        search: req.query.q.toString(),
      },
      description: {
        search: req.query.q.toString(),
      },
      tags: {
        search: req.query.q.toString(),
      },
    },
  });
  res.json(products);
};
