import { system, world, EquipmentSlot, ItemStack, EntityEquippableComponent } from "@minecraft/server";


let items = ["_axe", "hacha", "tomahawk", "battleaxe", "chainsaw"]

world.afterEvents.playerBreakBlock.subscribe(blockEvent =>{
    let p = blockEvent.player;
    let block = blockEvent.block;

    let location = [
        blockEvent.block.location.x,
        blockEvent.block.location.y,
        blockEvent.block.location.z
        ];
    let axe;
    let container = p.getComponent(EntityEquippableComponent.componentId);
    let hand = container.getEquipment(EquipmentSlot.Mainhand);

    let id = hand.typeId
    
    for(let itemsID of items){
        if (id.includes(itemsID) && !p.hasTag("off")) {
            axe = p.dimension.spawnEntity("new:axe", {
                x: location[0],
                y: location[1],
                z: location[2]
            });
            axe.runCommandAsync("execute if block ~~1~ log run particle new:polvo ~~~")
            axe.runCommandAsync("execute if block ~~1~ log run playsound random.axe @p ~~~ 4 1 4")
            axe.runCommandAsync("function axe")
            axe.runCommandAsync("function axe2")
        }
    } 
});

system.runInterval(() =>{
    for(let p of world.getPlayers()){
        for(let itemsID of items){
            try{
                let container = p.getComponent(EntityEquippableComponent.componentId);
                let hand = container.getEquipment(EquipmentSlot.Mainhand).typeId;
                if (hand.includes(itemsID) && !p.isSneaking && !p.hasTag("noti")){
                    p.runCommandAsync("title @s actionbar §7--Sneak + Interact to activate/deactivate--")
                    p.addTag("noti")
                }
            }catch(e){
                if(p.hasTag("noti")){
                    p.removeTag("noti")
                }
            }
        }
    }
})

world.afterEvents.itemUse.subscribe(use =>{
    let item = use.itemStack;
    let p = use.source;

    for(let itemsID of items){
        if(item.typeId.includes(itemsID) && p.isSneaking && !p.hasTag("off")){
            system.runTimeout(()=>{
                p.runCommandAsync("title @s actionbar §7Tree Capitator: §cOff")
                p.addTag("off")
            }, 5)
        }
        if(item.typeId.includes(itemsID) && p.isSneaking && p.hasTag("off")){
            system.runTimeout(()=>{
                p.runCommandAsync("title @s actionbar §7Tree Capitator: §aOn")
                p.removeTag("off")
            }, 5)
        }
    }
})