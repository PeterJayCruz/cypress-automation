// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('createNewUser', (options) => {
  cy.request({
    log: false,
    method: 'POST',
    url: `${Cypress.env('backEndBaseUrl')}${Cypress.env('usersApi')}`,
    body: {
      user: {
        username: options.username,
        email: options.email,
        password: options.password
      }
    }
  });

  const log = Cypress.log({
    name: 'createNewUser',
    displayName: 'create new user' ,
    message: options.email,
    consoleProps: () => {
      return {
        'Options': options,
        'Storage': window.localStorage
      };
    }
  });
});

Cypress.Commands.add('login', (options) => {
  cy.request({
    log: false,
    method: 'POST',
    url: `${Cypress.env('backEndBaseUrl')}${Cypress.env('loginApi')}`,
    body: {
      user: {
        email: options.email,
        password: options.password
      }
    }
  })
  .then((response) => {
    window.localStorage.setItem('jwt', response.body.user.token);

    const log = Cypress.log({
      name: 'login',
      displayName: 'login as user' ,
      message: options.email,
      consoleProps: () => {
        return {
          'Options': options,
          'Storage': window.localStorage
        };
      }
    });
  });
});
