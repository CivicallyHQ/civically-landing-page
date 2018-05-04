import { observes, on } from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  @on('init')
  @observes('application.currentPath')
  setup() {
    if (!this.site.mobileView) {
      Ember.run.scheduleOnce('afterRender', () => {
        const $contact = $('.landing-page .contact');
        const offset = $('#main-outlet').offset().left;
        $contact.css('left', offset);
      });
    }

    const path = this.get('application.currentPath');

    $('body').toggleClass('landing', path.indexOf('landing') > -1);
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
