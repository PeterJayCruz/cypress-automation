context('Register Page', () => {
  const testPassword = 'testPassword';

  beforeEach(() => {
    cy.visit('/register');
  });

  it('registers a new user', () => {
    cy.server()
      .route({
        method: 'POST',
        url: 'http://localhost:8080/users',
      }).as('users');

    const username = 'username_'.concat(new Date().valueOf());
    const email = username.concat('@email.com');

    cy.get('input[type="text"]')
      .type(username)
      .get('input[type="email"]')
      .type(email)
      .get('input[type="password"]')
      .type(testPassword)
      .get('button')
      .click()

    cy.wait('@users').then((xhr) => {
      expect(xhr.status).to.equal(201);
    });

    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('navigates to the sign in page when you click the have an account link', () => {
    cy.get('.auth-page')
      .find('a')
      .contains('Have an account?')
      .click()
      .url()
      .should('contains', 'login');
  });

  it('requires a username', () => {
    cy.get('input[type="email"]')
      .type('email@email.com')
      .get('input[type="password"]')
      .type(testPassword)
      .get('button')
      .click()
      .get('.error-messages > li')
      .should('have.text', 'username can\'t be empty')
  });

  it('requires an email', () => {
    cy.get('input[type="text"]')
      .type('username')
      .get('input[type="password"]')
      .type(testPassword)
      .get('button')
      .click()
      .get('.error-messages > li')
      .should('have.text', 'email can\'t be empty')
  });

  it('requires a password', () => {
    cy.get('input[type="text"]')
      .type('username')
      .get('input[type="email"]')
      .type('email@email.com')
      .get('button')
      .click()
      .get('.error-messages > li')
      .should('have.text', 'password can\'t be empty')
  });

  it('requires a unique username', () => {
    const duplicateUsername = 'username_'.concat(new Date().valueOf());
    const email = duplicateUsername.concat('@email.com');

    cy.request({
      method: 'POST',
      url: `${Cypress.env('backEndBaseUrl')}/users`,
      body: {
        user: {
          username: duplicateUsername,
          email: email,
          password: testPassword
        }
      }
    });

    cy.get('input[type="text"]')
      .type(duplicateUsername)
      .get('input[type="email"]')
      .type('uniqueEmail@email.com')
      .get('input[type="password"]')
      .type(testPassword)
      .get('button')
      .click()
      .get('.error-messages > li')
      .should('have.text', 'username duplicated username');
  });

  it('requires a unique email', () => {
    const username = 'username_'.concat(new Date().valueOf());
    const duplicateEmail = username.concat('@email.com');

    cy.request({
      method: 'POST',
      url: `${Cypress.env('backEndBaseUrl')}/users`,
      body: {
        user: {
          username: username,
          email: duplicateEmail,
          password: testPassword
        }
      }
    });

    cy.get('input[type="text"]')
      .type('uniqueUsername')
      .get('input[type="email"]')
      .type(duplicateEmail)
      .get('input[type="password"]')
      .type(testPassword)
      .get('button')
      .click()
      .get('.error-messages > li')
      .should('have.text', 'email duplicated email');;
  });
});
