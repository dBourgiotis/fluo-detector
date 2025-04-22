import cv from '@techstark/opencv-js';

export interface FluorescenceResult {
  areaPx: number;
  meanIntensity: number;
  overlay: HTMLCanvasElement;
}
export const useFindFluo = () => {

  async function detectFluorescence(
    onFile: HTMLImageElement,
    offFile: HTMLImageElement
  ): Promise<FluorescenceResult> {

    /* -------- 1. load & align ------------------------------------------- */
    const imgOn = cv.imread(onFile);
    const imgOff = cv.imread(offFile);
    const aligned = eccAlign(imgOn, imgOff); // defined just below

    /* -------- 2. intensity match & diff --------------------------------- */
    const normOn = matchMean(aligned, imgOff);
    const diff = new cv.Mat();
    cv.absdiff(toGray(normOn), toGray(imgOff), diff);

    /* -------- 3. mask via Otsu & opening -------------------------------- */
    const mask = new cv.Mat();
    cv.threshold(diff, mask, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
    const k = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3));
    cv.morphologyEx(mask, mask, cv.MORPH_OPEN, k);

    /* -------- 4. stats --------------------------------------------------- */
    const stats = new cv.Mat(),
      centroids = new cv.Mat(),
      labels = new cv.Mat();
    const n = cv.connectedComponentsWithStats(mask, labels, stats, centroids);
    let areaPx = 0;
    for (let i = 1; i < n; ++i) areaPx += stats.intPtr(i, cv.CC_STAT_AREA)[0];
    const mean = cv.mean(normOn, mask)[0];

    /* -------- 5. overlay ------------------------------------------------- */
    const overlay = aligned.clone();
    overlay.setTo(new cv.Scalar(0, 255, 255, 255), mask); // yellow tint
    const vis = new cv.Mat();
    cv.addWeighted(aligned, 0.7, overlay, 0.3, 0, vis);

    const canvas = document.createElement("canvas");
    cv.imshow(canvas, vis); // ready to append to the DOM

    /* -------- cleanup ---------------------------------------------------- */
    [
      imgOn,
      imgOff,
      aligned,
      normOn,
      diff,
      mask,
      stats,
      centroids,
      labels,
      overlay,
      vis,
    ].forEach((m) => m.delete());

    return { areaPx, meanIntensity: mean, overlay: canvas };
  }

  /* ---------------- internal helpers -------------------------------------- */
  function toGray(src: cv.Mat): cv.Mat {
    const g = new cv.Mat();
    cv.cvtColor(src, g, cv.COLOR_RGBA2GRAY);
    return g;
  }

  function eccAlign(srcOn: cv.Mat, srcOff: cv.Mat): cv.Mat {
    const gOn = toGray(srcOn),
      gOff = toGray(srcOff);
    const warp = cv.Mat.eye(2, 3, cv.CV_32F);
    const crit = new cv.TermCriteria(
      cv.TermCriteria_EPS | cv.TermCriteria_COUNT,
      50,
      1e-6
    );
    cv.findTransformECC(gOff, gOn, warp, cv.MOTION_AFFINE, crit, new cv.Mat(), 5);
    const out = new cv.Mat();
    cv.warpAffine(
      srcOn,
      out,
      warp,
      new cv.Size(srcOn.cols, srcOn.rows),
      cv.INTER_LINEAR | cv.WARP_INVERSE_MAP
    );
    [gOn, gOff, warp].forEach((m) => m.delete());
    return out;
  }

  function matchMean(on: cv.Mat, off: cv.Mat): cv.Mat {
    const meanOn = cv.mean(toGray(on))[0];
    const meanOff = cv.mean(toGray(off))[0];
    const gain = meanOff / meanOn;
    const dst = new cv.Mat();
    on.convertTo(dst, -1, gain, 0);
    return dst;
  }
  return { detectFluorescence };
};
