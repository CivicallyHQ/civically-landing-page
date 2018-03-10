export default Ember.Controller.extend({
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
