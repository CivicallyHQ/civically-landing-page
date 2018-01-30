import DModalBody from 'discourse/components/d-modal-body';

export default DModalBody.extend({
  _afterFirstRender() {
    const embedded = this.get('embedded');
    if (!embedded && !this.site.mobileView && this.get('autoFocus') !== 'false') {
      this.$('input:first').focus();
    }

    const maxHeight = this.get('maxHeight');
    if (maxHeight) {
      const maxHeightFloat = parseFloat(maxHeight) / 100.0;
      if (maxHeightFloat > 0) {
        const viewPortHeight = $(window).height();
        this.$().css("max-height", Math.floor(maxHeightFloat * viewPortHeight) + "px");
      }
    }

    this.appEvents.trigger(
      'modal:body-shown',
      this.getProperties(
        'title',
        'rawTitle',
        'fixed'
      )
    );
  }
});
