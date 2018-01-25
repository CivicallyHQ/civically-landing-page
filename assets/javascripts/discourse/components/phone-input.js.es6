export default Ember.Component.extend({
  didInsertElement() {
    const $telInput = this.$("#contact-phone");
    const $errorMsg = this.$("#error-msg");
    const $validMsg = this.$("#valid-msg");
    const value = this.get('value');

    let opts = {
      utilsScript: "/plugins/civically-landing-page/js/utils.js",
      preferredCountries: []
    };

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
      const number = $telInput.intlTelInput("getNumber");
      if (number) {
        if ($telInput.intlTelInput("isValidNumber")) {
          self.sendAction('phoneValidation', true, number);
          $validMsg.removeClass("hide");
        } else {
          self.sendAction('phoneValidation', false);
          $telInput.addClass("error");
          $errorMsg.removeClass("hide");
        }
      } else {
        self.sendAction('phoneValidation', true);
      }
    });

    $telInput.on("keyup change", reset);
  }
});
