import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// Імпортуйте ваш тип сервісу (вкажіть правильний шлях та розширення .js)
import { AuthService } from '../services/auth.js'; 

export const setupPassport = (authService: AuthService) => {
  passport.use(
    'local',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await authService.validateUser(email, password);

          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    done(null, { id });
  });
};
