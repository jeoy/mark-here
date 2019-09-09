const COLOR_DIM = 4;

function isSameColor(color1, color2) {
    return (
        color1[0] === color2[0] &&
        color1[1] === color2[1] &&
        color1[2] === color2[2]
    );
}

function isBlankArea(targetColor) {
    return targetColor && targetColor[3] < 10;
}

function imageToMap(canvasWith, canvasHeight, ctx) {
    var cacheMap = new Map();
    const dataArr = ctx.getImageData(0, 0, canvasWith, canvasHeight).data;

    let index = 0;
    for (let i = 0; i < canvasHeight + 1; i++) {
        for (let j = 0; j < canvasWith + 1; j++) {
            index = i * canvasWith + j;
            cacheMap.set(
                `${i},${j}`,
                Array(
                    ...dataArr.slice(index * COLOR_DIM, (index + 1) * COLOR_DIM)
                )
            );
        }
    }
    return cacheMap;
}

function mapToImage(cacheMap, canvasWith, canvasHeight, ctx) {
    var imgData = ctx.createImageData(canvasWith, canvasHeight);
    let index = 0;
    for (let i = 0; i < canvasHeight; i++) {
        for (let j = 0; j < canvasWith; j++) {
            index = i * canvasWith + j;
            for (let k = 0; k < COLOR_DIM; k++) {
                imgData.data[index * COLOR_DIM + k] = cacheMap.get(`${i},${j}`)[
                    k
                ];
            }
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

export function scanLine(ctx, x, y, rgba, canvasWith, canvasHeight) {
    var seedStack = [];

    seedStack.push([x, y]);
    const cacheMap = imageToMap(canvasWith, canvasHeight, ctx);
    //step 2
    var currentPoint;
    var xLeft, xRight;

    function getPointColor(cacheMap, x, y) {
        if (x > canvasHeight || y > canvasWith) {
            return [255, 255, 255, 255];
        }
        return cacheMap.get(`${x},${y}`);
    }

    function fillColor(x, y, rgba) {
        cacheMap.set(`${x},${y}`, rgba);
    }
    var myWorker = new Worker('./worker_demo.js');

    myWorker.addEventListener(
        'message',
        function(event) {
            console.log('Worker said : ' + event.data);
        },
        false
    );

    myWorker.postMessage('hello my worker'); // start the worker.
    return;
    while (seedStack.length) {
        currentPoint = seedStack.pop();

        let [positionX, positionY] = currentPoint;
        xLeft = positionX;
        xRight = positionX;

        let i = 1;
        var targetColor = getPointColor(cacheMap, positionX - i, positionY);

        while (isBlankArea(targetColor)) {
            fillColor(positionX - i, positionY, rgba);
            xLeft = positionX - i;
            i++;
            targetColor = getPointColor(cacheMap, positionX - i, positionY);
        }
        //find xRight
        i = 1;
        targetColor = getPointColor(cacheMap, positionX + i, positionY);
        while (isBlankArea(targetColor)) {
            fillColor(positionX + i, positionY, rgba);
            i++;
            xRight = positionX + i;
            targetColor = getPointColor(cacheMap, positionX + i, positionY);
        }
        //find y+1's seed
        var candidateSeed = 0;
        let ytop = positionY + 1;
        for (let i = xLeft; i <= xRight; i++) {
            targetColor = getPointColor(cacheMap, i, ytop);
            if (isBlankArea(targetColor) && !isSameColor(targetColor, rgba)) {
                candidateSeed = i;
            }
        }
        if (candidateSeed) {
            seedStack.push([candidateSeed, ytop]);
        }

        //find y-1's seed
        candidateSeed = 0;
        let ybottom = positionY - 1;
        for (let i = xLeft; i <= xRight; i++) {
            targetColor = getPointColor(cacheMap, i, ybottom);
            if (isBlankArea(targetColor) && !isSameColor(targetColor, rgba)) {
                candidateSeed = i;
            }
        }
        if (candidateSeed) {
            seedStack.push([candidateSeed, ybottom]);
            // console.log(candidateSeed,positionY-1)
        }
    }

    mapToImage(cacheMap, canvasWith, canvasHeight, ctx);
}
