using { cap_equip_maint as db } from '../db/equip_maint_data';

service CatalogService@(path:'/CatalogService')
    {

    entity EquipMaint as projection on db.EquipMaint
    }
