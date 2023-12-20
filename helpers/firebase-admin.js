/* global CONFIG */
const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('../capstone-85334-firebase-adminsdk-qswny-a2bfa34de5.json')

/**
 * Initialize Firebase Admin SDK
 */
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: `https://${CONFIG.FIREBASE_DATABASE_NAME}.firebaseio.com`,
  storageBucket: CONFIG.STORAGE_BUCKET
})

module.exports = firebaseAdmin