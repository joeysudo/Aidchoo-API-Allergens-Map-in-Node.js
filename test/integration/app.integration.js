//https://stackoverflow.com/questions/48861967/writing-unit-tests-for-method-that-uses-jwt-token-in-javascript

var expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const app = require('../../app');
//const users = require('../../models/user');
const testUsers = require('./testUsers');

let stub;

describe('integration test', function() {
	describe('getUserByEmail', function() {
		context('check if we can get a user by email', function() {
			it('get user by email', function(done) {
				supertest(app)
				.get('/api/user/email/marker@goodmarks.com')
				.send({})
				.end(function(err, res) {
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.deep.equal(testUsers);
				})
				done();
			})
			it('get invalid email', function(done) {
				supertest(app)
				.get('/api/user/email/hello')
				.send({})
				.end(function(err, res) {
					expect(res.statusCode).to.equal(500);
				})
				done();
			})
		})
	})
	describe('addUser', function() {
		context('check if we can add user', function() {
			it('add empty user', async function() {
				let newUser = {};
                //let newUsers = [...testUsers, newUser];
                const res = await supertest(app)
                    .post('/api/user/register')
                    .send(newUser);

                expect(res.statusCode).to.equal(500);
			})
		})
	})
	describe('getProfile', function() {
		beforeEach(function() {
			stub = sinon.stub(jwt, 'verify').callsFake(() => {
				return Promise.resolve({success: 'Token is valid'});
			})
		})
		
		context('check if we can get a users profile', function() {
			it('check logged in', async function() {
				supertest(app)
				.get('api/user/profile')
				.send({})
				.end(async function(err, res) {
					const testToken = 'test';
					const testSecret = 'test secret';
					const result = await jwt.verify(testToken, testSecret);
					//console.log(result);
					//console.log(typeof result);
					expect(JSON.stringify(result)).to.equal('{"success":"Token is valid"}');
				})
			})
		})
		
		afterEach(function() {
			stub.restore();
		})
		
	})
	
})