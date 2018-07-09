import { default as computed, observes, on } from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  @on('init')
  @observes('application.currentPath')
  setup() {
    const path = this.get('application.currentPath');

    $('body').toggleClass('landing', path && path.indexOf('landing') > -1);
  },

  @computed
  topClasses() {
    let classes = 'top';
    if (Discourse.SiteSettings.invite_only) {
      classes += ' invite-only';
    }
    return classes;
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
