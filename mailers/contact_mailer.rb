require_dependency 'email/message_builder'

class ContactMailer < ActionMailer::Base
  include Email::BuildEmailHelper

  def contact_email(to_address, contact)
    build_email(
      to_address,
      template: 'contact_mailer',
      type: contact['type'],
      name: contact['name'],
      email: contact['email'],
      phone: contact['phone'],
      institution: contact['institution'],
      position: contact['position'],
      message: contact['message']
    )
  end

  def launch_email(to_address, contact)
    build_email(
      to_address,
      template: 'launch_mailer',
      name: contact['name'],
      email: contact['email'],
      message: contact['message']
    )
  end
end
