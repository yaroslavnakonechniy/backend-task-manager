import express, { type Response } from 'express';
import cookieParser from 'cookie-parser';
import session from 'cookie-session';

const app = express();

// Настройка для COOKIE-SESSION (без resave и saveUninitialized)
app.use(session({
  name: 'session',
  keys: ['your-secret-key'], // Используем keys вместо secret
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: false, // в продакшене ставьте true
  sameSite: 'lax'
}));

app.use(cookieParser());

// Cookies
app.get('/set-cookie', (req, res) => {
  res.cookie('user', 'john_doe', { maxAge: 900000, httpOnly: true });
  res.send('Cookie was set');
});

app.get('/get-cookie', (req, res) => {
  const cookieValue = req.cookies.user;
  res.send(`Cookie value: ${cookieValue}`);
});

// Sessions: Просмотры
app.get('/session/page-views', (req, res) => {
  // Инициализируем, если пусто
  req.session!.page_views = (req.session!.page_views || 0) + 1;
  res.send(`You have visited this page ${req.session!.page_views} times`);
});

// Sessions: Корзина
app.get('/session/cart', (req, res) => {
  if (!req.session!.cart) {
    req.session!.cart = [];
  }

  const productId = Math.floor(Math.random() * 5);
  const cartItem = req.session!.cart.find((item: any) => item.productId === productId);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    req.session!.cart.push({ productId, quantity: 1 });
  }

  res.send(`Product added to cart. Current cart: <pre>${JSON.stringify(req.session!.cart, null, 2)}</pre>`);
});

// Удаление сессии (в cookie-session это делается через null)
app.post('/session/destroy', (req, res) => {
  req.session = null; // В cookie-session нет метода destroy()
  res.send('Session cleared successfully');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
