import LandingRoute from '../routes/landing';
import LandingController from '../controllers/landing';

export default {
  after: 'inject-discourse-objects',
  name: 'landing-routes',

  initialize(registry, app) {
    app.LandingStartController = LandingController.extend();
    app.LandingGovernmentsController = LandingController.extend();
    app.LandingOrganisationsController = LandingController.extend();
    app.LandingStartRoute = LandingRoute.extend();
    app.LandingGovernmentsRoute = LandingRoute.extend();
    app.LandingOrganisationsRoute = LandingRoute.extend();
  }
};
