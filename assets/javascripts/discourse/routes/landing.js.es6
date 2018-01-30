import showModal from 'discourse/lib/show-modal';
import computed from 'ember-addons/ember-computed-decorators';

export default Discourse.Route.extend({
  model() {
    return Ember.RSVP.hash({
      places: this.site.get('categories'),
      petitions: this.store.findFiltered('topicList', { filter: 'c/petitions/place' })
    });
  },

  @computed()
  templateName() {
    return this.get('routeName').split('landing')[1].toLowerCase();;
  },

  setupController(controller, model) {
    const templateName = this.get('templateName');
    controller.set('contentClass', templateName);

    this.controllerFor('application').set('hideHeaderSearch', true);

    if (templateName === 'start') {
      const placeLocations = model.places.filter((c) => c.place && c.place_can_join)
                                         .map((t) => t.location);
      const petitionLocations = model.petitions.topics.reduce((locations, t) => {
        if (t.location) locations.push(t.location);
        return locations;
      }, []);
      const locations = placeLocations.concat(petitionLocations);

      this.controllerFor('start').set('locations', locations);
      this.controllerFor('application').set('canSignUp', false);
    }

    // so the login-buttons element isn't added,
    // otherwise there is an element id conflict with login modal
    if (templateName === 'start' || templateName === 'citizens') {
      this.controllerFor('create-account').set('hasAuthOptions', true);
    }
  },

  actions: {
    contact(type) {
      showModal('landing-contact-modal', {
        model: { type }
      });
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
