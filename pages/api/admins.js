import clientPromise from '../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
//import { isAdminValid } from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const client = await clientPromise;
  const db = client.db();
  //await isAdminValid(req, res);
  

  if (req.method === 'GET') {
    const admins = await db.collection('admins').find().toArray();
    return res.status(200).json(admins);
  }

  if (req.method === 'POST') {
    const { email } = req.body;
    await db.collection('admins').insertOne({ email });
    return res.status(201).json({ message: 'Admin added' });
  }

  if (req.method === 'DELETE') {
    const { email } = req.body;
    await db.collection('admins').deleteOne({ email });
    return res.status(200).json({ message: 'Admin removed' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
