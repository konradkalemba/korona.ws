# Contributing

All contributions are welcome, whether it is a new feature or code refactoring, it doesn't matter.

Thanks for wanting to contribute. After you are done with your contribution [create a pull request](https://github.com/konradkalemba/korona.ws/pulls) and wait for an approval. :)

## Project Setup

To run the project in your local environment:

- [Install Node.js](https://nodejs.org/en/download/)
- [Fork the project](https://guides.github.com/activities/forking/#fork)

Then in your terminal:

- `cd path/to/project/directory`
- `yarn install`

In the project's root directory add `.env` file with the following content:

```
REACT_APP_FIREBASE_API_KEY="AIzaSyCPS3X5r_4yRqpOzjA4C5VbhQJTF7Yix4U"
REACT_APP_FIREBASE_AUTH_DOMAIN="korona-ws.firebaseapp.com"
REACT_APP_FIREBASE_DATABASE_URL="https://korona-ws.firebaseio.com"
REACT_APP_FIREBASE_PROJECT_ID="korona-ws"
REACT_APP_FIREBASE_APP_ID="1:796612519278:web:615f751de390eb229acd7f"
REACT_APP_FIREBASE_MEASUREMENT_ID="G-ZMLEREM05R"
REACT_APP_STITCH_APP_ID="korona-ws-ddqgu"
REACT_APP_STITCH_SERVICE_NAME="korona-ws-cluster"
REACT_APP_MONGO_DB_NAME="main"
```

Run `yarn start` and that's it!

PS. You can use `npm` instead of `yarn`.
