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

    it.only('updates the email', () => {
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

    it.only('updates the password', () => {
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
});
