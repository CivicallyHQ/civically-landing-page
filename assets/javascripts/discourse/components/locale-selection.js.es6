import { on } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  classNames: 'locale-selection',
  showHidden: false,

  @on('init')
  setup() {
    const localeValues = this.siteSettings.landing_visible_locales.split(',');
    const availableLocales = JSON.parse(this.siteSettings.available_locales);
    let visibleLocales = [];
    let hiddenLocales = [];

    availableLocales.forEach((l) => {
      if (localeValues.indexOf(l.value) > -1) {
        visibleLocales.push(l);
      } else {
        hiddenLocales.push(l);
      }
    });

    this.setProperties({ visibleLocales, hiddenLocales });
  },

  didInsertElement() {
    this.set('clickOutsideHandler', Ember.run.bind(this, this.clickOutside));
    Ember.$(document).on('click', this.get('clickOutsideHandler'));
  },

  willDestroyElement() {
    Ember.$(document).off('click', this.get('clickOutsideHandler'));
  },

  clickOutside(e) {
    const $element = this.$();
    const $target = $(e.target);
    if (!$target.closest($element).length) {
      this.set("showHidden", false);
    }
  },

  actions: {
    changeLocale(locale) {
      this.set('showHidden', false);
      window.location.href = window.location.href.split('?')[0] + `?change_locale=${locale}`;
    },

    showHidden() {
      this.toggleProperty('showHidden');
    }
  }
});
