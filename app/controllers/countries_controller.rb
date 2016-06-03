class CountriesController < ApplicationController

  def index

    @countries = Country.all

    render :layout => false
  end

  def create


    Country.create( set_params( params ) );


    render :json => {
        :message => :ok
    }
  end

  private

  def set_params( params )
    params.permit(:name, :image )
  end

end
