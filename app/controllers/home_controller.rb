require 'securerandom'

class HomeController < ApplicationController
  before_action :set_user_params

  def home

  end

  private
  def set_user_params
    session[:user_params] = SecureRandom.hex(8) unless session[:user_params]
  end
end