

onmessage = async (event) => {
    const {
        level,
        bufferA,
        bufferB,
        begin,
        end
    } = event.data;

    if(end - begin <= 1) {
        return postMessage(1);
    }

    const A = new Uint32Array(bufferA);
    const B = new Uint32Array(bufferB);
    const middle = Math.floor((begin + end) / 2);

    const firstHalfWorker = new Worker('sort-worker.js');
    const firstHalfPromise = new Promise((resolve) => {
        firstHalfWorker.onmessage = (event) => {
            resolve(event.data);
        };
        firstHalfWorker.postMessage({ level: level+1, bufferA: bufferB, bufferB: bufferA, begin: begin, end: middle });
    });
    
    const secondHalfWorker = new Worker('sort-worker.js');
    const secondHalfPromise = new Promise((resolve) => {
        secondHalfWorker.onmessage = (event) => {
            resolve(event.data);
        };
        secondHalfWorker.postMessage({ level: level+1, bufferA: bufferB, bufferB: bufferA, begin: middle, end: end });
    });

    const [firstHalfWorkersUsed, secondHalfWorkersUsed] = await Promise.all([firstHalfPromise, secondHalfPromise]);
    // Once we've got the array back from the worker, we terminate it.
    firstHalfWorker.terminate();
    secondHalfWorker.terminate();

    topDownMerge(B, begin, middle, end, A);

    postMessage(firstHalfWorkersUsed+secondHalfWorkersUsed+1);
};

function topDownMerge(A, begin, middle, end, B) {
    let i = begin;
    let j = middle;
    for (let k = begin; k < end; k++) {
        if (i < middle && (j >= end || A[i] <= A[j])) {
            B[k] = A[i];
            i++;
        } else {
            B[k] = A[j];
            j++;
        }
    }
}