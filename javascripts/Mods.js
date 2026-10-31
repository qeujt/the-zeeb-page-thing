import { Easing, Tween } from "./TweenLib.js";

const Mods = {}
const notifwrapper = document.querySelector(".notifwrapper")

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

//if fromX not real then notifFrame parent wallahi
Mods.CreateNotif = function (text, classname, duration, easingstyle, { fromX, fromY } = {}, { toX, toY } = {}) {
    const NewText = document.createElement("div")
    NewText.removeAttribute("style")
    NewText.classList.add(classname)
    NewText.textContent = text
    NewText.style.color = "white"

    let FloatX
    let FloatY
    let FloatToX
    let FloatToY

    if (fromX !== null) {
        FloatX = parseFloat(fromX)
        FloatY = parseFloat(fromY)

        FloatToX = parseFloat(toX) - FloatX
        FloatToY = parseFloat(toY) - FloatY

        NewText.style.position = "fixed"
        NewText.style.fontSize = "30px"
        document.body.appendChild(NewText)
    } else {
        NewText.style.
            NewText.style.fontSize = "80px"
        NewText.style.textShadow = "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
        notifwrapper.appendChild(NewText)

        Tween(duration, Easing.linear, progress => {
            NewText.style.opacity = (1 - progress)
        }, () => {
            NewText.remove()
        }).play()
        return
    }


    Tween(duration, easingstyle, progress => {
        if (fromX !== null) {
            NewText.style.left = `${FloatX + FloatToX * progress}px`
            NewText.style.top = `${FloatY + FloatToY * progress}px`
        }
        NewText.style.opacity = (1 - progress)
    }, () => {
        NewText.remove()
    }).play()
}

Mods.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Mods.lerp = (start, end, p) => start + (end - start) * p;

Mods.InverseStringBool = function (String) { //apparently java accepts !boolean reverses in strings too s othis function is fucking pointless brouh
    if (String == "true") {
        String = "false"
    }
    if (String == "false") {
        String = "true"
    }
}

Mods.ApplyPropertiesTransform = function (Node) {
    const parseVec = attr => attr.split(",").map(n => parseFloat(n.trim()));

    const [ax, ay] = Node.dataset.anchor ? parseVec(Node.dataset.anchor) : [0, 0];

    if (Node.dataset.size) {
        const [sx, ox, sy, oy] = parseVec(Node.dataset.size);
        Node.style.width = `calc(${sx * 100}% + ${ox}px)`;
        Node.style.height = `calc(${sy * 100}% + ${oy}px)`;
    }

    const [psx, pox, psy, poy] = Node.dataset.position ? parseVec(Node.dataset.position) : [0, 0, 0, 0];
    Node.style.position = "absolute";
    Node.style.left = `calc(${psx * 100}% + ${pox}px)`;
    Node.style.top = `calc(${psy * 100}% + ${poy}px)`;

    Node.style.transformOrigin = `${ax * 100}% ${ay * 100}%`;
    Node.style.transform = `translate(-${ax * 100}%, -${ay * 100}%)`;
}

Mods.ApplyClassProperties = function (Selector, NodeToApplyTo) {
    const declared = {};

    // walk every loaded stylesheet, collect only the properties actually
    // written in rules matching this selector — not the ~300 defaults
    // getComputedStyle would hand back
    for (const sheet of document.styleSheets) {
        let rules;
        try {
            rules = sheet.cssRules; // throws for cross-origin sheets served without CORS
        } catch {
            continue;
        }
        for (const rule of rules) {
            if (rule.selectorText === Selector) {
                for (const prop of rule.style) {
                    declared[prop] = rule.style.getPropertyValue(prop);
                }
            }
        }
    }

    for (const [prop, value] of Object.entries(declared)) {
        if (prop !== "opacity") {
            NodeToApplyTo.style.setProperty(prop, value);
        }
    }
};

export { Mods }