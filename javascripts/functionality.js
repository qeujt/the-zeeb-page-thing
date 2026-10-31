import { Easing, Tween } from "./TweenLib.js";
import { Mods } from "./Mods.js";

const ResizeFrame = document.querySelector("#ResizeFrame");
const MaintextNode = document.querySelector(".ResizeFrameText");
const SubtextNode = document.querySelector(".ResizeFrameSubText");
const BackgroundImage = document.querySelector(".BackgroundImage");
const PageWrapper = document.querySelector(".PageWrapper");
const DepthWrapper = document.querySelector(".DepthWrapper")
const HeavenWrapper = document.querySelector(".HeavenWrapper")
const Table = document.querySelector(".Table")
const thesky = document.querySelector(".thesky");
const Subtext = [
    "i have no bunnies :////",
    "loading this is just design",
    "me my mine favorite is fine",
    "this FUCKING screen took me so FUCKING long FUCKKKKKKKKKK I'M SO RETARDED",
    "love and joy?",
    "gangsta till the realized become meowed",
    "i'm a campa minecrafts grim grimmer grimmed",
    "meow",
    "oh mOther...",
    "why did you resize your window, even?",
    "buh..............",
    "did you know i coded 80% of this website myself NO AI!!!!!!!!!!!",
    "when i was a kid, i was a kid",
    "this is audibly a loading screen, kinda",
    "the uk had no involvement in this...."
]
let currentpage
let currentpageparent

let InDepths = false
let InDepthCloudTransition = false
document.body.style.backgroundColor = "#000000"

const Ambience = new Audio("assets/ambience.mp3");
document.addEventListener("click", () => {
    Ambience.autoplay = true
    Ambience.loop = true
    if (InDepths) {
        return
    }
    Ambience.play()
}, { once: true });

let toUpdate = []

const Blinksound = new Audio("assets/blink.mp3");
Blinksound.volume = 0.5

const uppereyelid = document.querySelector(".upper-eyelid")
const lowereyelid = document.querySelector(".lower-eyelid")
const Buns = [
    "assets/grassbuns/pixelbun1blink.png",
    "assets/grassbuns/pixelbun2.png",
    "assets/grassbuns/pixelbun3.png"
]

function pixelate(el, bigness) {
    const computed = getComputedStyle(el);
    const originX = parseFloat(computed.width)
    const originY = parseFloat(computed.height)

    el.style.width = `${originX / bigness}px`
    el.style.height = `${originY / bigness}px`
    el.style.imageRendering = 'pixelated';

    el.style.width = `${originX}px`
    el.style.height = `${originY}px`
}

function addParallax(el, strength) {
    if (strength == null) {
        strength = -25
    }
    const baseTransform = getComputedStyle(el).transform;
    let base = baseTransform === 'none' ? '' : baseTransform;
    let finalstrength = el.dataset.pstrength != null ? el.dataset.pstrength : strength

    let targetX = 0, currentX = 0;
    let targetY = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
        if (InDepthCloudTransition == false) {
            const normX = (e.clientX / window.innerWidth) - 0.5;
            const normY = (e.clientY / window.innerHeight) - 0.5;
            targetX = normX * finalstrength;
            targetY = normY * finalstrength / 2;
        }
    }, { passive: true });

    const tick = () => {
        if (InDepthCloudTransition == false) {
            currentX += (targetX - currentX) * 0.16;
            currentY += (targetY - currentY) * 0.08;
            const floatY = el._floatOffset ? el._floatOffset() : 0;
            el.style.transform = `${base} translateX(${currentX}px) translateY(${currentY + floatY}px)`;
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    return function () {
        base = getComputedStyle(el).transform
    }
}

let OnCooldown = false

const BunnyWrapper = document.querySelector(".BunnyWrapper")
async function OnBlinkEvent(Condition) {
    const Chance = Math.random()

    if (Condition == "Page" && currentpage) {
        currentpage.style.overflow = "scroll"
    }

    if (Chance > 0) {
        const RandomHeight = Mods.randomInt(83, 88)
        const RandomPosition = Math.random() >= 0.5 ? Mods.randomInt(23 - (RandomHeight - 80) * 2, 25) : Mods.randomInt(65, 67 + (RandomHeight - 80) * 2)
        const newBun = document.createElement("img")
        const RandInt = Mods.randomInt(0, Buns.length - 1)
        newBun.src = `${Buns[RandInt]}`
        newBun.removeAttribute("style")
        newBun.classList.add("Bunny")

        newBun.style.top = `${RandomHeight}%`
        newBun.style.left = `${RandomPosition}%`

        newBun.style.height = `${RandomHeight - RandomHeight ^ 0.95}vh`
        newBun.style.width = `${RandomHeight - RandomHeight ^ 0.95}vh`

        newBun.style.transform = `translate(-50%, -50%)`
        newBun.style.transform = `scaleX(${RandomPosition > 50 ? 1 : -1})`

        BunnyWrapper.appendChild(newBun)

        await Mods.wait(500)
        Tween(800, Easing.linear, progress => {
            newBun.style.opacity = (1 - progress)
        }, () => {
            newBun.remove()
        }).play()
    }
}

async function blink(blinkButton) {
    if (InDepths) {
        Mods.CreateNotif("you're tired", ".normaltext", 5000, Easing.sineOut)
        return
    }
    if (OnCooldown) {
        const computedbutton = blinkButton.getBoundingClientRect()
        Mods.CreateNotif("on cooldown", ".normaltext", 1000, Easing.sineOut, { fromX: `${parseFloat(computedbutton.x) - 30}px`, fromY: `${parseFloat(computedbutton.y) - 60}px` }, { toX: `${parseFloat(computedbutton.x) - 30}px`, toY: `${parseFloat(computedbutton.y) - 110}px` })
        return
    }
    OnCooldown = true

    Tween(800, Easing.quadIn, progress => {
        uppereyelid.style.top = `${(-window.innerHeight / 2) * (1 - progress)}px`
    }).play()
    Tween(800, Easing.quadIn, progress => {
        lowereyelid.style.top = `${(window.innerHeight / 2) + (window.innerHeight / 2) * (1 - progress)}px`
    }).play()

    await Mods.wait(800)
    OnBlinkEvent()
    Blinksound.play()
    await Mods.wait(100)

    Tween(800, Easing.quadOut, progress => {
        uppereyelid.style.top = `${(-window.innerHeight / 2) * (progress)}px`
    }).play()
    Tween(800, Easing.quadOut, progress => {
        lowereyelid.style.top = `${(window.innerHeight / 2) + (window.innerHeight / 2) * (progress)}px`
    }).play()
    await Mods.wait(800)
    OnCooldown = false
}

const blinkbutton = document.querySelector(".blinkbutton")
blinkbutton.addEventListener(`click`, () => {
    blink(blinkbutton)
})

const pageawaybutton = document.querySelector(".putpageawaybutton")
pageawaybutton.addEventListener(`click`, async () => {
    const Page = currentpage
    if (Page) {
        const Classes = Array.from(Page.classList)
        Tween(500, Easing.linear, progress => {
            Page.style.opacity = 1 - progress
        }).play()

        await Mods.wait(500)
        Page.removeAttribute("style")

        currentpage = null
        currentpageparent = null

        for (const aclass of Classes) {
            console.log(aclass)
            Page.classList.add(String(aclass))
        }
        Page.style.opacity = 0
        Tween(300, Easing.linear, progress => {
            Page.style.opacity = progress
        }).play()
        Tween(300, Easing.linear, progress => {
            pageawaybutton.style.opacity = 1 - progress
        }, () => {
            pageawaybutton.style.opacity = 0
            pageawaybutton.style.display = "none"
        }).play()
    }
})

async function PagePickup(Node, PageClass) {
    if (currentpage) {
        return
    }
    currentpageparent = Node.parentNode
    currentpage = Node

    pageawaybutton.style.display = "block"

    Tween(300, Easing.linear, progress => {
        pageawaybutton.style.opacity = progress
    }).play()

    if (Node.dataset.pagetype == "bunny" && !InDepths) {
        Node.removeAttribute("style")
        Node.classList.add(PageClass)
        Node.style.display = "block" //yeah... specialpage gets hidden this took me so FUCKING LoNG to figure out GOD, i keep forgetting small shit
        PageWrapper.appendChild(Node)
        Tween(2500, Easing.sineInOut, progress => {
            Node.style.height = `${75 * progress}vh`
            Node.style.width = `${40 * progress}vw`
        }).play()
    }
    else {
        Node.style.transform = `translate(-50%, -50%) perspective(80vh) rotateX(0deg) rotateZ(0deg)`;
        Node.style.zIndex = 15

        const startRect = Node.getBoundingClientRect()
        Tween(1500, Easing.sineInOut, progress => {
            const top = Mods.lerp(startRect.top + startRect.height / 2, window.innerHeight * 0.5, progress)
            const left = Mods.lerp(startRect.left + startRect.width / 2, window.innerWidth * 0.5, progress)
            const height = Mods.lerp(startRect.height, window.innerHeight * 0.9, progress)
            const width = Mods.lerp(startRect.width, window.innerWidth * 0.35, progress)

            // Image.style.position = 'fixed'
            Node.style.top = `${top}px`
            Node.style.left = `${left}px`
            Node.style.width = `${width}px`
            Node.style.height = `${height}px`
        }).play()
    }

    await Mods.wait(2200)
    blink(blinkbutton)
}

const newSound = new Audio("assets/switch.mp3");
newSound.volume = 0.5
const staticimgs = document.querySelectorAll(".staticimg")

async function ScreenStatic() {
    newSound.play()

    for (let index = 0; index < 20; index++) {
        for (const statimg of staticimgs) {
            statimg.style.display = "none"
        }

        const RandomIndex = Math.floor(Math.random() * staticimgs.length)
        staticimgs[RandomIndex].style.display = "block"

        await Mods.wait(20)
    }

    for (const statimg of staticimgs) {
        statimg.style.display = "none"
    }
}

async function SwitchArea() {
    ScreenStatic()

    InDepths = !InDepths

    HeavenWrapper.style.display = InDepths ? "none" : "block"
    DepthWrapper.style.display = InDepths ? "block" : "none"

    thesky.style.display = InDepths ? "none" : "block"
    BackgroundImage.style.display = InDepths ? "none" : "block"

    blinkbutton.style.display = InDepths ? "none" : "block"

    for (const Cloud of document.querySelectorAll(".Cloud")) {
        Cloud.style.display = InDepths ? "none" : "block"
    }

    for (const Cloud of document.querySelectorAll(".DepthCloud")) {
        Cloud.style.display = InDepths ? "none" : "block"
    }

    if (InDepths) {
        Ambience.pause()
    } else {
        Ambience.play()
    }
}

const switchButton = document.querySelector(".switchbutton")
switchButton.addEventListener("click", async () => {
    SwitchArea()
})

let resizeGeneration = 0;
let activeTween = null;

async function ResizeEverything() {
    const myGeneration = ++resizeGeneration;
    activeTween?.stop?.();

    ResizeFrame.style.opacity = 1;

    const tween = Tween(500, Easing.linear, progress => {
        if (myGeneration !== resizeGeneration) return; // stale tween, stop touching the DOM
        ResizeFrame.style.opacity = 1 - progress;
    });
    activeTween = tween;

    async function TextUpdate() {
        const dots = ["resizing.", "resizing..", "resizing..."];
        for (const text of dots) {
            if (myGeneration !== resizeGeneration) return;
            MaintextNode.textContent = text;
            await Mods.wait(400);
        }
        if (myGeneration !== resizeGeneration) return;
        tween.play();
    }
    TextUpdate();

    for (const Page of document.querySelectorAll(".Page")) {
        const Classlist = Array.from(Page.classList)
        Page.removeAttribute("style")
        for (const aclass of Classlist) {
            Page.classList.add(String(aclass))
        }
    }

    for (const Page of document.querySelectorAll(".SpecialPage")) {
        const Classlist = Array.from(Page.classList)
        Page.removeAttribute("style")
        for (const aclass of Classlist) {
            Page.classList.add(String(aclass))
        }
    }
    currentpage = null
    currentpageparent = null

    pageawaybutton.style.display = "none"
    pageawaybutton.style.opacity = 0

    BunnyWrapper.removeAttribute("style")
    BunnyWrapper.classList.add("BunnyWrapper")

    Table.removeAttribute("style")
    Table.classList.add("Table")

    BackgroundImage.removeAttribute("style")
    BackgroundImage.classList.add("BackgroundImage") //bruh fuckass bullshit could ANYONE HAVE TOLD ME THIS EARLIER L ma o 

    thesky.removeAttribute("style")
    thesky.classList.add("thesky")

    uppereyelid.removeAttribute("style")
    uppereyelid.classList.add("upper-eyelid")

    lowereyelid.removeAttribute("style")
    lowereyelid.classList.add("lower-eyelid")

    for (const UpdateFunc of toUpdate) {
        UpdateFunc()
    }
    BackgroundImage.style.display = InDepths ? "none" : "block"
    thesky.style.display = InDepths ? "none" : "block"

    SubtextNode.textContent = `(${Subtext[Math.floor(Math.random() * Subtext.length)]})`;
}

document.querySelectorAll('.parallax').forEach(el => {
    toUpdate.push(addParallax(el))
});

document.querySelectorAll(`.pixelate`).forEach(element => {
    pixelate(element, 20)
});

const PagePickupSound = new Audio("assets/page hover.mp3");
PagePickupSound.volume = 0.5

document.querySelectorAll(".Page").forEach(Image => {
    if (Image.dataset.hitboxtype == null) {
        return
    }
    const PageHitbox = document.querySelector(`.${Image.dataset.hitboxtype}`);
    const PageTitle = PageHitbox.querySelector(`.PageTitle`);
    const computedtransform = getComputedStyle(Image).transform;
    const computedPage = getComputedStyle(PageTitle).top
    let startRect = Image.getBoundingClientRect()

    if (Image.dataset.hitboxtype.match("Depth")) {
        PageTitle.style.textShadow = "-2px -2px 0 #333, 2px -2px 0 #333, -2px 2px 0 #333, 2px 2px 0 #333;"
        PageTitle.style.filter = "invert()"
    }

    PageHitbox.addEventListener('mouseenter', () => {
        if (currentpage) {
            return
        }

        Image.style.transform = `translate(-50%, -50%) perspective(80vh) rotateX(0deg) rotateZ(0deg)`;
        PagePickupSound.pause()
        PagePickupSound.currentTime = 0

        PagePickupSound.play()

        startRect = Image.getBoundingClientRect()

        Tween(400, Easing.quartOut, progress => {
            PageTitle.style.opacity = progress
            PageTitle.style.top = `${parseFloat(computedPage) - 50 - (130 * progress)}px`
        }).play()
    });

    PageHitbox.addEventListener('mouseleave', () => {
        if (currentpage) {
            return
        }

        Image.style.transform = computedtransform

        Tween(400, Easing.sineIn, progress => {
            PageTitle.style.opacity = 1 - progress
            PageTitle.style.top = `${parseFloat(computedPage) - (180 * (1 - progress))}px`
        }).play()
    });

    PageHitbox.addEventListener(`click`, () => {
        if (currentpage) {
            return
        }
        PagePickup(Image, Image.dataset.mainclass, startRect)
        Tween(400, Easing.sineIn, progress => {
            PageTitle.style.opacity = 1 - progress
            PageTitle.style.top = `${parseFloat(computedPage) - (150 * (1 - progress))}px`
        }).play()
    })
});

let str = ""
document.addEventListener('keydown', (event) => {
    str = str + event.key
    document.querySelectorAll(".SpecialPage").forEach(Image => {
        if (str.includes(Image.dataset.pagetype) && Image.dataset.pagetype == "bunny") {
            PagePickup(Image, "SpecialPage")
            str = ""
        }
    });
})

window.addEventListener("resize", () => ResizeEverything())

const Dir = [
    "assets/clouds/clouds-png-13369.png",
    "assets/clouds/cloudatious.png"
]

const Statics = [
    "assets/Noise/Noise1.png",
    "assets/Noise/Noise2.png",
    "assets/Noise/Noise3.png"
]

async function CloudStatic(DomObj) {
    for (let ind = 0; ind < 10; ind++) {
        for (const NoiseSrc of Statics) {
            console.log(NoiseSrc)
            DomObj.src = NoiseSrc

            await Mods.wait(20)
        }
    }
}

async function cloudSpawn() {
    while (true) {
        const Chance = Math.random()

        if (Chance > 0.90 && InDepths == false) {
            let DepthCloud = false

            if (Math.random() > 0.99) {
                DepthCloud = true
            }

            const RandInt = Mods.randomInt(0, Dir.length - 1) // directories or arrays start at 0 bro i DONT KNOW WHY what the FUCK is this logic i'm finna crash out bro
            const Img = document.createElement("img")
            Img.src = `${Dir[RandInt]}`
            Img.removeAttribute("style")
            if (DepthCloud) {
                Img.classList.add("DepthCloud") // only important for the static effect thing
                Img.style.filter = "brightness(0.9)"
                Img.addEventListener("click", async () => {
                    thesky.style.opacity = 0
                    Img.style.width = `${Img.style.height}`
                    InDepthCloudTransition = true
                    await CloudStatic(Img)
                    thesky.style.opacity = 1
                    InDepthCloudTransition = false
                    Img.remove()
                }, { once: true })
            } else {
                Img.classList.add("Cloud")
            }
            pixelate(Img, 20)
            Img.style.height = `${Mods.randomInt(150, 300)}px`
            Img.style.top = `${Mods.randomInt(window.innerHeight * 0.05, window.innerHeight * 0.8)}px`
            HeavenWrapper.appendChild(Img)

            let StartingPaws
            let EndPaws
            let Direction

            if (Math.random() > 0.5) {
                Direction = "Left"
                StartingPaws = window.innerWidth + 1000
                EndPaws = -500
            } else {
                Direction = "Right"
                StartingPaws = -500
                EndPaws = window.innerWidth + 1000
            }

            if (Math.random() > 0.5) {
                Img.style.transform = `scaleX(-1)`
            }

            Tween(Mods.randomInt(45000, 50000), Easing.linear, progress => {
                if (Direction == "Left") {
                    Img.style.left = `${EndPaws + (StartingPaws * (1 - progress))}px`
                } else {
                    Img.style.left = `${StartingPaws + (EndPaws * progress)}px`
                }
            }, () => {
                Img.remove()
            }).play()
        }
        await Mods.wait(1000)
    }
}
cloudSpawn()

await Mods.wait(500)

DepthWrapper.style.display = "none"

const OverlayNode = document.querySelector(".Overlay")
Tween(1000, Easing.linear, progress => {
    OverlayNode.style.opacity = 1 - progress
}, () => {
    OverlayNode.remove()
}).play()