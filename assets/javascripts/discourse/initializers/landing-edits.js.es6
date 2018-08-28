import { withPluginApi } from 'discourse/lib/plugin-api';
import { observes, default as computed } from 'ember-addons/ember-computed-decorators';
import showModal from 'discourse/lib/show-modal';

export default {
  name: 'landing-edits',
  initialize(container){
    const currentUser = container.lookup('current-user:main');
    const site = container.lookup("site:main");

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

      api.decorateWidget('header-buttons:before', (helper) => {
        if (!currentUser && helper.attrs.route && helper.attrs.route.indexOf('landing') > -1) {
          let aboutAttrs = {
            href: '/about',
            className: 'about btn',
            icon: 'info'
          };

          let contactAttrs = {
            action: 'openContact',
            className: 'contact',
            icon: 'envelope'
          };

          if (!site.mobileView) {
            aboutAttrs['label'] = 'about.simple_title';
            contactAttrs['label'] = 'landing.contact.title';
          }

          return [
            helper.attach('link', aboutAttrs),
            helper.attach('button', contactAttrs)
          ];
        }
      });

      api.attachWidgetAction('header', 'openContact', () => {
        showModal('landing-contact-modal');
      });
    });
  }
};
