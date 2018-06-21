module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :user_params

    def connect
      self.user_params = request.session.fetch("user_params", nil)
      reject_unauthorized_connection unless user_params
    end
  end
end
