var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/app');
var should = chai.should();

chai.use(chaiHttp);

describe('recipes', function() {
    beforeEach((done) => {
        done();     
    });

    describe('GET /recipes', function() {
        it('should get all recipes on GET /recipes', function(done) {
            chai.request(server)
            .get('/recipes')
            .end(function(err,res) {
                res.should.have.status(200);
                res.should.be.a.json;
                res.body.should.be.a('array');
                done();
            });
        })
    });

    describe ('POST /recipes', function() {
        it('should add a recipe on POST /recipes', function(done) {
            chai.request(server)
            .post('/recipes')
            .send({
                name: 'test',
                ingredients: ['1', '2'],
            })
            .end(function(err,res) {
                res.should.have.status(200);
                done();
            });
        })
    });

    describe('PUT /recipes', function() {
        it('should update a recipe on PUT /recipes', async function() {
            // Add a recipe
            const addResponse = await chai
            .request(server)
            .post('/recipes')
            .send({
                name: 'test',
                ingredients: ['1', '2'],
            });
            addResponse.should.have.status(200);
        
            // Get all recipes
            const getResponse = await chai.request(server).get('/recipes');
            getResponse.should.have.status(200);
            getResponse.should.be.a.json;
            getResponse.body.should.be.an('array');
            const recipes = getResponse.body;
        
            // Update a recipe
            const updateResponse = await chai
            .request(server)
            .put(`/recipes/${recipes[0]._id}`)
            .send({
                name: 'updated',
                ingredients: ['1', '2', '3'],
            });
            updateResponse.should.have.status(200);
        });
    });

    describe ('DELETE /recipes', function() {
        it('should delete a recipe on DELETE /recipes', async function() {
            // Add a recipe
            const addResponse = await chai
            .request(server)
            .post('/recipes')
            .send({
                name: 'test',
                ingredients: ['1', '2'],
            });
            addResponse.should.have.status(200);
        
            // Get all recipes
            const getResponse = await chai.request(server).get('/recipes');
            getResponse.should.have.status(200);
            getResponse.should.be.a.json;
            getResponse.body.should.be.an('array');
            const recipes = getResponse.body;
        
            // delete a recipe
            const deletedResponse = await chai
            .request(server)
            .delete(`/recipes/${recipes[0]._id}`);
            deletedResponse.should.have.status(200);
        })
    });
    
});