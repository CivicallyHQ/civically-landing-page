import { observes } from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  init() {
    this._super();
    this.positionContact();
  },

  @observes('application.currentPath')
  positionContact() {
    if (!this.site.mobileView) {
      Ember.run.scheduleOnce('afterRender', () => {
        const $contact = $('.landing-page .contact');
        const offset = $('#main-outlet').offset().left;
        $contact.css('left', offset);
      });
    }
  },

  actions: {
    scrollToMap() {
      const $map = $('.locations-map');
      const $body = $('html, body');
      $body.animate({
        scrollTop: $map.offset().top - 110
      }, 500);
    }
  }
});
