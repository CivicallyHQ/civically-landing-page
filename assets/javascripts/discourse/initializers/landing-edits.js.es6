import { withPluginApi } from 'discourse/lib/plugin-api';
import { observes, default as computed } from 'ember-addons/ember-computed-decorators';

export default {
  name: 'landing-edits',
  initialize(){
    withPluginApi('0.8.12', api => {
      api.modifyClass('controller:create-account', {
        @observes('emailValidation', 'usernameValidation', 'nameValidation', 'passwordValidation')
        hideInstructions() {
          $('.create-account tr.instructions:eq(0) td:eq(1) label').toggle(!Boolean(this.get('emailValidation.reason')));
          $('.create-account tr.instructions:eq(1) td:eq(1) label').toggle(!Boolean(this.get('usernameValidation.reason')));
          $('.create-account tr.instructions:eq(2) td:eq(1) label').toggle(!Boolean(this.get('nameValidation.reason')));
          $('.create-account tr.instructions:eq(3) td:eq(1) label').toggle(!Boolean(this.get('passwordValidation.reason')));
        }
      });

      api.modifyClass('route:application', {
        handleShowCreateAccount() {
          if (this.siteSettings.enable_sso) {
            const returnPath = encodeURIComponent(window.location.pathname);
            window.location = Discourse.getURL('/session/sso?return_path=' + returnPath);
          } else {
            const $embeddedForm = $('.create-account-embed');
            if ($embeddedForm.length) {
              return $('html, body').animate({
                scrollTop: $embeddedForm.offset().top - 150
              }, 500);
            }
            this._autoLogin('createAccount', 'create-account');
          }
        }
      });

      api.modifyClass('component:site-header', {
        @computed('currentRoute')
        hideHeaderSearch(currentRoute) {
          return currentRoute.indexOf('landing') > -1 || currentRoute.indexOf('loading') > -1;
        },

        @observes('hideHeaderSearch')
        hideHeaderChanged() {
          this.toggleVisibility();
        }
      });
    });
  }
};
