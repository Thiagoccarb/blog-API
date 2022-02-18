const chai = require('chai');
const chaiHttp = require('chai-http');
const shell = require('shelljs');
const sinon = require('sinon');

const server = require('../app');
const BlogPostService = require('../services/blogPost');
chai.use(chaiHttp);

const { expect } = chai;

describe('Rota /user', () => {
  const ENDPOINT = '/user';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $');
  });
  describe('cria um novo usuário', async () => {
    describe('o corpo da requisição é válido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          displayName: 'Rubinho Barrichello',
          email: 'rubinho@gmail.com',
          password: '123456',
          image: 'https://www.globalframe.com.br/gf_base/empresas/MIGA/imagens/BDA23B2786FD3B7EC65745DC3FA1EE49D31B_barrichello-1.jpg',
        });
      })
      it('Essa requisição deve retornar código de status 201', async () => {
        expect(response).to.have.status(201);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade token', () => {
        expect(response.body).to.have.property('token');
      });
      it('A propriedadedo token não pode ser nula', () => {
        expect(response.body.token).to.not.be.null;
      });
    });
    describe('o corpo da requisição é inválido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          displayName: 'Rubinho Barrichello',
          password: '123456',
          image: 'https://www.globalframe.com.br/gf_base/empresas/MIGA/imagens/BDA23B2786FD3B7EC65745DC3FA1EE49D31B_barrichello-1.jpg',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor "email" is required', () => {
        expect(response.body.message).to.equals('"email" is required');
      });
    });
    describe('o corpo da requisição é inválido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          displayName: 'Rubinho Barrichello',
          email: 'rubinho@gmail.com',
          image: 'https://www.globalframe.com.br/gf_base/empresas/MIGA/imagens/BDA23B2786FD3B7EC65745DC3FA1EE49D31B_barrichello-1.jpg',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor "password" is required', () => {
        expect(response.body.message).to.equals('"password" is required');
      });
    });
    describe('o corpo da requisição é inválido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          displayName: 'Rubin',
          email: 'rubinho@gmail.com',
          password: '123456',
          image: 'https://www.globalframe.com.br/gf_base/empresas/MIGA/imagens/BDA23B2786FD3B7EC65745DC3FA1EE49D31B_barrichello-1.jpg',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor "displayName" length must be at least 8 characters long', () => {
        expect(response.body.message).to.equals('"displayName" length must be at least 8 characters long');
      });
    });
    describe('o corpo da requisição é inválido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          displayName: 'Rubinhooo',
          email: '@gmail.com',
          password: '123456',
          image: 'https://www.globalframe.com.br/gf_base/empresas/MIGA/imagens/BDA23B2786FD3B7EC65745DC3FA1EE49D31B_barrichello-1.jpg',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor "displayName" length must be at least 8 characters long', () => {
        expect(response.body.message).to.equals('"email" must be a valid email');
      });
    });
    describe('o corpo da requisição é válido porém o email já existe', () => {
      let response;
      let secondResponse;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          displayName: 'Rubinhooo',
          email: 'rubens@gmail.com',
          password: '123456',
          image: 'https://www.globalframe.com.br/gf_base/empresas/MIGA/imagens/BDA23B2786FD3B7EC65745DC3FA1EE49D31B_barrichello-1.jpg',
        });
        secondResponse = await chai.request(server).post(ENDPOINT).send({
          displayName: 'Rubinhooo',
          email: 'rubens@gmail.com',
          password: '123456',
          image: 'https://www.globalframe.com.br/gf_base/empresas/MIGA/imagens/BDA23B2786FD3B7EC65745DC3FA1EE49D31B_barrichello-1.jpg',
        });
      })
      it('Essa requisição deve retornar código de status 409', async () => {
        expect(secondResponse).to.have.status(409);
      });
      it('deve retornar um objeto', () => {
        expect(secondResponse.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(secondResponse.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor User already registered', () => {
        expect(secondResponse.body.message).to.equals('User already registered');
      });
    });
  });
});
describe('Rota post /login', () => {
  const ENDPOINT = '/login';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer login', async () => {
    describe('o corpo da requisição é válido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          email: 'lewishamilton@gmail.com',
          password: '123456',
        });
      })
      it('Essa requisição deve retornar código de status 200', async () => {
        expect(response).to.have.status(200);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade token', () => {
        expect(response.body).to.have.property('token');
      });
      it('A propriedadedo token não pode ser nula', () => {
        expect(response.body.token).to.not.be.null;
      });
    });
    describe('o corpo da requisição é inválido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          password: '123456',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor "email" is required', () => {
        expect(response.body.message).to.equals('"email" is required');
      });
    });
    describe('o corpo da requisição é inválido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          email: 'rubinho@gmail.com',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor "password" is required', () => {
        expect(response.body.message).to.equals('"password" is required');
      });
    });
    describe('o corpo da requisição é inválido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          email: '',
          password: '123456',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor "email" is not allowed to be empty', () => {
        expect(response.body.message).to.equals('"email" is not allowed to be empty');
      });
    });
    describe('o corpo da requisição é inválido', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          email: 'rubinho@gmail.com',
          password: '',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor "password" is not allowed to be empty', () => {
        expect(response.body.message).to.equals('"password" is not allowed to be empty');
      });
    });
    describe('o corpo da requisição é válido porém o email não existe', () => {
      let response;
      before(async () => {
        response = await chai.request(server).post(ENDPOINT).send({
          email: 'teste@gmail.com',
          password: '123456',
        });
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('deve retornar um objeto com uma propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('A propriedadedo message tem valor Invalid fields', () => {
        expect(response.body.message).to.equals('Invalid fields');
      });
    });
  });
});
describe('Rota get /user', () => {
  const LOGIN_ENDPOINT = '/login';
  const USER_ENDPOINT = '/user';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição get na rota user', async () => {
    describe('a requisição é feita sem com o token no header', () => {
      let userRequest;

      before(async () => {
        userRequest = await chai.request(server)
          .get(USER_ENDPOINT)
      })
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(userRequest).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(userRequest.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(userRequest.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(userRequest.body.message).to.equals('Token not found');
      });
    });
    describe('a requisição é feita  com um token inválido no header', () => {
      let userRequest;

      before(async () => {
        userRequest = await chai.request(server)
          .get(USER_ENDPOINT)
          .set('authorization', 'invalidtoken')
      })
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(userRequest).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(userRequest.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(userRequest.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(userRequest.body.message).to.equals('Expired or invalid token');
      });
    });
    describe('a requisição é feita com o token no header', () => {
      let loginRequest;
      let userRequest;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginRequest = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });

        userRequest = await chai.request(server)
          .get(USER_ENDPOINT)
          .set('authorization', token)
      })
      it('Essa requisição deve retornar código de status 200', async () => {
        expect(userRequest).to.have.status(200);
      });
      it('deve retornar um array', () => {
        expect(userRequest.body).to.be.an('array');
      });
      it('o array possui 2 objetos', () => {
        expect(userRequest.body).to.have.length(2);
      });
      it('o objeto possui as propriedades id, displayName, email, image ', () => {
        expect(userRequest.body[0]).to.have.property('id');
        expect(userRequest.body[0]).to.have.property('displayName');
        expect(userRequest.body[0]).to.have.property('email');
        expect(userRequest.body[0]).to.have.property('image');
      });
    });
  });
});
describe('Rota get /user/:id', () => {
  const VALID_ID = 1;
  const INVALID_ID = 100;
  const LOGIN_ENDPOINT = '/login';
  const VALID_USER_ENDPOINT = `/user/${VALID_ID}`;
  const INVALID_USER_ENDPOINT = `/user/${INVALID_ID}`;
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição get na rota user/:id', async () => {
    describe('a requisição é feita sem com o token no header', () => {
      let userRequest;

      before(async () => {
        userRequest = await chai.request(server)
          .get(VALID_USER_ENDPOINT)
      })
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(userRequest).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(userRequest.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(userRequest.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(userRequest.body.message).to.equals('Token not found');
      });
    });
    describe('a requisição é feita  com um token inválido no header', () => {
      let userRequest;

      before(async () => {
        userRequest = await chai.request(server)
          .get(VALID_USER_ENDPOINT)
          .set('authorization', 'invalidtoken')
      })
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(userRequest).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(userRequest.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(userRequest.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(userRequest.body.message).to.equals('Expired or invalid token');
      });
    });
    describe('a requisição é feita com um id inválido', () => {
      let loginRequest;
      let userRequest;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginRequest = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });

        userRequest = await chai.request(server)
          .get(INVALID_USER_ENDPOINT)
          .set('authorization', token)
      })
      it('Essa requisição deve retornar código de status 404', async () => {
        expect(userRequest).to.have.status(404);
      });
      it('deve retornar um objeto', () => {
        expect(userRequest.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(userRequest.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "User does not exist"', () => {
        expect(userRequest.body.message).to.equals('User does not exist');
      });
    });
    describe('a requisição é feita com o token no header', () => {
      let loginRequest;
      let userRequest;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginRequest = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });

        userRequest = await chai.request(server)
          .get(VALID_USER_ENDPOINT)
          .set('authorization', token)
      })
      it('Essa requisição deve retornar código de status 200', async () => {
        expect(userRequest).to.have.status(200);
      });
      it('deve retornar um objeto', () => {
        expect(userRequest.body).to.be.an('object');
      });
      it('o objeto possui as propriedades id, displayName, email, image ', () => {
        expect(userRequest.body).to.have.property('id');
        expect(userRequest.body).to.have.property('displayName');
        expect(userRequest.body).to.have.property('email');
        expect(userRequest.body).to.have.property('image');
      });
    });
  });
});
describe('Rota post /categories', () => {
  const LOGIN_ENDPOINT = '/login';
  const CATEGORIES_ENDPOINT = '/categories';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição post na rota /categories', async () => {
    describe('a requisição é feita sem o token no header', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .post(CATEGORIES_ENDPOINT)
      })
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(response.body.message).to.equals('Token not found');
      });
    });
    describe('a requisição é feita com um token inválido no header', () => {
      let response;

      before(async () => {
        response = await chai.request(server)
          .post(CATEGORIES_ENDPOINT)
          .set('authorization', 'invalidtoken')
      })
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(response.body.message).to.equals('Expired or invalid token');
      });
    });
    describe('a requisição é feita com um body inválido e com token', () => {
      let response;
      let loginResponse;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .post(CATEGORIES_ENDPOINT)
          .set('authorization', token)
          .send({});
      })
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "name is required"', () => {
        expect(response.body.message).to.equals('"name" is required');
      });
    });
    describe('a requisição é feita com o token no header', () => {
      let loginResponse;
      let postResponse;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const category = {
        name: 'TypeScript',
      }
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });

        postResponse = await chai.request(server)
          .post(CATEGORIES_ENDPOINT)
          .set('authorization', token)
          .send(category);
      })
      it('Essa requisição deve retornar código de status 201', async () => {
        expect(postResponse).to.have.status(201);
      });
      it('deve retornar um objeto', () => {
        expect(postResponse.body).to.be.an('object');
      });
      it('o objeto possui as propriedades id, name', () => {
        expect(postResponse.body).to.have.property('id');
        expect(postResponse.body).to.have.property('name');
      });
    });
  });
});
describe('Rota post /post', () => {
  const LOGIN_ENDPOINT = '/login';
  const POST_ENDPOINT = '/post';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição post na rota /post', async () => {
    describe('o corpo da requisição e token são válidos', () => {
      let loginResponse;
      let postResponse;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        title: 'test',
        categoryIds: [1],
        content: 'test',
      }
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        postResponse = await chai.request(server)
          .post(POST_ENDPOINT)
          .set('authorization', token)
          .send(postData);
      });

      it('Essa requisição deve retornar código de status 201', async () => {
        expect(postResponse).to.have.status(201);
      });
      it('deve retornar um objeto', () => {
        expect(postResponse.body).to.be.an('object');
      });
      it('o objeto possui as propriedades id, userId, title, content', () => {
        expect(postResponse.body).to.have.property('id');
        expect(postResponse.body).to.have.property('userId');
        expect(postResponse.body).to.have.property('title');
        expect(postResponse.body).to.have.property('content');
      });
    });
    describe('o corpo da requisição não possui o campo "name"', () => {
      let loginResponse;
      let postResponse;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        categoryIds: [1],
        content: "test",
      }
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        postResponse = await chai.request(server)
          .post(POST_ENDPOINT)
          .set('authorization', token)
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(postResponse).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(postResponse.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(postResponse.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "title is required"', () => {
        expect(postResponse.body.message).to.equals('"title" is required');
      });
    });
    describe('o corpo da requisição não possui o campo "content"', () => {
      let loginResponse;
      let postResponse;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        title: "test",
        categoryIds: [1],
      }
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        postResponse = await chai.request(server)
          .post(POST_ENDPOINT)
          .set('authorization', token)
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(postResponse).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(postResponse.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(postResponse.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "content is required"', () => {
        expect(postResponse.body.message).to.equals('"content" is required');
      });
    });
    describe('o corpo da requisição não possui o campo "categoryIds"', () => {
      let loginResponse;
      let postResponse;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        title: "test",
        content: "test",
      }
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        postResponse = await chai.request(server)
          .post(POST_ENDPOINT)
          .set('authorization', token)
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(postResponse).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(postResponse.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(postResponse.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "categoryIds is required"', () => {
        expect(postResponse.body.message).to.equals('"categoryIds" is required');
      });
    });
    describe('o corpo da requisição não possui o token no headers', () => {
      let postResponse;
      const postData = {
        title: "test",
        content: "test",
      }
      before(async () => {
        postResponse = await chai.request(server)
          .post(POST_ENDPOINT)
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(postResponse).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(postResponse.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(postResponse.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(postResponse.body.message).to.equals('Token not found');
      });
    });
    describe('o corpo da requisição possui o token inválido no headers', () => {
      let postResponse;
      const postData = {
        title: "test",
        content: "test",
      }
      before(async () => {
        postResponse = await chai.request(server)
          .post(POST_ENDPOINT)
          .set('authorization', 'invalidToken')
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(postResponse).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(postResponse.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(postResponse.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(postResponse.body.message).to.equals('Expired or invalid token');
      });
    });
  });
});
describe('Rota get /post', () => {
  const LOGIN_ENDPOINT = '/login';
  const POST_ENDPOINT = '/post';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição get na rota /post', async () => {
    describe('o  token é válido', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .get(POST_ENDPOINT)
          .set('authorization', token)
      });
      it('Essa requisição deve retornar código de status 200', async () => {
        expect(response).to.have.status(200);
      });
      it('deve retornar um array', () => {
        expect(response.body).to.be.an('array');
      });
      it('cada item é um o objeto com as propriedades id, userId, title, content and more...', () => {
        expect(response.body[0]).to.have.property('id');
        expect(response.body[0]).to.have.property('title');
        expect(response.body[0]).to.have.property('content');
        expect(response.body[0]).to.have.property('published');
        expect(response.body[0]).to.have.property('updated');
        expect(response.body[0]).to.have.property('user');
        expect(response.body[0].user).to.have.property('id');
        expect(response.body[0].user).to.have.property('displayName');
        expect(response.body[0].user).to.have.property('email');
        expect(response.body[0].user).to.have.property('image');
        expect(response.body[0]).to.have.property('categories');
        expect(response.body[0].categories[0]).to.have.property('id');
        expect(response.body[0].categories[0]).to.have.property('name');
      });
    });
    describe('o corpo da requisição não possui o token no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .get(POST_ENDPOINT)
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(response.body.message).to.equals('Token not found');
      });
    });
    describe('o corpo da requisição possui o token inválido no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .get(POST_ENDPOINT)
          .set('authorization', 'invalidToken')
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(response.body.message).to.equals('Expired or invalid token');
      });
    });
  });
});
describe('Rota get /post/:id', () => {
  const LOGIN_ENDPOINT = '/login';
  const VALID_POST_ENDPOINT = '/post/1';
  const INVALID_POST_ENDPOINT = '/post/100';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição get na rota /post/:id', async () => {
    describe('o  token é válido e o id existe', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .get(VALID_POST_ENDPOINT)
          .set('authorization', token)
      });
      it('Essa requisição deve retornar código de status 200', async () => {
        expect(response).to.have.status(200);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('cada item é um o objeto com as propriedades id, userId, title, content and more...', () => {
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('content');
        expect(response.body).to.have.property('published');
        expect(response.body).to.have.property('updated');
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.have.property('id');
        expect(response.body.user).to.have.property('displayName');
        expect(response.body.user).to.have.property('email');
        expect(response.body.user).to.have.property('image');
        expect(response.body).to.have.property('categories');
        expect(response.body.categories[0]).to.have.property('id');
        expect(response.body.categories[0]).to.have.property('name');
      });
    });
    describe('o  token é válido e o id não existe', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .get(INVALID_POST_ENDPOINT)
          .set('authorization', token)
      });
      it('Essa requisição deve retornar código de status 404', async () => {
        expect(response).to.have.status(404);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto com a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
    });
    describe('o corpo da requisição não possui o token no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .get(VALID_POST_ENDPOINT)
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(response.body.message).to.equals('Token not found');
      });
    });
    describe('o corpo da requisição possui o token inválido no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .get(VALID_POST_ENDPOINT)
          .set('authorization', 'invalidToken')
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(response.body.message).to.equals('Expired or invalid token');
      });
    });
  });
});
describe('Rota put /post/:id', () => {
  const LOGIN_ENDPOINT = '/login';
  const VALID_POST_ENDPOINT = '/post/1';
  const INVALID_POST_ENDPOINT = '/post/100';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição put na rota /post/:id', async () => {
    describe('o  token é válido e o id existe', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        title: 'test',
        content: 'test',
      };
      const updatedPost = {
        id: 1,
        title: 'test',
        content: 'test',
        userId: 1,
        categories: [
          {
            id: 1,
            name: 'Inovação'
          },
        ],
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .put(VALID_POST_ENDPOINT)
          .set('authorization', token)
          .send(postData)
      });
      it('Essa requisição deve retornar código de status 200', async () => {
        expect(response).to.have.status(200);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o post deve ser atualizado', () => {
        expect(response.body).to.eql(updatedPost);
      });
    });
    describe('o  token é válido e o id não existe', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        title: 'test',
        content: 'test',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .put(INVALID_POST_ENDPOINT)
          .set('authorization', token)
          .send(postData)
      });
      it('Essa requisição deve retornar código de status 404', async () => {
        expect(response).to.have.status(404);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui a mensagem "Post not found"', () => {
        expect(response.body.message).to.equals('Post not found');
      });
    });
    describe('o corpo da requisição não possui o token no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .put(VALID_POST_ENDPOINT)
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(response.body.message).to.equals('Token not found');
      });
    });
    describe('o corpo da requisição possui o token inválido no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .put(VALID_POST_ENDPOINT)
          .set('authorization', 'invalidToken')
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(response.body.message).to.equals('Expired or invalid token');
      });
    });
    describe('o corpo da requisição não possui o item title', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        content: 'test',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .put(VALID_POST_ENDPOINT)
          .set('authorization', token)
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "title is required"', () => {
        expect(response.body.message).to.equals('"title" is required');
      });
    });
    describe('o corpo da requisição não possui o item content', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        title: 'test',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .put(VALID_POST_ENDPOINT)
          .set('authorization', token)
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "content is required"', () => {
        expect(response.body.message).to.equals('"content" is required');
      });
    });
    describe('o corpo da requisição possui o item categoryIds', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'MichaelSchumacher@gmail.com',
        password: '123456',
      };
      const postData = {
        title: 'test',
        content: 'test',
        categoryIds: [1, 2],
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .put(VALID_POST_ENDPOINT)
          .set('authorization', token)
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 400', async () => {
        expect(response).to.have.status(400);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Categories cannot be edited"', () => {
        expect(response.body.message).to.equals('Categories cannot be edited');
      });
    });
    describe('o usuário não tem permissão para atualizar o post', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'MichaelSchumacher@gmail.com',
        password: '123456',
      };
      const postData = {
        title: 'test',
        content: 'test',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .put(VALID_POST_ENDPOINT)
          .set('authorization', token)
          .send(postData);
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Unauthorized user"', () => {
        expect(response.body.message).to.equals('Unauthorized user');
      });
    });
  });
});
describe('Rota delete /post/:id', () => {
  const LOGIN_ENDPOINT = '/login';
  const VALID_POST_ENDPOINT = '/post/1';
  const INVALID_POST_ENDPOINT = '/post/100';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição delete na rota /post/:id', async () => {
    describe('o  token é válido e o id existe', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .delete(VALID_POST_ENDPOINT)
          .set('authorization', token)
      });
      it('Essa requisição deve retornar código de status 204', async () => {
        expect(response).to.have.status(204);
      });
      it('a requisição não deve retornar conteúdo', () => {
        expect(Object.keys(response.body)).to.have.length(0);
      });
    });
    describe('o  token é válido e o id não existe', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      const postData = {
        title: 'test',
        content: 'test',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .delete(INVALID_POST_ENDPOINT)
          .set('authorization', token)
      });
      it('Essa requisição deve retornar código de status 404', async () => {
        expect(response).to.have.status(404);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui a mensagem "Post does not exist"', () => {
        expect(response.body.message).to.equals('Post does not exist');
      });
    });
    describe('o corpo da requisição não possui o token no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .delete(VALID_POST_ENDPOINT)
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(response.body.message).to.equals('Token not found');
      });
    });
    describe('o corpo da requisição possui o token inválido no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .delete(VALID_POST_ENDPOINT)
          .set('authorization', 'invalidToken')
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(response.body.message).to.equals('Expired or invalid token');
      });
    });
    describe('o usuário não tem permissão para apagar o post', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'MichaelSchumacher@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .delete('/post/2')
          .set('authorization', token)
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Unauthorized user"', () => {
        expect(response.body.message).to.equals('Unauthorized user');
      });
    });
  });
});
describe('Rota delete /user/me', () => {
  const LOGIN_ENDPOINT = '/login';
  const USER_ENDPOINT = '/user/me';
  before(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
  });
  describe('ao fazer um requisição delete na rota /user/me', async () => {
    describe('o  token é válido', () => {
      let loginResponse;
      let response;
      let token;
      const userData = {
        email: 'lewishamilton@gmail.com',
        password: '123456',
      };
      before(async () => {
        loginResponse = await chai
          .request(server)
          .post(LOGIN_ENDPOINT)
          .send(userData)
          .then(({ body }) => {
            token = body.token;
          });
        response = await chai.request(server)
          .delete(USER_ENDPOINT)
          .set('authorization', token)
      });
      it('Essa requisição deve retornar código de status 204', async () => {
        expect(response).to.have.status(204);
      });
      it('a requisição não deve retornar conteúdo', () => {
        expect(Object.keys(response.body)).to.have.length(0);
      });
    });
    describe('o corpo da requisição não possui o token no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .delete(USER_ENDPOINT)
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Token not found"', () => {
        expect(response.body.message).to.equals('Token not found');
      });
    });
    describe('o corpo da requisição possui o token inválido no headers', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .delete(USER_ENDPOINT)
          .set('authorization', 'invalidToken')
      });
      it('Essa requisição deve retornar código de status 401', async () => {
        expect(response).to.have.status(401);
      });
      it('deve retornar um objeto', () => {
        expect(response.body).to.be.an('object');
      });
      it('o objeto possui a propriedade message', () => {
        expect(response.body).to.have.property('message');
      });
      it('a propriedade message possui o valor "Expired or invalid token"', () => {
        expect(response.body.message).to.equals('Expired or invalid token');
      });
    });
  });
});
// describe('Rota get post/search?q=:searchTerm', () => {
//   const LOGIN_ENDPOINT = '/login';
//   const TITLE_SEARCH = 'post/search?q=Vamos que vamos';
//   const CONTENT_SEARCH = 'post/search?q=foguete não tem ré';
//   const EMPTY_SEARCH = 'post/search?q=';
//   const INVALID_SEARCH = 'post/search?q=invalid';

//   before(() => {
//     shell.exec('npx sequelize-cli db:drop');
//     shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $ && npx sequelize db:seed:all');
//   });
//   describe('ao fazer um requisição get na "post/search?q=vamos que vamos"', async () => {
//     describe('o  token é válido e o titulo existe', () => {
//       let loginResponse;
//       let response;
//       let token;
//       const userData = {
//         email: 'lewishamilton@gmail.com',
//         password: '123456',
//       };
//       before(async () => {
//         loginResponse = await chai
//           .request(server)
//           .post(LOGIN_ENDPOINT)
//           .send(userData)
//           .then(({ body }) => {
//             token = body.token;
//           });
//         response = await chai.request(server)
//           .get(TITLE_SEARCH)
//           .set('authorization', token)
//       });
//       it('Essa requisição deve retornar código de status 200', async () => {
//         expect(response).to.have.status(200);
//       });
//       it('a requisição é um array', () => {
//         expect(response.body).to.be.an('array');
//       });
//       it('o array é um objeto com várias propriedades', () => {
//         expect(response.body[0]).to.have.property('id');
//         expect(response.body[0]).to.have.property('title');
//         expect(response.body[0]).to.have.property('content');
//         expect(response.body[0]).to.have.property('userId');
//         expect(response.body[0]).to.have.property('published');
//         expect(response.body[0]).to.have.property('updated');
//         expect(response.body[0].user).to.have.property('id');
//         expect(response.body[0].user).to.have.property('displayName');
//         expect(response.body[0].user).to.have.property('email');
//         expect(response.body[0].user).to.have.property('image');
//         expect(response.body[0].categories).to.have.property('id');
//         expect(response.body[0].categories).to.have.property('name');
//       });
//     });
//   });
//   describe('ao fazer um requisição get na "post/search?q=foguete não tem ré"', async () => {
//     describe('o  token é válido e o titulo existe', () => {
//       let loginResponse;
//       let response;
//       let token;
//       const userData = {
//         email: 'lewishamilton@gmail.com',
//         password: '123456',
//       };
//       before(async () => {
//         loginResponse = await chai
//           .request(server)
//           .post(LOGIN_ENDPOINT)
//           .send(userData)
//           .then(({ body }) => {
//             token = body.token;
//           });
//         response = await chai.request(server)
//           .get(TITLE_SEARCH)
//           .set('authorization', token)
//       });
//       it('Essa requisição deve retornar código de status 200', async () => {
//         expect(response).to.have.status(200);
//       });
//       it('a requisição é um array', () => {
//         expect(response.body).to.be.an('array');
//       });
//       it('o array é um objeto com várias propriedades', () => {
//         expect(response.body[0]).to.have.property('id');
//         expect(response.body[0]).to.have.property('title');
//         expect(response.body[0]).to.have.property('content');
//         expect(response.body[0]).to.have.property('userId');
//         expect(response.body[0]).to.have.property('published');
//         expect(response.body[0]).to.have.property('updated');
//         expect(response.body[0].user).to.have.property('id');
//         expect(response.body[0].user).to.have.property('displayName');
//         expect(response.body[0].user).to.have.property('email');
//         expect(response.body[0].user).to.have.property('image');
//         expect(response.body[0].categories).to.have.property('id');
//         expect(response.body[0].categories).to.have.property('name');
//       });
//     });
//   });
// });

