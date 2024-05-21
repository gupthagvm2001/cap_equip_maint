namespace cap_equip_maint;

entity EquipMaint {
  @title : 'Maintenance ID'
  key maintID :String;
  @title : 'Machine ID'
  machineID: String;
  @title : 'Machine Description'
  machineDescription: String;
  @title : 'Maintenance Location'
  maintenanceLocation: String;
  @title : 'Service Date'
  serviceDate: Date;
  @title : 'Technician'
  technician: String;
  @title : 'Maintenance Type'
  maintenanceType: String;
  @title : 'Technician Comments'
  technicianComments: String;
  @title : 'Plant'
  plant: String;
  @title : 'Plant Description'
  plantDescription: String;
  @title : 'Labor Cost'
  laborCost: Decimal; 
  @title : 'Spare Parts Cost'
  sparePartsCost: Decimal; 
  @title : 'Currency Type'
  currencyType: String; 
  @title : 'Service Count'
  serviceCount: Integer; 
  @title : 'Year'
  year: Integer;
  @title : 'Month'
  month: Integer;
  @title : 'Plant Unique'
  plantID: String;
  @title : 'Service Date Unique'
  serviceDateID: Date; 
  @title : 'Machine ID Unique'
  machineIDID: String;
}
