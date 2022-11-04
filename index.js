function createPoint(x, y, name, color) {
    var point = document.createElement("div");
    var styles = 'border: 1px solid black; '
        + 'width: 10px; '
        + 'height: 10px; '
        + 'border-radius: 5px; '
        + 'background-color: ' + color + '; ';
    point.setAttribute('style', styles);
    var point_container = document.createElement("div");
    var styles_container = 'position: absolute; '
        + 'top: ' + y + 'px; '
        + 'left: ' + x + 'px; '
        + 'transform: translate(-50%, -75%); '
        + 'font-weight: 900; '
        + 'font-size: 20px; ';
    point_container.setAttribute('style', styles_container);
    point_container.appendChild(document.createTextNode(name));
    point_container.appendChild(point);
    return point_container;
}

function createLineElement(x, y, length, angle, color) {
    var line = document.createElement("div");
    var styles = 'border: 1px solid ' + color + '; '
        + 'width: ' + length + 'px; '
        + 'height: 0px; '
        + '-moz-transform: rotate(' + angle + 'rad); '
        + '-webkit-transform: rotate(' + angle + 'rad); '
        + '-o-transform: rotate(' + angle + 'rad); '
        + '-ms-transform: rotate(' + angle + 'rad); '
        + 'position: absolute; '
        + 'top: ' + y + 'px; '
        + 'left: ' + x + 'px; ';
    line.setAttribute('style', styles);
    return line;
}

function createLine(x1, y1, x2, y2, color) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha, color);
}

function translatePoint(p, frame) {
    xa_min = 64;
    ya_max = document.getElementsByClassName('display')[0].clientHeight - 64;
    ya_min = 64;
    xa_max = document.getElementsByClassName('display')[0].clientWidth - 64;
    var sx = (xa_max - xa_min) / (frame.y_max - frame.y_min);
    var sy = (ya_max - ya_min) / (frame.x_max - frame.x_min);
    var x_offset = 0;
    var y_offset = 0;
    if (sx < sy) {
        sy = sx;
        y_offset = (ya_max - ya_min - sy * (frame.x_max - frame.x_min)) / 2;
    } else {
        sx = sy;
        x_offset = (xa_max - xa_min - sx * (frame.y_max - frame.y_min)) / 2;
    }
    var xa = xa_max + (p.y - frame.y_max) * sy - x_offset;
    var ya = ya_max + (frame.x_min - p.x) * sx - y_offset;
    return { x: xa, y: ya };
}

function getIntersectionPoint(pA, pB, pC, pD) {
    var x = (((pA.x * pB.y - pA.y * pB.x) * (pC.x - pD.x) - (pA.x - pB.x) * (pC.x * pD.y - pC.y * pD.x)) / ((pA.x - pB.x) * (pC.y - pD.y) - (pA.y - pB.y) * (pC.x - pD.x))).toFixed(3);
    var y = (((pA.x * pB.y - pA.y * pB.x) * (pC.y - pD.y) - (pA.y - pB.y) * (pC.x * pD.y - pC.y * pD.x)) / ((pA.x - pB.x) * (pC.y - pD.y) - (pA.y - pB.y) * (pC.x - pD.x))).toFixed(3);
    return { x: x, y: y };
}

// function drawFrame() {
//     var frame = document.createElement("div");
//     var styles = 'border: 1px solid black; '
//         + 'width: ' + (document.getElementsByClassName('display')[0].clientWidth - 128) + 'px; '
//         + 'height: ' + (document.getElementsByClassName('display')[0].clientHeight - 128) + 'px; '
//         + 'position: absolute; '
//         + 'top: 64px; '
//         + 'left: 64px; ';
//     frame.setAttribute('style', styles);
//     document.getElementsByClassName('display')[0].appendChild(frame);
// }

function drawLines(pA, pB, pC, pD, color1 = "red", color2 = "blue") {
    document.getElementsByClassName('display')[0].appendChild(createLine(pA.x, pA.y, pB.x, pB.y, color1));
    document.getElementsByClassName('display')[0].appendChild(createLine(pC.x, pC.y, pD.x, pD.y, color2));
}

var textFileUrl = null;
function generateTextFileUrl(txt) {
    let fileData = new Blob([txt], { type: 'text/plain' });
    if (textFileUrl !== null) {
        window.URL.revokeObjectURL(textFileUrl);
    }
    textFileUrl = window.URL.createObjectURL(fileData);
    return textFileUrl;
};

var out_file_content = "";
function draw(line1_color = "red", line2_color = "blue") {
    var pA = { x: document.getElementById('xA').value, y: document.getElementById('yA').value };
    var pB = { x: document.getElementById('xB').value, y: document.getElementById('yB').value };
    var pC = { x: document.getElementById('xC').value, y: document.getElementById('yC').value };
    var pD = { x: document.getElementById('xD').value, y: document.getElementById('yD').value };

    var pt = getIntersectionPoint(pA, pB, pC, pD);
    var xs = [pA.x, pB.x, pC.x, pD.x, pt.x].sort(function (a, b) { return a - b })
    var ys = [pA.y, pB.y, pC.y, pD.y, pt.y].sort(function (a, b) { return a - b })
    var frame = { x_min: xs[0], x_max: xs[4], y_min: ys[0], y_max: ys[4] };
    pa = translatePoint(pA, frame);
    pb = translatePoint(pB, frame);
    pc = translatePoint(pC, frame);
    pd = translatePoint(pD, frame);
    p_t = translatePoint(pt, frame);

    document.getElementById('xP').value = pt.x;
    document.getElementById('yP').value = pt.y;

    document.getElementsByClassName('display')[0].innerHTML = '';
    // drawFrame()

    drawLines(pa, pb, pc, pd, line1_color, line2_color);
    var display = document.getElementsByClassName('display')[0]
    display.appendChild(createPoint(pa.x, pa.y, "A", line1_color));
    display.appendChild(createPoint(pb.x, pb.y, "B", line1_color));
    display.appendChild(createPoint(pc.x, pc.y, "C", line2_color));
    display.appendChild(createPoint(pd.x, pd.y, "D", line2_color));
    display.appendChild(createPoint(p_t.x, p_t.y, "P", "green"));
    out_file_content = "A " + pA.x + " " + pA.y + "\n" + "B " + pB.x + " " + pB.y + "\n" + "C " + pC.x + " " + pC.y + "\n" + "D " + pD.x + " " + pD.y + "\n" + "P " + pt.x + " " + pt.y + "\n";

    document.getElementById('downloadLink').href = generateTextFileUrl(out_file_content);
}

draw();

[...document.getElementsByTagName('input')].forEach(item => {
    item.addEventListener('change', draw);
})

document.getElementById("filetoRead").addEventListener("change", function () {
    var file = this.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (evt) {
            points = evt.target.result.replaceAll("\r", "").split("\n");
            for (let i = 0; i < 4; i++) {
                const elements = points[i].split(" ");
                document.getElementById('x' + elements[0]).value = elements[1];
                document.getElementById('y' + elements[0]).value = elements[2];
            }
            draw();
        };

        reader.onerror = function (evt) {
            console.error("An error ocurred reading the file", evt);
        };

        reader.readAsText(file, "UTF-8");
    }
}, false);

document.body.addEventListener("scroll", draw)

document.getElementById("line-color1").addEventListener("input", watchColorPicker1, false);
document.getElementById("line-color1").addEventListener("change", watchColorPicker1, false);

function watchColorPicker1(event) {
    document.getElementById("line-color1").style.backgroundColor = event.target.value;
    draw(event.target.value, document.getElementById("line-color2").value);
}

document.getElementById("line-color2").addEventListener("input", watchColorPicker2, false);
document.getElementById("line-color2").addEventListener("change", watchColorPicker2, false);

function watchColorPicker2(event) {
    document.getElementById("line-color2").style.backgroundColor = event.target.value;
    draw(document.getElementById("line-color1").value, event.target.value);
}
