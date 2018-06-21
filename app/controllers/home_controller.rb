class HomeController < ApplicationController
  def home
    session[:user_param] = params[:seat]

    logger.info session[:user_param]
  end

  def control
    check_admin(params[:name])

    logger.info session[:admin]
  end

  private
  def check_admin(pass)
    if pass === "namikawa"
      session[:admin] = "admin_user"
    else
      redirect_to "/home/dummy"
    end
  end
end