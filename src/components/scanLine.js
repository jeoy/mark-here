var seedStack = [];
const maxStack = 10000
function getPointColor(ctx, x, y) {
    let res = ctx.getImageData(x, y, 1, 1).data;
    return res
}

function isSameColor(color1, color2) {
    return (
        color1[0] === color2[0] &&
        color1[1] === color2[1] &&
        color1[2] === color2[2]
    );
}
var count = 0;
export function getTime(ctx) {
    console.time('getImageData');
    for (let i = 0; i < 100; i++) {
        getPointColor(ctx, 1, 1);
    }
    console.timeEnd('getImageData');
}
export function scanLine(ctx, x, y, rgba) {
    seedStack.push([x, y]);
    var newOGC = ctx;
    //step 2
    var currentPoint;
    var xLeft, xRight;

    function fillColor2(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }

    function fillColor(x, y, rgba) {
        var imgData = newOGC.createImageData(1, 1);
        imgData.data[0] = rgba[0];
        imgData.data[1] = rgba[1];
        imgData.data[2] = rgba[2];
        imgData.data[3] = rgba[3];
        newOGC.putImageData(imgData, x, y);
    }
    while (seedStack.length) {
        count = 0;
        if (seedStack.length > maxStack) {
            console.log('栈溢出');
            return;
        }
        currentPoint = seedStack.pop();
        console.log(currentPoint[0], currentPoint[1]);

        var targetColor = getPointColor(
            newOGC,
            currentPoint[0],
            currentPoint[1]
        );

        // isFill = false
        xLeft = currentPoint[0];
        xRight = currentPoint[0];

        //find xleft
        let i = 1;
        targetColor = getPointColor(
            newOGC,
            currentPoint[0] - i,
            currentPoint[1]
        );

        while (targetColor[3] < 10) {
            count++;
            if (count > maxStack) {
                console.log('栈溢出');
                return;
            }

            fillColor(currentPoint[0] - i, currentPoint[1], rgba);
            xLeft = currentPoint[0] - i;
            i++;
            targetColor = getPointColor(
                newOGC,
                currentPoint[0] - i,
                currentPoint[1]
            );
        }

        //find xRight
        i = 0;
        targetColor = getPointColor(
            newOGC,
            currentPoint[0] + i,
            currentPoint[1]
        );
        while (targetColor[3] < 10) {
            count++;
            if (count > maxStack) {
                console.log('栈溢出');
                return;
            }
            fillColor(currentPoint[0] + i, currentPoint[1], rgba);
            i++;
            xRight = currentPoint[0] + i;
            targetColor = getPointColor(
                newOGC,
                currentPoint[0] + i,
                currentPoint[1]
            );
        }
        // console.log(xLeft,xRight)

        //find y+1's seed
        var candidateSeed = 0;
        let ytop = currentPoint[1] + 1;
        for (let i = xLeft; i <= xRight; i++) {
            count++;
            if (count > maxStack) {
                console.log('栈溢出');
                return;
            }
            targetColor = getPointColor(newOGC, i, ytop);
            if (targetColor[3] < 10 && !isSameColor(targetColor, rgba)) {
                candidateSeed = i;
            } else {
                targetColor = getPointColor(newOGC, i - 1, ytop);
                if (targetColor[3] < 10 && !isSameColor(targetColor, rgba)) {
                    seedStack.push([i - 1, ytop]);
                }
            }
        }
        if (candidateSeed) {
            seedStack.push([candidateSeed, ytop]);
        }

        //find y-1's seed
        candidateSeed = 0;
        let ybottom = currentPoint[1] - 1;
        for (let i = xLeft; i <= xRight; i++) {
            count++;
            if (count > maxStack) {
                console.log('栈溢出');
                return;
            }
            targetColor = getPointColor(newOGC, i, ybottom);
            if (targetColor[3] < 10 && !isSameColor(targetColor, rgba)) {
                candidateSeed = i;
            } else {
                targetColor = getPointColor(newOGC, i - 1, ybottom);
                if (targetColor[3] < 10 && !isSameColor(targetColor, rgba)) {
                    seedStack.push([i - 1, ybottom]);
                    // console.log(i - 1,currentPoint[1]-1)
                }
            }
        }
        if (candidateSeed) {
            seedStack.push([candidateSeed, ybottom]);
            // console.log(candidateSeed,currentPoint[1]-1)
        }
    }
}
