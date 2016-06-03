class ChangeCountryName < ActiveRecord::Migration[5.0]
  def change
    change_column :countries, :image, :text
  end
end
