class CreateRates < ActiveRecord::Migration[5.0]
  def change
    create_table :rates do |t|

      t.integer :user_id
      t.integer :schedule_id
      t.boolean :draw, :default => false
      t.integer :winner

      t.timestamps
    end
  end
end
