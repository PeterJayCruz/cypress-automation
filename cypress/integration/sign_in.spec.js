context('Sign In Page', () => {
  const testPassword = 'testPassword';

  beforeEach(() => {
    cy.visit('/login');
  });

  it('signs into an existing user\'s account', () => {
    cy.server()
      .route({
        method: 'POST',
        url: `${Cypress.env('backEndBaseUrl')}${Cypress.env('loginApi')}`
      }).as('login');

    const username = 'username_'.concat(new Date().valueOf());
    const email = username.concat('@email.com');
    const password = 'securePassword'

    cy.createNewUser({
        username: username,
        email: email,
        password: password
      })
      .get('input[type="email"]')
      .type(email)
      .get('input[type="password"]')
      .type(password)
      .get('button')
      .click()

    cy.wait('@login').then((xhr)=> {
      expect(xhr.status).to.equal(200)
    });

    cy.url()
      .should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('navigates to the sign up page when you click the need an account link', () => {
    cy.get('.auth-page')
      .find('a')
      .contains('Need an account?')
      .click()
      .url()
      .should('eq', `${Cypress.config().baseUrl}/register`);
  });

  it('requires an email', () => {
    cy.get('input[type="password"]')
      .type(testPassword)
      .get('button')
      .click()
      .get('.error-messages > li')
      .then((errorMessages) => {
        expect(errorMessages[0].innerText).to.equal('password invalid email or password')
        expect(errorMessages[1].innerText).to.equal('email can\'t be empty')
      });
  });

  it('requires a password', () => {
    cy.get('input[type="email"]')
      .type('email@email.com')
      .get('button')
      .click()
      .get('.error-messages > li')
      .should('have.text', 'password can\'t be emptyinvalid email or password');
  });

  it('requires a valid password', () => {
    const username = 'username_'.concat(new Date().valueOf());
    const email = username.concat('@email.com');

    cy.createNewUser({
        username: username,
        email: email,
        password: 'validPassword'
      })
      .get('input[type="email"]')
      .type(email)
      .get('input[type="password"]')
      .type('invalidPassword')
      .get('button')
      .click()
      .get('.error-messages > li')
      .should('have.text', 'password invalid email or password');
  });
});
