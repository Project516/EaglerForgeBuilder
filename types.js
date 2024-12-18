const VALUE_ENUMS = {
    FILE: "efb::val__file",
    IMG: "efb::val__img",
    ABSTRACT_HANDLER: "efb::handler/"
}


const PRIMITIVES = {};


function getPrimitive(type) {
    var cloned = Object.assign({}, PRIMITIVES[type]);
    delete cloned.asJavaScript;
    cloned = structuredClone(cloned);
    Object.keys(cloned.tags).forEach(key => {
        if (Array.isArray(cloned.tags[key])) {
            cloned.tags[key] = cloned.tags[key][0];
        }
    });
    return cloned;
}

window.addEventListener("load", ()=>{
    var addtype = document.querySelector("#addtype");
    Object.keys(PRIMITIVES).forEach(type => {
        var option = document.createElement("option");
        option.value = type;
        option.innerText = PRIMITIVES[type].name;
        addtype.appendChild(option);
    });
});