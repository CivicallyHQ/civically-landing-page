import { default as computed, observes, on } from 'ember-addons/ember-computed-decorators';
import { peopleBannerUrl } from 'discourse/plugins/civically-site/discourse/lib/site-utilities';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  @on('init')
  @observes('application.currentPath')
  setup() {
    const path = this.get('application.currentPath');
    $('body').toggleClass('landing', path && path.indexOf('landing') > -1);
  },

  @computed('isStart')
  bannerStyle(isStart) {
    const mobileView = this.get('site.mobileView');
    let style = '';

    if (!mobileView || isStart) {
      let url;

      if (isStart) {
        url = '/plugins/civically-private/images/people_background.png';
      } else {
        url = peopleBannerUrl();
      }

      style += `background-image: url('${url}');`
    }
    return new Handlebars.SafeString(style);
  },

  @computed('application.currentPath')
  isStart(path) {
    return path.toLowerCase().indexOf('start') > -1;
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
