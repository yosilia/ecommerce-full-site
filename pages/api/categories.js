import { mongooseConnect } from '../../lib/mongoose';
import Category from '../../models/Category';
//import { isAdminValid } from '@/pages/api/auth/[...nextauth]';

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  //await isAdminValid(req, res);

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'));
  }

  if (method === 'POST') {
    const { name, parentCategory, features } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      features,
    });
    res.json(categoryDoc);
  }
  if (method === 'PUT') {
    const { name, parentCategory, features, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        features,
      }
    );
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json('ok');
  }
}
