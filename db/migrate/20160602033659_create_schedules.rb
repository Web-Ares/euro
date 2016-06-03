class CreateSchedules < ActiveRecord::Migration[5.0]
  def change
    create_table :schedules do |t|

      t.datetime :date
      t.boolean :draw
      t.integer :first_country
      t.integer :second_country
      t.string :score
      t.integer :winner
      t.integer :rate, :default => 5

      t.timestamps
    end
  end
end
