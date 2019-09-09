export function scanLineWorker() {
    function isBlankArea(pointColor) {
        return pointColor && pointColor[3] < 10;
    }

    function isSameColor(color1, color2) {
        return (
            color1[0] === color2[0] &&
            color1[1] === color2[1] &&
            color1[2] === color2[2]
        );
    }
    function scanLine(x, y, filledColor, canvasWith, canvasHeight, cacheMap) {
        const seedStack = [];

        seedStack.push([x, y]);

        var currentPoint;
        var xLeft, xRight;

        function getPointColor(x, y) {
            if (x > canvasHeight || y > canvasWith) {
                return [255, 255, 255, 255];
            }
            return cacheMap.get(`${x},${y}`);
        }

        function fillColor(x, y, filledColor) {
            cacheMap.set(`${x},${y}`, filledColor);
        }

        function getNextSeed(positionY, xLeft, xRight) {
            var candidateSeed = 0;
            for (let i = xLeft; i <= xRight; i++) {
                pointColor = getPointColor(i, positionY);
                if (
                    isBlankArea(pointColor) &&
                    !isSameColor(pointColor, filledColor)
                ) {
                    candidateSeed = i;
                }
            }
            if (candidateSeed) {
                seedStack.push([candidateSeed, positionY]);
            }
        }
        while (seedStack.length) {
            currentPoint = seedStack.pop();

            let positionX = currentPoint[0];
            let positionY = currentPoint[1];
            xLeft = positionX;
            xRight = positionX;

            let i = 0;
            var pointColor;
            // find xLeft
            do {
                pointColor = getPointColor(positionX - i, positionY);
                fillColor(positionX - i, positionY, filledColor);
                i++;
                xLeft = positionX - i;
            } while (isBlankArea(pointColor));
            //find xRight
            i = 1;
            do {
                pointColor = getPointColor(positionX + i, positionY);
                fillColor(positionX + i, positionY, filledColor);
                i++;
                xRight = positionX + i;
            } while (isBlankArea(pointColor));

            getNextSeed(positionY + 1, xLeft, xRight);
            getNextSeed(positionY - 1, xLeft, xRight);
        }
    }

    onmessage = function(event) {
        const {
            mapArr,
            x,
            y,
            filledColor,
            canvasHeight,
            canvasWith
        } = JSON.parse(event.data);
        const cacheMap = new Map(mapArr);
        scanLine(x, y, filledColor, canvasWith, canvasHeight, cacheMap);
        this.postMessage(JSON.stringify([...cacheMap]));
    };
}
