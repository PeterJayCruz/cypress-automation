context('Editor Page', () => {
  const testUsername = 'username_'.concat(new Date().valueOf());
  const testEmail = testUsername.concat('@email.com');
  const testPassword = 'test'

  before(() => {
    cy.createNewUser({
        username: testUsername,
        email: testEmail,
        password: testPassword
      })
  });

  beforeEach(() => {
    cy.login({
      email: testEmail,
      password: testPassword
    })
    .visit('/editor');
  });

  it('creates a new article with a tag', () => {
    const articleTitle = 'Article Title_'.concat(new Date().valueOf());

    cy.get('input[placeholder="Article Title"]')
      .type(articleTitle)
      .get('input[placeholder="What\'s this article about?"]')
      .type('About this article')
      .get('textarea[placeholder="Write your article (in markdown)"]')
      .type('body content')
      .get('input[placeholder="Enter tags"]')
      .type('tag1{enter}')
      .get('button')
      .click()
      .url()
      .should('contains', articleTitle.toLowerCase().replace(' ', '-'));
  });

  it('creates a new article without a tag', () => {
    const articleTitle = 'Article Title_'.concat(new Date().valueOf());

    cy.get('input[placeholder="Article Title"]')
      .as('article title')
      .type(articleTitle)
      .get('input[placeholder="What\'s this article about?"]')
      .type('About this article')
      .get('textarea[placeholder="Write your article (in markdown)"]')
      .type('body content')
      .get('button')
      .click()
      .url()
      .should('contains', articleTitle.toLowerCase().replace(' ', '-'));
  });
});
