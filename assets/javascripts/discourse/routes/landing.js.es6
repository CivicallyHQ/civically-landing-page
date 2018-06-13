import computed from 'ember-addons/ember-computed-decorators';

export default Discourse.Route.extend({
  model() {
    this.site.get('categories').filter((c) => c.is_place && c.can_join).map((t) => t.location);
  },

  @computed()
  templateName() {
    return this.get('routeName').split('landing')[1].toLowerCase();;
  },

  setupController(controller, model) {
    const templateName = this.get('templateName');
    this.controllerFor('landing').set('contentClass', templateName);
    this.controllerFor('application').set('hideHeaderSearch', true);

    if (templateName === 'start') {
      controller.set('locations', model);
      this.controllerFor('application').set('canSignUp', false);
    }

    // so the login-buttons element isn't added,
    // otherwise there is an element id conflict with login modal
    if (templateName === 'start' || templateName === 'citizens') {
      this.controllerFor('create-account').set('hasAuthOptions', true);
    }
  },

  renderTemplate() {
    this.render('landing');
    const templateName = this.get('templateName');
    this.render(templateName, {
      into: 'landing',
      outlet: 'content'
    });
    if (templateName === 'start' || templateName === 'citizens') {
      this.render('modal/create-account', {
        into: templateName,
        outlet: 'create-account',
        controller: 'create-account'
      });
    };
  }
});
