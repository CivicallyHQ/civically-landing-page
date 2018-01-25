# name: civically-landing-page
# about: Civically's Landing Page
# version: 0.1
# authors: Angus McLeod
# url: https://github.com/civicallyhq/civically-landing-page

register_asset 'stylesheets/common/landing-page.scss'
register_asset 'stylesheets/mobile/landing-page.scss', :mobile
register_asset 'javascripts/lib/intlTelInput.js'
register_asset 'stylesheets/intlTelInput.css'

after_initialize do
  load File.expand_path('../jobs/contact_email.rb', __FILE__)
  load File.expand_path('../mailers/contact_mailer.rb', __FILE__)

  module ::CivicallyLanding
    class Engine < ::Rails::Engine
      engine_name "civically_landing"
      isolate_namespace CivicallyLanding
    end
  end

  Discourse::Application.routes.append do
    mount ::CivicallyLanding::Engine, at: "landing"
    get "start" => "civically_landing/static#index"
    get "citizens" => "civically_landing/static#index"
    get "organizations" => "civically_landing/static#index"
    get "governments" => "civically_landing/static#index"
    get "add-location" => "civically_landing/static#index"
  end

  CivicallyLanding::Engine.routes.draw do
    post "contact" => "contact#send_contact_email"
  end

  class CivicallyLanding::StaticController < ::ApplicationController
    def index
      render nothing: true
    end
  end

  class CivicallyLanding::ContactController < ::ApplicationController
    def send_contact_email
      params.permit(:type, :name, :email, :phone, :institution, :position, :message)
      contact = {}

      params.each do |key, value|
        if value
          contact[key] = value
        end
      end

      begin
        Jobs::ContactEmail.new.execute(to_address: SiteSetting.landing_contact_email, contact: contact)
        render json: success_json
      rescue => e
        render json: { error: e }, status: 422
      end
    end
  end
end
