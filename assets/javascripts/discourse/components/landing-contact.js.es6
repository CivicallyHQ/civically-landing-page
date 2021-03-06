import { default as computed, on } from 'ember-addons/ember-computed-decorators';
import InputValidation from 'discourse/models/input-validation';
import { sendContact } from '../lib/landing-utilities';
import { emailValid } from 'discourse/lib/utilities';

const textKeys = ['title', 'name', 'email', 'phone', 'institution', 'position', 'location', 'message', 'submit'];

const customTextKeys = {
  individual: [],
  organisation: ['email', 'phone', 'institution'],
  government: ['email', 'institution', 'position'],
  launch: ['submit']
};

export default Ember.Component.extend({
  formSubmitted: false,
  classNameBindings: [':landing-contact', 'type'],
  type: 'individual',
  isLaunch: Ember.computed.equal('type', 'launch'),
  showMessage: Ember.computed.not('isLaunch'),
  showName: Ember.computed.not('isLaunch'),
  showPrivacy: false,
  showLocation: Ember.computed.alias('isLaunch'),

  @computed('type')
  showPhone(type) {
    return this.siteSettings.landing_contact_phone_enabled && type !== 'launch';
  },

  @on('init')
  setupTypes() {
    const defaultTypes = ['individual', 'organisation', 'government'];
    const type = this.get('type');

    if (defaultTypes.indexOf(type) > -1) {
      this.set('types', defaultTypes);
    } else {
      this.set('types', [type]);
    }
  },

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

  @on('init')
  setText() {
    const type = this.get('type');
    const custom = customTextKeys[type];
    let props = {};

    textKeys.forEach((k) => {
      let parentKey = custom.indexOf(k) > -1 ? `landing.${type}.contact` : 'landing.contact';

      if (k === 'title') {
        if (type !== 'launch') {
          props['title'] = `${parentKey}.title`;
        }
      } else if (k === 'submit') {
        props['submitLabel'] = `${parentKey}.submit`;
      } else {
        props[`${k}Label`] = `${parentKey}.${k}.label`;
        props[`${k}Placeholder`] = `${parentKey}.${k}.placeholder`;
      }
    });

    this.setProperties(props);
  },

  @computed('type')
  forInstitution() {
    return this.get('type') === 'government' || this.get('type') === 'organisation';
  },

  @computed('nameValidation', 'emailValidation', 'phoneValidation', 'institutionValidation', 'positionValidation', 'locationValidation', 'messageValidation', 'formSubmitted', 'type')
  submitDisabled() {
    if (this.get('formSubmitted')) return true;

    if (this.get('showName')) {
      if (this.get('nameValidation.failed')) return true;
    }

    if (this.get('emailValidation.failed')) return true;

    if (this.get('showPhone')) {
      if (this.get('phoneValidation.failed')) return true;
    }

    if (this.get('showLocation')) {
      if (this.get('locationValidation.failed')) return true;
    }

    if (this.get('forInstitution')) {
      if (this.get('institutionValidation.failed')) return true;
      if (this.get('positionValidation.failed')) return true;
    }

    if (this.get('showMessage')) {
      if (this.get('messageValidation.failed')) return true;
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

  @computed('location')
  locationValidation() {
    return this.textValidation('location');
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

  @computed('message')
  messageValidation() {
    return this.textValidation('message');
  },

  textValidation(property) {
    if (Ember.isEmpty(this.get(property))) {
      return InputValidation.create({failed: true});
    }

    return InputValidation.create({ok: true});
  },

  @computed('type', 'types')
  typeButtons(type, types) {
    const baseClass = '';

    let buttons = [];
    types.forEach((t) => {
      let classes = baseClass;
      if (t === type) classes += ' btn-primary';
      buttons.push({
        class: classes,
        name: t,
        label: `landing.${t}.label`
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

      let data = this.getProperties('type', 'email');

      if (this.get('showName')) {
        data['name'] = this.get('name');
      }

      if (this.get('showLocation')) {
        data['location'] = this.get('location');
      }

      if (this.get('showMessage')) {
        data['message'] = this.get('message');
      }

      const phone = this.get('phone');
      const phoneEnabled = Discourse.SiteSettings.landing_contact_phone_enabled;
      if (phone && phoneEnabled) data['phone'] = phone;

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
