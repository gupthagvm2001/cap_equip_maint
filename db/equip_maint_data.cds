namespace cap_equip_maint;

entity EquipMaint {
  @title : 'Maintenance ID'
  key maintID : String;
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
}

entity UniqueEquipMaintplant as select from EquipMaint {
    plant,
    plantDescription
} group by plant, plantDescription;

entity UniqueEquipMaintMachineid as select from EquipMaint {
    machineID,
    machineDescription
  } group by machineID, machineDescription;
entity AggregatedEquipMaint_C1 as select from EquipMaint {
  key serviceDate : String,
  key maintenanceType : String,
  (strftime('%Y', serviceDate) || '-' || strftime('%m', serviceDate)) AS serviceMonth : String,
  COUNT(EquipMaint.maintenanceType) AS totalserviceCount : Integer
} GROUP BY (strftime('%Y', serviceDate) || '-' || strftime('%m', serviceDate)), maintenanceType;

entity AggregatedEquipMaint_C2 as select from EquipMaint {
  key maintenanceLocation,
  key machineDescription,
  @Aggregation.default : #SUM
  sum(laborCost) as totalLaborCost : Decimal
} group by maintenanceLocation, machineDescription;
