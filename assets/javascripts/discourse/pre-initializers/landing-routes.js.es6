import LandingRoute from '../routes/landing';

export default {
  after: 'inject-discourse-objects',
  name: 'landing-routes',

  initialize(registry, app) {
    app.LandingStartRoute = LandingRoute.extend();
    app.LandingGovernmentsRoute = LandingRoute.extend();
    app.LandingOrganizationsRoute = LandingRoute.extend();
  }
};
