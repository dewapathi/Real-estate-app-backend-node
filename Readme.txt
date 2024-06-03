//lib
npm init -y
npm i express
npm i nodemon
npm i bcrypt
npm i cookie-parser
npm i jsonwebtoken
openssl rand -base64 32
npm install dotenv --save-dev
npm i cors
npm i mongoose

//prisma db
npm i prisma
npx prisma init --datasource-provider mongodb
npx prisma db push - this command should use when i change something in prisma schema
npm i @prisma/client


//Extentions
Console Ninja
Prisma

//app run Commands
npm start
console-ninja node --watch app.js - this is not working due to an issue
node --watch app.js - this is working