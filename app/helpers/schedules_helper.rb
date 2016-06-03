module SchedulesHelper

  def self.get_k( schedule_id, first_id, second_id )
    result = []
    draw = 0
    first = 0
    second = 0

    rates = Rate.where( :schedule_id => schedule_id )

    count = rates.length

    rates.each do | rate |
      if rate.draw
        draw = draw + 1
      else
        if rate.winner == first_id
          first = first + 1
        else
          second = second + 1
        end
      end
    end

    result = [ ((second.to_f + draw.to_f)/first.to_f ) +1, ( (first.to_f + draw.to_f)/second.to_f ) + 1, ( (first.to_f + second.to_f).to_f/draw.to_f ) +1 ]

    p result

    result
  end

end
