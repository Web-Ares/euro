class AddAcountToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :account, :decimal , :default => 0, :null => false, :precision => 12, :scale => 2
  end
end
