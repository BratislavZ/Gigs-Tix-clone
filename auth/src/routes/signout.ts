import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  console.log('signout');

  res.send({});
});

export { router as signoutRouter };
