class RNG {
    constructor(seed) {
        // LCG using GCC's constants
        this.m = 0x80000000; // 2**31;
        this.a = 1103515245;
        this.c = 12345;

        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }

    nextInt() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    nextFloat() {
        // returns in range [0,1]
        return this.nextInt() / (this.m - 1);
    }

    nextRange(start, end) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        var rangeSize = end - start;
        var randomUnder1 = this.nextInt() / this.m;
        return start + Math.floor(randomUnder1 * rangeSize);
    }

    choice(array) {
        return array[this.nextRange(0, array.length)];
    }
}

function randf_range(min, max, rng) {
    let diff = max - min;
    let roll = rng.nextFloat() * diff;
    return roll + min;
}

function randi_range(min, max, rng) {
    let diff = max - min;
    let roll = rng.nextFloat() * diff;
    return Math.floor(roll + min);
}

function shuffle(array, rng) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(rng.nextFloat() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

function get_random_baseline_color(rng) {
    let col1 = randf_range(70, 150, rng);
    let col2 = randf_range(50, Math.min(70, col1 - 5), rng);
    let col3 = randf_range(25, 35, rng);

    let col = [col1, col2, col3];
    return col;
}

function get_random_detail_color(baseline, rng) {
    let detCol1 = baseline[0] * randf_range(1.5, 1.75, rng);
    let detCol2 = baseline[1] * randf_range(1.5, 1.75, rng);
    let detCol3 = baseline[2] * randf_range(1.5, 1.75, rng);

    return [detCol1, detCol2, detCol3];
}

function get_random_highlight_color(rng) {
    let highlightCol1 = randf_range(150, 175, rng);
    let highlightCol3 = randf_range(35, 50, rng);

    return [highlightCol1, 255, highlightCol3];
}

function clamp(color) {
    for (let i = 0; i < color.length; i++) {
        const v = color[i];
        color[i] = Math.floor(Math.max(0, Math.min(v, 255)));
    }
}

function set_color(element_id, color) {
    let baseline_bg = document.getElementById(element_id);
    baseline_bg.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function reroll() {
    let rng = new RNG(Math.random()*2**32)

    let baseline = get_random_baseline_color(rng);
    let detail = get_random_detail_color(baseline, rng);
    let highlight = get_random_highlight_color(rng);

    let shuffle_seed = rng.nextInt()
    
    shuffle(baseline, new RNG(shuffle_seed));
    shuffle(detail, new RNG(shuffle_seed));
    shuffle(highlight, new RNG(shuffle_seed));

    clamp(baseline);
    clamp(detail);
    clamp(highlight);

    set_color("baseline", baseline);
    set_color("detail", detail);
    set_color("highlight", highlight);

    console.log(baseline);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("reroll").addEventListener("click", reroll)
});