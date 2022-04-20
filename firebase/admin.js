// configure access to real time database

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}
export default admin
  .app()
  .database('https://shelby-davis-portfolio-default-rtdb.firebaseio.com/');
