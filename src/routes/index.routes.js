import {Router} from 'express';
const router=Router();

router.get('/', (req, res) => {
    res.render('index');
    req.params.username
});
router.get('/chat', (req, res) => {
  res.render('chat');
});

export default router;