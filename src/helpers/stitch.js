import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
} from 'mongodb-stitch-browser-sdk';

const {
  REACT_APP_STITCH_APP_ID,
  REACT_APP_STITCH_SERVICE_NAME,
  REACT_APP_MONGO_DB_NAME,
} = process.env;

const client = Stitch.hasAppClient(REACT_APP_STITCH_APP_ID)
  ? Stitch.getAppClient(REACT_APP_STITCH_APP_ID)
  : Stitch.initializeAppClient(REACT_APP_STITCH_APP_ID);

const db = client
  .getServiceClient(RemoteMongoClient.factory, REACT_APP_STITCH_SERVICE_NAME)
  .db(REACT_APP_MONGO_DB_NAME);

async function connect() {
  await client.auth.loginWithCredential(new AnonymousCredential());
}

export { connect, db };
