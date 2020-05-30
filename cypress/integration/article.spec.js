context('Article Page', () => {

  const addComment = (token, commentOptions = {}) => {
    const defaultCommentBody = 'comment_'.concat(new Date().valueOf());

    const comment = Object.assign({
      body: defaultCommentBody
    }, commentOptions);

    cy.request({
      log: false,
      method: 'POST',
      url: `${Cypress.env('backEndBaseUrl')}/articles/${comment.articleTitle}/comments`,
      headers: {
        Authorization: token
      },
      body: {
        comment: {
          body: comment.body
        }
      }
    })
    .then((commentsResponse) => {
      const log = Cypress.log({
        name: 'addComment',
        displayName: 'add comment',
        message: comment.body,
        consoleProps: () => {
          return {
            'Comments API response': commentsResponse,
            'Article (input)': comment.articleTitle,
            'Comment (input)': comment.body
          };
        }
      });
    });
  };

  const getComments = (apiPath) => {
    return new Promise((resolve) => {
      cy.request({
        log: false,
        method: 'GET',
        url: `${Cypress.env('backEndBaseUrl')}/articles/${apiPath}/comments`,
      })
      .its('body.comments', {
        log: false
      })
      .then((commentsResponse) => {
        const log = Cypress.log({
          name: 'getComments',
          displayName: 'get comments',
          message: apiPath,
          consoleProps: () => {
            return {
              'Comments API response': commentsResponse,
              'Article (input)': apiPath
              // 'Comment (input)': comment.body
            };
          }
        });

        resolve(commentsResponse);
      });
    });
  };

  context('positive', () => {
    context ('logged in as author', () => {
      let authHeaderToken = 'Token ';
      let article = {};
      let user = {};

      before(() => {
        cy.createUser({})
          .its('body.user')
          .then((userResponse) => {
            user = userResponse;
            cy.createArticle({
              description: 'description_'.concat(new Date().valueOf()),
              body: 'body_'.concat(new Date().valueOf()),
              tagList: []
            }, authHeaderToken.concat(userResponse.token))
            .its('body.article')
            .then((articleResponse) => {
              article = articleResponse;
            });
          });
      });

      beforeEach(() => {
        cy.login(user)
        .visit(`/article/${article.title.toLowerCase().replace(/ /g, '-')}`);
      });

      it('displays the article title', () => {
        cy.get('.banner > div > h1')
          .should('have.text', article.title);
      });

      it('displays the author\'s username', () => {
        cy.get('.info > a')
          .should('have.text', user.username);
      });

      it('displays the article creation date', () => {
        const createdDate = new Date(article.createdAt).toString().slice(0, 15);

        cy.get('.info > span')
          .should('have.text', createdDate);
      });

      it('displays the article body', () => {
        cy.get('.row.article-content > div > div > p')
          .should('have.text', article.body);
      });

      it('navigates to the article\'s editor page', () => {
        cy.get('.ion-edit')
          .click()
          .url()
          .should('contain', `/editor/${article.title.toLowerCase().replace(/ /g, '-')}`);
      });

      it('deletes the article', () => {
        cy.server()
          .route({
            method: 'DELETE',
            url: `${Cypress.env('backEndBaseUrl')}${Cypress.env('articlesApi')}/${article.title.toLowerCase().replace(/ /g, '-')}`
          }).as('deleteArticle');

        cy.get('button')
          .contains('Delete Article')
          .click()
          .wait('@deleteArticle')
          .its('status')
          .should('eq', 204);

        cy.url()
          .should('eq', `${Cypress.config().baseUrl}/`);
      });
    });

    context('not logged in as a user', () => {
      let authHeaderToken = 'Token ';
      let article = {};
      let user = {};
      let articleTitlePath = '';

      before(() => {
        cy.createUser({})
          .its('body.user', {
            log:false
          })
          .then((userResponse) => {
            user = userResponse;
            authHeaderToken = authHeaderToken.concat(userResponse.token);

            cy.createArticle({
              description: 'description_'.concat(new Date().valueOf()),
              body: 'body_'.concat(new Date().valueOf()),
              tagList: []
            }, authHeaderToken)
            .its('body.article', {
              log: false
            })
            .then((articleResponse) => {
              article = articleResponse;
              article.apiPath = articleResponse.title.toLowerCase().replace(/ /g, '-');

              for(let i = 0; i < 5; i += 1) {
                addComment(authHeaderToken, {
                  articleTitle: article.apiPath,
                  body: 'comment_'.concat((i+1).toString())
                });
              }
            });
          });
      });

      beforeEach(() => {
        cy.visit(`/article/${article.apiPath}`);
      });

      it('displays the article title', () => {
        cy.get('.banner > div > h1')
          .should('have.text', article.title);
      });

      it('displays the author\'s username', () => {
        cy.get('.info > a')
          .should('have.text', user.username);
      });

      it('displays the article creation date', () => {
        const createdDate = new Date(article.createdAt).toString().slice(0, 15);

        cy.get('.info > span')
          .should('have.text', createdDate);
      });

      it('displays the article body', () => {
        cy.get('.row.article-content > div > div > p')
          .should('have.text', article.body);
      });

      it('navigates to the register page', () => {
        cy.get('.article-page')
          .find('a')
          .contains('sign up')
          .click()
          .url()
          .should('eq', `${Cypress.config().baseUrl}/register`)
      });

      it('navigates to the sign in page', () => {
        cy.get('.article-page')
          .find('a')
          .contains('Sign in')
          .click()
          .url()
          .should('eq', `${Cypress.config().baseUrl}/login`)
      });
    });
  });
});
