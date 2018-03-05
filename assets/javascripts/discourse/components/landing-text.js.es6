import { default as computed, on } from 'ember-addons/ember-computed-decorators';
import { cookAsync } from 'discourse/lib/text';

export default Ember.Component.extend({
  classNameBindings: [":p-text", "classes"],

  @on('init')
  setup() {
    const markdown = this.get('markdown');
    const content = this.get('content');
    const text = I18n.t(content);
    if (markdown) {
      cookAsync(text).then((cooked) => {
        this.set('text', cooked);
      });
    } else {
      this.set('text', text);
    }
  },

  @computed('emoji')
  formattedEmoji(emoji) {
    return `:${emoji}:`;
  }
});
