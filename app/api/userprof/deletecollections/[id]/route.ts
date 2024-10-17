import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req; // Get the HTTP method

    if (method === 'DELETE') {
        const { id } = req.query; // Capture `id` from query parameters

        if (!id) {
            return res.status(400).json({ error: 'Missing collection ID' });
        }

        try {
            await prisma.collection.delete({
                where: {
                    id: Number(id), // Ensure the ID is a number
                },
            });
            return res.status(200).json({ msg: "Deleted" });
        } catch (error) {
            console.error("Error deleting collection:", error);
            return res.status(500).json({ error: 'Error deleting collection' });
        }
    } else {
        // Handle other methods or return a method not allowed response
        res.setHeader('Allow', ['DELETE']); // Specify allowed methods
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
