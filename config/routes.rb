Rails.application.routes.draw do

  devise_for :users, :controllers => { :omniauth_callbacks => 'callbacks' }

  root to: 'home#index'

  get 'persons/profile', as: 'user_root'

  get :dashboard, to: 'home#index'

  resources :countries
  resources :schedules
  resources :rates


end
