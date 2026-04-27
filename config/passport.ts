import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

export const setupPassport = (authService) => {
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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    done(null, { id });
  });
};
