context('Settings Page', () => {
  const testUsername = 'username_'.concat(new Date().valueOf());
  const testEmail = testUsername.concat('@email.com');
  const testPassword = 'test'

  context('Update User Profile Information', () => {
    before(() => {
      cy.createNewUser({
          username: testUsername,
          email: testEmail,
          password: testPassword
        });
    });

    beforeEach(() => {
      cy.login({
        email: testEmail,
        password: testPassword
      })
      .visit('/settings');
    });

    it('updates the profile picture', () => {
      const testImageUrl = 'https://st3.depositphotos.com/3369547/14515/v/1600/depositphotos_145158759-stock-illustration-men-faceless-profile.jpg';

      cy.get('input[placeholder="URL of profile picture"]')
        .clear()
        .type(testImageUrl)
        .get('button')
        .contains('Update Settings')
        .click()

      cy.url()
        .should('eq', `${Cypress.config().baseUrl}/`)
        .get('.user-pic')
        .as('user image')
        .should('have.prop', 'src')
        .and('eq', testImageUrl);
    });

    it('updates the bio', () => {
      cy.get('textarea[placeholder="Short bio about you"]')
        .clear()
        .type('this is a short bio about me')
        .get('button')
        .contains('Update Settings')
        .click()
        .url()
        .should('eq', `${Cypress.config().baseUrl}/`);
    });

    it('logs the user out', () => {
      cy.get('button')
        .contains('Or click here to logout.')
        .click().then(() => {
          expect(window.localStorage.getItem('jwt')).to.equal('');

          cy.url()
            .should('eq', `${Cypress.config().baseUrl}/`)
        });
    });
  });

  context('Update User Login Information', () => {

    beforeEach(() => {
      const uniqueUsername = 'username_'.concat(new Date().valueOf());
      const uniqueEmail = uniqueUsername.concat('@email.com');

      cy.createNewUser({
          username: uniqueUsername,
          email: uniqueEmail,
          password: testPassword
        })
        .login({
          email: uniqueEmail,
          password: testPassword
        })
        .visit('/settings');
    });

    it('updates the username', () => {
      const newUsername = 'newUsername_'.concat(new Date().valueOf());

      cy.get('input[placeholder="Username"]')
        .clear()
        .type(newUsername)
        .get('button')
        .contains('Update Settings')
        .click()
        .url()
        .should('eq', `${Cypress.config().baseUrl}/`);
    });

    it('updates the email', () => {
      const newUsername = 'newUsername_'.concat(new Date().valueOf());
      const newEmail = newUsername.concat('@email.com');

      cy.get('input[placeholder="Email"]')
        .clear()
        .type(newEmail)
        .get('button')
        .contains('Update Settings')
        .click()
        .url()
        .should('eq', `${Cypress.config().baseUrl}/`);
    });

    it('updates the password', () => {
      cy.get('input[placeholder="New Password"]')
        .clear()
        .type('newPassword')
        .get('button')
        .contains('Update Settings')
        .click()
        .url()
        .should('eq', `${Cypress.config().baseUrl}/`);
    });
  });

  context.only('Negative Test Cases', () => {
    const existingUsername = 'username_'.concat(new Date().valueOf());
    const existingEmail = existingUsername.concat('@email.com');

    before(() => {
      cy.createNewUser({
          username: existingUsername,
          email: existingEmail,
          password: testPassword
        });
    });

    beforeEach(() => {
      const anotherUsername = 'username_'.concat(new Date().valueOf());
      const anotherEmail = anotherUsername.concat('@email.com');

      cy.createNewUser({
          username: anotherUsername,
          email: anotherEmail,
          password: testPassword
        })
        .login({
          email: anotherEmail,
          password: testPassword
        })
        .visit('/settings');
    });

    it('requires a unique username', ()=> {
      cy.get('input[placeholder="Username"]')
        .clear()
        .type(existingUsername)
        .get('button')
        .contains('Update Settings')
        .click()
        .get('.error-messages > li')
        .should('have.text', 'username username already exist')
    });

    it('requires a unique email', ()=> {
      cy.get('input[placeholder="Email"]')
        .clear()
        .type(existingEmail)
        .get('button')
        .contains('Update Settings')
        .click()
        .get('.error-messages > li')
        .should('have.text', 'email email already exist')
    });
  });
});
