import prisma from 'config/db.config';
import { NextFunction, Request, Response } from 'express';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, items } = req.body;

  const order = await prisma.order.create({
    data: {
      userId,
      items,
    },
  });

  res.status(201).json({ message: 'Order created successfully', data: order });
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id }, // Assuming you have user authentication middleware
  });

  res.json(orders);
}; 