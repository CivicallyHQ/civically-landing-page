require_dependency 'email/sender'

module Jobs
  class ContactEmail < Jobs::Base
    sidekiq_options queue: 'critical'

    def execute(args)
      raise Discourse::InvalidParameters.new(:to_address) unless args[:to_address].present?

      if args[:contact]['type'] === 'launch'
        message = ContactMailer.launch_email(args[:to_address], args[:contact])
        Email::Sender.new(message, :launch_email).send
      else
        message = ContactMailer.contact_email(args[:to_address], args[:contact])
        Email::Sender.new(message, :contact_email).send
      end
    end
  end
end
