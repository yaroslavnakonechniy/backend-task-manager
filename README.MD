npm i winston
npm i express
npm i express-validator
npm install --save-dev @types/node
npm i multer
npm i axios
npm i dotenv
npm i passport
npm i passport-local
npm i session
npm install --save-dev @types/express
npm i jsonwebtoken
npm install --save-dev @types/express-session
npm install cookie-parser
npm install --save-dev @types/cookie-parser
npm install --save-dev typescript
npx tsc --init
npm install --save-dev @types/passport @types/passport-local
npm i cors
npm install --save-dev @types/cors
npm i helmet
npm i mongodb
npm i --save-dev @types/mongodb
npm i mongoose


node dist/migrations/initial_users_30_04_2026_1777551050777.js
node dist/migrations/initial_boards_30_04_2026_1777551050777.js
node dist/migrations/initial_tasks_30_04_2026_1777551050777.js

Агрегація повертає кількість задач на борді, та кількість виконаних задач на цьому борді
Для перевірки агригації Відкрийте браузе або ПОСТМЕН і зробіть запит:http://localhost:3000/api/v1/boards/statistics