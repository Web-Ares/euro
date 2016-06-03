class RatesController < ApplicationController

  def index
    @users = User.select( :image, :name, :account ).order( account: :desc, name: :asc )

    render :layout => false
  end

  def create

    params[ :user_id ] = current_user.id

    unless params[ :id ].nil?

      unless params[ :winner ].nil?
        Rate.update(params[ :id ], :draw =>false, :winner => params[ :winner ])

      else
        Rate.update( params[ :id ], :winner => false, :draw =>true )

      end

    else

      current_user.account = current_user.account - 5
      current_user.save
      Rate.create( set_params( params ) )

    end



    render :json => {
        :message => :ok
    }
  end

  private

  def set_params( params )
    params.permit(:winner, :user_id, :draw, :schedule_id )
  end


end
