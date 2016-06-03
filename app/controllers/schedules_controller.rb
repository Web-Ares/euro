class SchedulesController < ApplicationController
  require 'date'

  def index

    @countries = Country.all

    schedules = Schedule.all

    @schedules = []

    rates = Rate.where( :user_id => current_user.id )

    schedules.each do |schedule|

      date_schedule = schedule.date.utc.to_datetime
      date_now = (DateTime.now + 3.hour).utc.to_datetime

      date_str = schedule.date

      can_make_rate = true

      my_rate = nil
      k = []

      rates.each do | rate |

        if rate.schedule_id == schedule.id
          my_rate = rate
        end



      end

      if date_now > date_schedule

        can_make_rate = false

        unless schedule.score.nil?
          date_str = schedule.score
        else
          date_str = '...'
          k = SchedulesHelper.get_k( schedule.id, schedule.first_country, schedule.second_country )
        end
      end

      @schedules  << {
          :id => schedule.id,
          :first_country => Country.find_by( :id => schedule.first_country ),
          :second_country => Country.find_by( :id => schedule.second_country ),
          :score => schedule.score,
          :date => date_str,
          :draw => schedule.draw,
          :can_make_rate => can_make_rate,
          :k => k,
          :rate => my_rate
      }



    end

    render :layout => false
  end

  def create
    Schedule.create( set_params( params ) )
  end

  def show

    score = params[ :score ]
    score_arr = score.split( ':' )
    first = false
    second = false
    third = false

    schedule = Schedule.find_by( :id => params[ :id ] )

    rates = Rate.where( :schedule_id => params[ :id ] )
    
    k = SchedulesHelper.get_k( schedule.id, schedule.first_country, schedule.second_country )

    if score_arr[ 0 ].to_i > score_arr[ 1 ].to_i
      first = true
    elsif score_arr[ 0 ].to_i < score_arr[ 1 ].to_i
      second = true
    else
      third = true
    end

    rates.each do |rate|
      if rate.draw
        if third
          rate.user.account = rate.user.account.to_f + ( 5 * k[ 2 ] )
        end
      else
        if rate.winner == schedule.first_country && first
          rate.user.account = rate.user.account.to_f + ( 5 * k[ 0 ] )

        elsif rate.winner == schedule.second_country && second
          rate.user.account = rate.user.account.to_f + ( 5 * k[ 1 ] )
         
        end
      end

      rate.user.save
    end

    Schedule.update( params[ :id ], :score => score)

    render :json => { :message => :ok }
  end

  private

  def set_params( params )
    params.permit( :first_country, :second_country, :draw, :date )
  end

end
