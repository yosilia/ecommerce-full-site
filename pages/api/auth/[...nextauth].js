import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@auth/mongodb-adapter"; 
import clientPromise from '@/lib/db';

async function getAdminEmails() {
  const client = await clientPromise;
  const db = client.db();
  const admins = await db.collection('admins').find().toArray();
  return admins.map(admin => admin.email); 
}


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session }) {
      return session; // Allow ALL logged-in users as Admin (TEMPORARY for Testing)
    },
  },
};
export default NextAuth(authOptions);


{/*
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session }) {
      const adminEmails = await getAdminEmails();
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

// function to validate if the user is an admin
export async function isAdminValid(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const adminEmails = await getAdminEmails();
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'Not an Authorized Admin';
  }
}
*/}