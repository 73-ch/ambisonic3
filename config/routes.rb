Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # root to: "home#home"

  get "home/:seat" => "home#home"
  get "control/:name" => "home#control"
  get "mic_check" => "home#mic_check"

  get "worklet_test" => "home#worklet_test"
end
