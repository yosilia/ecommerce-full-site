import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/db';
import { authOptions } from './[...nextauth]';

async function getAdminEmails() {
  const client = await clientPromise;
  const db = client.db();
  const admins = await db.collection('admins').find().toArray();
  return admins.map((admin) => admin.email);
}

export async function isAdminValid(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    res.status(403).json({ error: 'Unauthorized' });
    throw new Error('Unauthorized access');
  }

  const adminEmails = await getAdminEmails();
  if (!adminEmails.includes(session.user.email)) {
    res.status(403).json({ error: 'Not an Authorized Admin' });
    throw new Error('Not an Authorized Admin');
  }
}
