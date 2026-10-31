const Mods = {}

// you can also mods = { FunctionName() {} } 

Mods.wait = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Mods.FitText = function (Element) {
    let FontSize = 30;

    Element.style.fontSize = `${FontSize}px`;

    while (Element.scrollWidth > Element.clientWidth && FontSize > 1) {
        FontSize--;
        Element.style.fontSize = `${FontSize}px`;
    }
}

Mods.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Mods.InverseStringBool = function (String) {
    if (String == "true") {
        String = "false"
    }
    if (String == "false") {
        String = "true"
    }
}

export { Mods }