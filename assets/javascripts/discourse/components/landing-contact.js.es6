import { default as computed, on } from 'ember-addons/ember-computed-decorators';
import InputValidation from 'discourse/models/input-validation';
import { sendContact } from '../lib/landing-utilities';
import { emailValid } from 'discourse/lib/utilities';

export default Ember.Component.extend({
  formSubmitted: false,
  classNames: ['landing-contact'],
  type: 'citizen',

  @on('init')
  resetForm() {
    this.setProperties({
      name: '',
      email: '',
      phone: '',
      institution: '',
      position: '',
      submitted: false,
      validation: {failed: true}
    });
  },

  @computed('type')
  forInstitution() {
    return this.get('type') === 'government' || this.get('type') === 'organization';
  },

  @computed('nameValidation', 'emailValidation', 'phoneValidation', 'institutionValidation', 'positionValidation', 'formSubmitted', 'type')
  submitDisabled() {
    if (this.get('formSubmitted')) return true;
    if (this.get('nameValidation.failed')) return true;
    if (this.get('emailValidation.failed')) return true;
    if (this.get('phoneValidation.failed')) return true;

    if (this.get('forInstitution')) {
      if (this.get('institutionValidation.failed')) return true;
      if (this.get('positionValidation.failed')) return true;
    }

    return false;
  },

  @computed('email')
  emailValidation(email) {
    if (Ember.isEmpty(email)) {
      return InputValidation.create({
        failed: true
      });
    }

    if (emailValid(email)) {
      return InputValidation.create({
        ok: true,
        reason: I18n.t('user.email.ok')
      });
    }

    return InputValidation.create({
      failed: true,
      reason: I18n.t('user.email.invalid')
    });
  },

  @computed('emailValidation')
  emailValidationError(validation) {
    return validation && validation.failed && validation.reason ? validation.reason : null;
  },

  @computed('name')
  nameValidation() {
    return this.textValidation('name');
  },

  @computed('institution')
  institutionValidation() {
    return this.textValidation('institution');
  },

  @computed('position')
  positionValidation() {
    return this.textValidation('position');
  },

  textValidation(property) {
    if (Ember.isEmpty(this.get(property))) {
      return InputValidation.create({failed: true});
    }

    return InputValidation.create({ok: true});
  },

  @computed('type')
  typeButtons(type) {
    const types = ['citizen', 'government', 'organization'];
    const baseClass = '';

    let buttons = [];
    types.forEach((t) => {
      let classes = baseClass;
      if (t === type) classes += ' btn-primary';
      buttons.push({
        class: classes,
        name: t,
        label: `landing.${t}.link`
      });
    });

    return buttons;
  },

  actions: {
    phoneValidation(isValid, number = null) {
      let params = isValid ? { ok: true } : { failed: true };
      let validation = InputValidation.create(params);
      this.set('phoneValidation', validation);

      if (isValid && number) {
        this.set('phone', number);
      }
    },

    submitContact() {
      if (this.get('submitDisabled')) return false;

      let data = this.getProperties('type', 'name', 'email');

      const phone = this.get('phone');
      const phoneEnabled = Discourse.SiteSettings.landing_contact_phone_enabled;
      if (phone && phoneEnabled) data['phone'] = phone;

      const message = this.get('message');
      if (message) data['message'] = message;

      if (this.get('forInstitution')) {
        data['institution'] = this.get('institution');
        data['position'] = this.get('position');
      }

      let self = this;
      this.setProperties({
        'formSubmitted': true,
        'submitting': true
      });

      sendContact(data).then(() => {
        this.set('submitting', false);
        if (data.error) {
          self.set('contactResult', I18n.t('landing.contact.failed'));
          return self.set('formSubmitted', false);
        }
        self.set('contactResult', I18n.t('landing.contact.succeded'));
      });

      return false;
    },

    setType(type) {
      this.set('type', type);
    }
  }
});
