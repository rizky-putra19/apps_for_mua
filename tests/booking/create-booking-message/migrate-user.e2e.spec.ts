// import { defineFeature, loadFeature } from 'jest-cucumber';
// import { TestServer, getTestServer } from '../../jestSetupAfterEnv';
// import * as request from 'supertest';
// const feature = loadFeature(
//   'tests/booking/create-booking-message/create-booking-message.feature',
// );

// defineFeature(feature, (test) => {
//   let testServer: TestServer;
//   let httpServer: request.SuperTest<request.Test>;
//   beforeAll(() => {
//     testServer = getTestServer();
//     httpServer = request(testServer.serverApplication.getHttpServer());
//   });
//   test('Migrate from google event', ({ given, when, then }) => {
//     given(/^that my booking id is (\d+)$/, (id) => {
//       console.log(id);
//     });

//     when('I publish the event to migrate booking from legacy', () => {});

//     then('i can see the created booking ID', () => {});
//   });
// });
it('/ (GET)', () => {
  expect(true).toBeTruthy();
});
