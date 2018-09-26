require 'securerandom'

class HomeController < ApplicationController
  before_action :set_position_params, only: :home

  def home
    session[:user_param] = SecureRandom.urlsafe_base64(16)

    logger.info session[:user_param]
  end

  def control
    check_admin(params[:name])

    logger.info request.remote_ip
    logger.info session[:admin]
  end

  def mic_check
    
  end

  def worklet_test
    
  end

  private
  def check_admin(pass)
    if pass === "namikawa"
      session[:admin] = "admin_user"
    else
      redirect_to home_path
    end
  end

  def set_position_params
    params[:x] ||= 0
    params[:y] ||= 0
    params[:z] ||= 0
  end
end