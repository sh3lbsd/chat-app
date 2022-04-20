// boilerplate code to configure access to real time database
const admin = require('firebase-admin');

// only inititialize app if it has not already been initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// export database at the url below to be used by other files
export default admin
  .app()
  .database('https://shelby-davis-portfolio-default-rtdb.firebaseio.com/');
