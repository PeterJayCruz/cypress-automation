context('Article Page', () => {

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
        cy.login({
          email: user.email
        })
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

    });
  });
});
