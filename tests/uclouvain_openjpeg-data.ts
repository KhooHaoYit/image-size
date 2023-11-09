import { deepStrictEqual } from "assert";
import { getImageSizeResult, getStreamBasedResult } from ".";

const func = async () => {
  for (const [file, expectedValue] of Object.entries(files)) {
    console.log(file);
    const url = `https://raw.githubusercontent.com/uclouvain/openjpeg-data/master/baseline/conformance/${file}`;
    const res = await fetch(url);
    if (res.status !== 200) {
      console.warn(file, 'returned', res.status);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const [imageSize, streamBased] = await Promise.all([
      getImageSizeResult({ buffer }),
      getStreamBasedResult({ buffer }),
    ]);
    try {
      deepStrictEqual(
        streamBased.imageSize,
        imageSize,
      );
      console.log('imageSize: OK');
    } catch (err) {
      console.log(streamBased.imageSize);
      console.log(imageSize);
    }
    try {
      deepStrictEqual(
        streamBased.sizes,
        expectedValue,
      );
      console.log('streamBased: OK');
    } catch (err) {
      console.log(streamBased.sizes);
      console.log(expectedValue);
    }
  }
}

const files = {
  'a1_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'a2_colr.ppm': [[{ width: 256, height: 149 }, 'pnm']],
  'a3_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'a4_colr.ppm': [[{ width: 4336, height: 1037 }, 'pnm']],
  'a5_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'a6_mono_colr_0.pgm': [[{ width: 3323, height: 891 }, 'pnm']],
  'a6_mono_colr_1.pgm': [[{ width: 3323, height: 891 }, 'pnm']],
  'a6_mono_colr_2.pgm': [[{ width: 3323, height: 891 }, 'pnm']],
  'a6_mono_colr_3.pgm': [[{ width: 3323, height: 891 }, 'pnm']],
  'b1_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'b2_mono.ppm': [[{ width: 1518, height: 537 }, 'pnm']],
  'b3_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'c0p0_01.pgx': [],
  'c0p0_02.pgx': [],
  'c0p0_03r0.pgx': [],
  'c0p0_03r1.pgx': [],
  'c0p0_04.pgx': [],
  'c0p0_05.pgx': [],
  'c0p0_06.pgx': [],
  'c0p0_07.pgx': [],
  'c0p0_08.pgx': [],
  'c0p0_09.pgx': [],
  'c0p0_10.pgx': [],
  'c0p0_11.pgx': [],
  'c0p0_12.pgx': [],
  'c0p0_13.pgx': [],
  'c0p0_14.pgx': [],
  'c0p0_15r0.pgx': [],
  'c0p0_15r1.pgx': [],
  'c0p0_16.pgx': [],
  'c0p1_01.pgx': [],
  'c0p1_02.pgx': [],
  'c0p1_03.pgx': [],
  'c0p1_04r0.pgx': [],
  'c0p1_04r3.pgx': [],
  'c0p1_05.pgx': [],
  'c0p1_06.pgx': [],
  'c0p1_07.pgx': [],
  'c1_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'c1p0_01_0.pgx': [],
  'c1p0_02_0.pgx': [],
  'c1p0_03_0.pgx': [],
  'c1p0_04_0.pgx': [],
  'c1p0_04_1.pgx': [],
  'c1p0_04_2.pgx': [],
  'c1p0_05_0.pgx': [],
  'c1p0_05_1.pgx': [],
  'c1p0_05_2.pgx': [],
  'c1p0_05_3.pgx': [],
  'c1p0_06_0.pgx': [],
  'c1p0_06_1.pgx': [],
  'c1p0_06_2.pgx': [],
  'c1p0_06_3.pgx': [],
  'c1p0_07_0.pgx': [],
  'c1p0_07_1.pgx': [],
  'c1p0_07_2.pgx': [],
  'c1p0_08_0.pgx': [],
  'c1p0_08_1.pgx': [],
  'c1p0_08_2.pgx': [],
  'c1p0_09_0.pgx': [],
  'c1p0_10_0.pgx': [],
  'c1p0_10_1.pgx': [],
  'c1p0_10_2.pgx': [],
  'c1p0_11_0.pgx': [],
  'c1p0_12_0.pgx': [],
  'c1p0_13_0.pgx': [],
  'c1p0_13_1.pgx': [],
  'c1p0_13_2.pgx': [],
  'c1p0_13_3.pgx': [],
  'c1p0_14_0.pgx': [],
  'c1p0_14_1.pgx': [],
  'c1p0_14_2.pgx': [],
  'c1p0_15_0.pgx': [],
  'c1p0_16_0.pgx': [],
  'c1p1_01_0.pgx': [],
  'c1p1_02_0.pgx': [],
  'c1p1_02_1.pgx': [],
  'c1p1_02_2.pgx': [],
  'c1p1_03_0.pgx': [],
  'c1p1_03_1.pgx': [],
  'c1p1_03_2.pgx': [],
  'c1p1_03_3.pgx': [],
  'c1p1_04_0.pgx': [],
  'c1p1_05_0.pgx': [],
  'c1p1_05_1.pgx': [],
  'c1p1_05_2.pgx': [],
  'c1p1_06_0.pgx': [],
  'c1p1_06_1.pgx': [],
  'c1p1_06_2.pgx': [],
  'c1p1_07_0.pgx': [],
  'c1p1_07_1.pgx': [],
  'c2_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'd1_colr.ppm': [[{ width: 256, height: 149 }, 'pnm']],
  'd2_colr.ppm': [[{ width: 256, height: 149 }, 'pnm']],
  'e1_colr.ppm': [[{ width: 256, height: 149 }, 'pnm']],
  'e2_colr.ppm': [[{ width: 1023, height: 594 }, 'pnm']],
  'f1_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'f2_mono.ppm': [[{ width: 303, height: 179 }, 'pnm']],
  'g1_colr.ppm': [[{ width: 256, height: 149 }, 'pnm']],
  'g2_colr.ppm': [[{ width: 256, height: 149 }, 'pnm']],
  'g3_colr.ppm': [[{ width: 256, height: 149 }, 'pnm']],
  'g4_colr.ppm': [[{ width: 256, height: 149 }, 'pnm']],
  'jp2_1.tif': [[{ width: 768, height: 512 }, 'tiff']],
  'jp2_2.tif': [[{ width: 480, height: 640 }, 'tiff']],
  'jp2_3.tif': [[{ width: 480, height: 640 }, 'tiff']],
  'jp2_4.tif': [[{ width: 768, height: 512 }, 'tiff']],
  'jp2_5.tif': [[{ width: 768, height: 512 }, 'tiff']],
  'jp2_6.tif': [[{ width: 768, height: 512 }, 'tiff']],
  'jp2_7.tif': [[{ width: 480, height: 640 }, 'tiff']],
  'jp2_8.tif': [[{ width: 700, height: 400 }, 'tiff']],
  'jp2_9.tif': [[{ width: 768, height: 512 }, 'tiff']],
  'subsampling_1.ppm': [[{ width: 1280, height: 1024 }, 'pnm']],
  'subsampling_2.ppm': [[{ width: 640, height: 512 }, 'pnm']],
  'zoo1.ppm': [[{ width: 3906, height: 2602 }, 'pnm']],
  'zoo2.ppm': [[{ width: 1953, height: 1301 }, 'pnm']],
};

func();
