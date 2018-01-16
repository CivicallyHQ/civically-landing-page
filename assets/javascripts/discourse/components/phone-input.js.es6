export default Ember.Component.extend({
  didInsertElement() {
    const $telInput = this.$("#contact-phone");
    const $errorMsg = this.$("#error-msg");
    const $validMsg = this.$("#valid-msg");
    const value = this.get('value');

    let opts = {
      utilsScript: "/plugins/civically-landing-page/js/utils.js",
      preferredCountries: []
    }

    if (value) opts['setNumber'] = value;
    $telInput.intlTelInput(opts);

    const reset = function() {
      $telInput.removeClass("error");
      $errorMsg.addClass("hide");
      $validMsg.addClass("hide");
    };

    const self = this;
    $telInput.blur(function() {
      reset();
      let value = $.trim($telInput.val());
      if (value) {
        if ($telInput.intlTelInput("isValidNumber")) {
          self.sendAction('phoneValidation', value);
          $validMsg.removeClass("hide");
        } else {
          self.sendAction('phoneValidation', false);
          $telInput.addClass("error");
          $errorMsg.removeClass("hide");
        }
      } else {
        self.sendAction('phoneValidation', false);
      }
    });

    $telInput.on("keyup change", reset);
  }
})
