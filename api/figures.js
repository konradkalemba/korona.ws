import { sum } from '../src/helpers/misc';
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  StitchAppClientConfiguration,
} from 'mongodb-stitch-server-sdk';

const {
  API_KEY,
  REACT_APP_STITCH_APP_ID,
  REACT_APP_STITCH_SERVICE_NAME,
  REACT_APP_MONGO_DB_NAME,
} = process.env;

const client = Stitch.initializeDefaultAppClient(
  REACT_APP_STITCH_APP_ID,
  new StitchAppClientConfiguration.Builder().withDataDirectory('/tmp/').build()
);

const db = client
  .getServiceClient(RemoteMongoClient.factory, REACT_APP_STITCH_SERVICE_NAME)
  .db(REACT_APP_MONGO_DB_NAME);

export default async function handle(request, response) {
  const { query } = request;

  await client.auth.loginWithCredential(new AnonymousCredential());

  if (!query.key || query.key !== API_KEY) {
    response.status(401).send({
      error: 'wrong_api_key',
    });
  } else {
    const deaths = sum(await db.collection('deaths').find().toArray());
    const cases = sum(await db.collection('cases').find().toArray());
    const cures = sum(await db.collection('cures').find().toArray());

    response.send({
      deaths,
      cases,
      cures,
    });
  }
}
