namespace cap_equip_maint;

entity EquipMaint {
  @title : 'Maintenance ID'
  key maintID :Integer;
  @title : 'Machine ID'
  machineID: String;
  @title : 'Machine Description'
  machineDescription: String;
  @title : 'Maintenance Location'
  maintenanceLocation: String;
  @title : 'Service Date'
  serviceDate: String;
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
}
