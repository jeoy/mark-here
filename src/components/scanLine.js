import { scanLineWorker } from '../webWorker/worker.js';
import WebWorker from '../webWorker/workerSetup';

const COLOR_DIM = 4;

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

export function scanLine(ctx, x, y, filledColor, canvasWith, canvasHeight) {
    var seedStack = [];

    seedStack.push([x, y]);
    var cacheMap = imageToMap(canvasWith, canvasHeight, ctx);
    //step 2
    var myWorker = new WebWorker(scanLineWorker);
    console.time('scanLine');

    myWorker.addEventListener(
        'message',
        function(event) {
            cacheMap = new Map(JSON.parse(event.data));
            mapToImage(cacheMap, canvasWith, canvasHeight, ctx);
            console.timeEnd('scanLine');
        },
        false
    );
    const sendData = {
        mapArr: [...cacheMap],
        x,
        y,
        filledColor,
        canvasWith,
        canvasHeight
    };
    myWorker.postMessage(JSON.stringify(sendData)); // start the worker.
}
