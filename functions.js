Math.clamp = function clamp(x, min, max) {
    return Math.max(Math.min(x, max), min);
}

const codeGrabberRegex = /(?<=function \(\) {)[\s\S]+(?=}$)/gm; //regex to get the contents of a stringified function
const FUNCTIONS = {};

FUNCTIONS["fixup_block_ids"] = {
    identifier: "fixup_block_ids",
    //Very important that there is no name and a whitespace before and after the parantheses
    code: function () {
        function EFB2__defineFixupGlobal() {
            globalThis.efb2__fixupBlockIds = function efb2__fixupBlockIds() {
                var blockRegistry = ModAPI.util.wrap(ModAPI.reflect.getClassById("net.minecraft.block.Block").staticVariables.blockRegistry).getCorrective();
                var BLOCK_STATE_IDS = ModAPI.util.wrap(ModAPI.reflect.getClassById("net.minecraft.block.Block").staticVariables.BLOCK_STATE_IDS).getCorrective();
                blockRegistry.registryObjects.hashTableKToV.forEach(entry => {
                    if (entry) {
                        var block = entry.value;
                        var validStates = block.getBlockState().getValidStates();
                        var stateArray = validStates.array || [validStates.element];
                        stateArray.forEach(iblockstate => {
                            var i = blockRegistry.getIDForObject(block.getRef()) << 4 | block.getMetaFromState(iblockstate.getRef());
                            BLOCK_STATE_IDS.put(iblockstate.getRef(), i);
                        });
                    }
                });
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineFixupGlobal);
        EFB2__defineFixupGlobal();
    },
};

FUNCTIONS["execute_command"] = {
    identifier: "execute_command",
    //Very important that there is no name and a whitespace before and after the parantheses
    code: function () {
        function EFB2__defineExecCmdGlobal() {
            globalThis.efb2__executeCommand = function efb2__executeCommand($world, $blockpos, commandStr, feedback) {
                if ($world.$isRemote) {
                    return;
                }
                function x() {
                    ModAPI.reflect.getSuper(ModAPI.reflect.getClassByName("CommandBlockLogic"))(this);
                }
                ModAPI.reflect.prototypeStack(ModAPI.reflect.getClassByName("CommandBlockLogic"), x);
                var vector = ModAPI.reflect.getClassByName("Vec3").constructors[0]($blockpos.$x + 0.5, $blockpos.$y + 0.5, $blockpos.$z + 0.5);
                x.prototype.$getEntityWorld = ()=>{return $world};
                x.prototype.$getCommandSenderEntity = ()=>{return null};
                x.prototype.$updateCommand = ()=>{};
                x.prototype.$addChatMessage = (e)=>{console.log(e)};
                x.prototype.$func_145757_a = ()=>{};
                x.prototype.$getPosition = ()=>{return $blockpos};
                x.prototype.$getPosition0 = ()=>{return $blockpos};
                x.prototype.$getPositionVector = ()=>{return vector};
                x.prototype.$func_145751_f = ()=>{return 0};
                x.prototype.$sendCommandFeedback = ()=>{return feedback ? 1 : 0}
                var cmd = new x();
                cmd.$setCommand(ModAPI.util.str(commandStr));
                
                try {
                    cmd.$trigger($world);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineExecCmdGlobal);
        EFB2__defineExecCmdGlobal();
    },
};

FUNCTIONS["construct_vec3"] = {
    identifier: "construct_vec3",
    //Very important that there is no name and a whitespace before and after the parantheses
    code: function () {
        function EFB2__defineMakeVec3() {
            var mkVec3 = ModAPI.reflect.getClassById("net.minecraft.util.Vec3").constructors.find(x=>x.length===3);
            globalThis.efb2__makeVec3 = function efb2__makeVec3(x, y, z) {
                return mkVec3(x, y, z);
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineMakeVec3);
        EFB2__defineMakeVec3();
    },
};

FUNCTIONS["construct_blockpos"] = {
    identifier: "construct_blockpos",
    //Very important that there is no name and a whitespace before and after the parantheses
    code: function () {
        function EFB2__defineMakeBlockPos() {
            var mkBlockPos = ModAPI.reflect.getClassById("net.minecraft.util.BlockPos").constructors.find(x=>x.length===3);
            globalThis.efb2__makeBlockPos = function efb2__makeBlockPos(x, y, z) {
                return mkBlockPos(x, y, z);
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineMakeBlockPos);
        EFB2__defineMakeBlockPos();
    },
};

function getFunctionCode(fn) {
    return fn.code.toString().match(codeGrabberRegex)?.[0] 
    || (()=>{console.error("Malformed function: ", fn); return "";})();
}