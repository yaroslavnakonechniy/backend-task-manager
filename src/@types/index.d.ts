import 'cookie-session';

declare global {
  namespace Express {
    interface Request {
      log?: any;
      session: CookieSessionInterfaces.CookieSessionObject | null;
      user?: User;
    }
    interface User {
      id: string;
      email?: string;
    }
  }
  
  namespace CookieSessionInterfaces {
    interface CookieSessionObject {
      jwt?: string;
      page_views?: number;
      cart?: Array<{ productId: string | number; quantity: number }>;
    }
  }
}

export {};
