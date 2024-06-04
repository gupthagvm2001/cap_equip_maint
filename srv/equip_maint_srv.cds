using { cap_equip_maint as db } from '../db/equip_maint_data';

service CatalogService@(path:'/CatalogService') {
  entity EquipMaint as projection on db.EquipMaint;
  entity UniqueEquipMaintplant as select distinct plant from EquipMaint;
    entity UniqueEquipMaintMachineid as select distinct machineID from EquipMaint;
  entity AggregatedEquipMaint_C1 as projection on db.AggregatedEquipMaint_C1;
  entity AggregatedEquipMaint_C2 as projection on db.AggregatedEquipMaint_C2;
}
