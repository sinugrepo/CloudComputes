/* global CONFIG */
const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('../edusafety-firebase-adminsdk-uzd2g-8e4eb15ca4')

/**
 * Initialize Firebase Admin SDK
 */
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: `https://${CONFIG.FIREBASE_DATABASE_NAME}.firebaseio.com`,
  storageBucket: CONFIG.STORAGE_BUCKET
})

module.exports = firebaseAdmin