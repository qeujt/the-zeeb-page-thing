import { Easing, Tween } from "./TweenLib.js";
import { Mods } from "./Mods.js";

//hot dawwggguuuguhhugggg nodes are what the call an instance in lua, i guess for web deving ya
async function AfterImagesKnight(Image) {
    let enabled = true
    async function Loop() {
        while (enabled) {
            const clonedImage = Image.cloneNode(true);
            const rect = Image.getBoundingClientRect();
            const StartX = parseFloat(getComputedStyle(Image).left);
            const StartY = parseFloat(getComputedStyle(Image).top);
            let Distance = 200

            if (!Image.dataset.flipped) {
                Distance = -200
            }

            clonedImage.draggable = false
            clonedImage.style.position = "absolute";
            clonedImage.style.top = `${StartY}px`;
            clonedImage.style.zIndex = -1

            document.body.appendChild(clonedImage);

            Tween(1000, Easing.linear, progress => {
                clonedImage.style.left = `${StartX + (Distance * progress)}px`;
            });

            Tween(1000, Easing.linear, progress => {
                clonedImage.style.opacity = 0.65 - (0.65 * progress);
            }, () => {
                clonedImage.remove()
            });
            await Mods.wait(100)
        }
    }
    Loop()
    return {
        Toggle: function () {
            enabled = !enabled;
            Loop()
        }
    }
}

async function KnightIdle(Image) {
    const BounceDistance = 80
    let OriginPoint = parseFloat(getComputedStyle(Image).top)
    let StartingTop = OriginPoint - BounceDistance / 2; //basically half of the distance
    async function Loop() {
        StartingTop = parseFloat(getComputedStyle(Image).top) - BounceDistance / 2

        while (Image.dataset.isidle) {
            await Tween(1000, Easing.sineInOut, progress => {
                if (Image.dataset.isidle == "false") return
                Image.style.top = `${StartingTop + (BounceDistance - (BounceDistance * progress))}px`
            })

            await Mods.wait(1000)

            if (Image.dataset.isidle == "false") break

            await Tween(1000, Easing.sineInOut, progress => {
                if (Image.dataset.isidle == "false") return
                Image.style.top = `${StartingTop + (BounceDistance * progress)}px`
            })

            await Mods.wait(1000)
        }
    }
    Loop()

    return {
        Toggle: function () {
            Image.dataset.isidle = Mods.InverseStringBool(Image.dataset.isidle);
            Loop()
        }
    }
}

async function MoveKnight(KnightNode, { left, top }) {
    const StartX = parseFloat(getComputedStyle(KnightNode).left);
    const StartY = parseFloat(getComputedStyle(KnightNode).top);
    const IntX = Mods.randomInt(500, 800)
    const IntY = Mods.randomInt(500, 800)

    KnightNode.dataset.isidle = "false"

    Tween(IntX, Easing.sineInOut, progress => {
        KnightNode.style.left = `${StartX + (left - StartX) * progress}px`
    })
    Tween(IntY, Easing.sineInOut, progress => {
        KnightNode.style.top = `${StartY + (top - StartY) * progress}px`
    })

    const rect = KnightNode.getBoundingClientRect();
    const centerX = left + rect.width / 2;
    const isLeftSide = centerX < window.innerWidth / 2;

    if (!isLeftSide && !KnightNode.dataset.flipped && KnightNode.dataset.hasflipped) {
        Tween(250, Easing.sineInOut, progress => {
            const scale = -1 + progress * 2; // animates -1 → 1
            KnightNode.style.transform = `scaleX(${scale})`;
        });
        KnightNode.dataset.flipped = "true";
    } else if (isLeftSide && KnightNode.dataset.flipped || !KnightNode.dataset.hasflipped) {
        Tween(250, Easing.sineInOut, progress => {
            const scale = 1 - progress * 2; // animates 1 → -1
            KnightNode.style.transform = `scaleX(${scale})`;
        });
        KnightNode.dataset.hasflipped = "true"
        delete KnightNode.dataset.flipped;
    }

    if (IntX >= IntY)
        return IntX - 10

    else
        return IntY - 10
}

document.querySelectorAll(".AfterImages").forEach(Image => AfterImagesKnight(Image));
document.querySelectorAll(".RoaringKnight").forEach(async Image => {
    let Knight = await KnightIdle(Image)
    Knight.Toggle()
    await Mods.wait(2000)
    while (true) {
        const WaitTime = await MoveKnight(Image, { left: Mods.randomInt(window.innerWidth / 10, window.innerWidth - window.innerWidth / 5), top: Mods.randomInt(window.innerHeight / 5, window.innerHeight - window.innerHeight / 4) })
        await Mods.wait(WaitTime)
    }
});

document.querySelectorAll(".ClickButton").forEach(Node => {
    if (Node.dataset.feature == "Play Black Knife") {
        const Sound = new Audio("Ass/Black Knife.mp3");
        Sound.loop = true
        Sound.volume = 0.33

        Node.addEventListener("click", () => {
            if (Sound.paused) {
                Sound.play()
                Node.textContent = "stop playing Black Knife"
            } else {
                Sound.pause()
                Sound.currentTime = 0
                Node.textContent = "play Black Knife"
            }
            Mods.FitText(Node)
        })
    }
    Mods.FitText(Node)
})

document.querySelectorAll(".OptionButton").forEach(image => {
    let Opened = true
    const optionFrame = document.querySelector(".ScrollFrame")
    const OriginLeft = parseFloat(getComputedStyle(optionFrame).left)
    image.addEventListener(`click`, () => {
        const width = parseFloat(getComputedStyle(optionFrame).width)
        if (Opened) { // opened
            optionFrame.style.display = "none"
        } else {
            optionFrame.style.display = "block"
        }
        Opened = !Opened
    });
})

document.querySelectorAll(".HoverEffect").forEach(image => {
    image.addEventListener(`mouseover`, () => {
        Tween(100, Easing.linear, progress => {
            image.style.filter = `invert(${progress})`
        })
    })
    image.addEventListener(`mouseout`, () => {
        Tween(100, Easing.linear, progress => {
            image.style.filter = `invert(${1 - progress})`
        })
    })
})

window.addEventListener("resize", function () {
    document.querySelectorAll(".ClickButton").forEach(Node => {
        Mods.FitText(Node)
    })
})