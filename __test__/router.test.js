'use strict';

process.env.SECRET = "toes";
const jwt = require('jsonwebtoken');
const server = require('../src/server').server;
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../src/auth/middleware/bearer');

const mockRequest = supergoose(server);

let users = {
  admin: { username: 'admin', password: 'password' },
  editor: { username: 'editor', password: 'password' },
  myuser: { username: 'user', password: 'password' },
};

describe('Auth Router', () => {

  Object.keys(users).forEach(userType => {

    describe(`${userType} users`, () => {

      it('can create one', async () => {
        
        
        const res = await mockRequest.post('/signup').send(users[userType]);
        // expect(res.status).toBe(200);
        // const response = await mockRequest.post('/signup').send(users[userType]);
        const userObject = res.body;
console.log(res.body.user);
        expect(res.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username)

      });

      it('can signin with basic', async () => {
        // let user = { username: 'test', password: 'test' };
        await mockRequest.post('/signup').send(users[userType]);
        
        const res = await mockRequest.post('/signin').set({'authorization':'Basic dGVzdDp0ZXN0'})
        .send(users[userType]);
        // console.log(res.body);
          
        const userObject = res.body;
        expect(res.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username)

      });

      it('can signin with bearer', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMyIsImlhdCI6MTYyNTUwOTczN30.fNQAcS9MZ0g1I_Nne_axWfNzJIEkGCjip0Nsjt1LnXM';
        await mockRequest.post('/signup').set('Authorization', `Bearer ${token}`)
        .send({username:users[userType].username,  password:users[userType].password});
        // First, use basic to login to get a token
        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);

        
        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer ${token}`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(200);

      });

    });

    describe('bad logins', () => {
      it('basic fails with known user and wrong password ', async () => {

        const response = await mockRequest.post('/signin')
          .auth('admin', 'xyz')
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();

      });

      it('basic fails with unknown user', async () => {

        const response = await mockRequest.post('/signin')
          .auth('nobody', 'xyz')
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined()

      });

      it('bearer fails with an invalid token', async () => {

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer foobar`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(403);

      })
    })

  });

});