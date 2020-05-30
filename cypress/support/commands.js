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
  })
  .then((response) => {
    const log = Cypress.log({
      name: 'createNewUser',
      displayName: 'create new user' ,
      message: options.email,
      consoleProps: () => {
        return {
          'User API response': response,
          'Options': options,
          'Storage': window.localStorage
        };
      }
    });
  });
});

Cypress.Commands.add('createUser', (options = {}) => {
  const defaultUsername = 'username_'.concat(new Date().valueOf());
  const defaultEmail = defaultUsername.concat('@email.com');

  const user = Object.assign({
    username: defaultUsername,
    email: defaultEmail,
    password: Cypress.env('testPassword')
  }, options);

  cy.request({
    log: false,
    method: 'POST',
    url: `${Cypress.env('backEndBaseUrl')}${Cypress.env('usersApi')}`,
    body: {
      user: {
        username: user.username,
        email: user.email,
        password: user.password
      }
    }
  })
  .then((response) => {
    const log = Cypress.log({
      name: 'createUser',
      displayName: 'create user' ,
      message: user.email,
      consoleProps: () => {
        return {
          'User API response': response,
          'Options': options,
          'Storage': window.localStorage
        };
      }
    });
  });
});

Cypress.Commands.add('login', (options = {}) => {
  const user = Object.assign({
    password: Cypress.env('testPassword')
  }, options);

  cy.request({
    log: false,
    method: 'POST',
    url: `${Cypress.env('backEndBaseUrl')}${Cypress.env('loginApi')}`,
    body: {
      user: {
        email: user.email,
        password: user.password
      }
    }
  })
  .then((response) => {
    window.localStorage.setItem('jwt', response.body.user.token);

    const log = Cypress.log({
      name: 'login',
      displayName: 'login as' ,
      message: options.email,
      consoleProps: () => {
        return {
          'Users login API response': response,
          'Options': options,
          'Storage': window.localStorage
        };
      }
    });
  });
});

Cypress.Commands.add('createArticle', (options = {}, token) => {
  const defaultTitle = 'article title_'.concat(new Date().valueOf());
  const defaultDescription = 'test description';
  const defaultBody = 'test body';
  const defaultTag = 'tag_'.concat(new Date().valueOf());

  const article = Object.assign({
    title: defaultTitle,
    description: defaultDescription,
    body: defaultBody,
    tagList: [defaultTag]
  }, options);

  cy.request({
    log: false,
    method: 'POST',
    url: `${Cypress.env('backEndBaseUrl')}${Cypress.env('articlesApi')}`,
    headers: {
      Authorization: token
    },
    body: {
      article: {
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList
      }
    }
  })
  .then((response) => {
    const log = Cypress.log({
      name: 'createArticle',
      displayName: 'create article' ,
      message: article.title,
      consoleProps: () => {
        return {
          'Articles API response': response,
          'Article (input)': article,
          'Options': options,
        };
      }
    });
  });
})
