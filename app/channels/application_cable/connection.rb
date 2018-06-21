module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :user_params

    def connect
      if admin_check
        self.user_params = "admin"
      else
        self.user_params = request.session.fetch("user_param", nil)
      end
      reject_unauthorized_connection unless user_params
    end

    private
    def admin_check
      request.session.fetch("admin", nil) == "admin_user"
    end
  end
end
