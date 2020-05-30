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

  const getComments = (articleUriPath) => {
    return new Promise((resolve) => {
      cy.request({
        log: false,
        method: 'GET',
        url: `${Cypress.env('backEndBaseUrl')}/articles/${articleUriPath}/comments`,
      })
      .its('body.comments', {
        log: false
      })
      .then((commentsResponse) => {
        const log = Cypress.log({
          name: 'getComments',
          displayName: 'get comments',
          message: articleUriPath,
          consoleProps: () => {
            return {
              'Comments API response': commentsResponse,
              'Article Path (input)': articleUriPath
            };
          }
        });

        resolve(commentsResponse);
      });
    });
  };

  context('positive', () => {
    context ('logged in as author', () => {
      let article = {};
      let user = {};

      before(() => {
        cy.createUser({})
          .its('body.user')
          .then((userResponse) => {
            user = userResponse;
            user.authHeaderToken = 'Token '.concat(userResponse.token);

            cy.createArticle({
              description: 'description_'.concat(new Date().valueOf()),
              body: 'body_'.concat(new Date().valueOf()),
              tagList: []
            }, user.authHeaderToken)
            .its('body.article')
            .then((articleResponse) => {
              article = articleResponse;
              article.path = articleResponse.title.toLowerCase().replace(/ /g, '-');
            });
          });
      });

      beforeEach(() => {
        cy.login(user)
        .visit(`/article/${article.path}`);
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
          .should('contain', `/editor/${article.path}`);
      });

      it('deletes the article', () => {
        cy.server()
          .route({
            method: 'DELETE',
            url: `${Cypress.env('backEndBaseUrl')}${Cypress.env('articlesApi')}/${article.path}`
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
      let article = {};
      let user = {};

      before(() => {
        cy.createUser({})
          .its('body.user', {
            log:false
          })
          .then((userResponse) => {
            user = userResponse;
            user.authHeaderToken = 'Token '.concat(userResponse.token);

            cy.createArticle({
              description: 'description_'.concat(new Date().valueOf()),
              body: 'body_'.concat(new Date().valueOf()),
              tagList: []
            }, user.authHeaderToken)
            .its('body.article', {
              log: false
            })
            .then((articleResponse) => {
              article = articleResponse;
              article.path = articleResponse.title.toLowerCase().replace(/ /g, '-');

              for(let i = 0; i < 5; i += 1) {
                addComment(user.authHeaderToken, {
                  articleTitle: article.path,
                  body: 'comment_'.concat((i+1).toString())
                });
              }
            });
          });
      });

      beforeEach(() => {
        cy.visit(`/article/${article.path}`);
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

      it('displays all of the article\'s comments', () => {
        getComments(article.path).then(comments => {
          cy.get('.card').then((commentCards) => {
            expect(comments.length).to.equal(commentCards.length);

            for(let i = 0; i < commentCards.length; i += 1) {
              expect(commentCards[i].children[0].innerText).to.equal(comments[i].body);
              expect(commentCards[i].children[1].children[1].innerText).to.equal(comments[i].author.username);

              const createdDate = new Date(comments[i].createdAt).toString().slice(0, 15);
              expect(commentCards[i].children[1].children[2].innerText).to.equal(createdDate);
            }
          });
        });
      });
    });
  });
});
