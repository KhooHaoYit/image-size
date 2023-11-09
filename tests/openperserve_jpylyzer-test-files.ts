import { deepStrictEqual } from "assert";
import { getImageSizeResult, getStreamBasedResult } from ".";

const func = async () => {
  for (const [file, expectedValue] of Object.entries(files)) {
    console.log(file);
    const url = `https://raw.githubusercontent.com/openpreserve/jpylyzer-test-files/master/files/${file}`;
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

const files = <const>{
  'aware.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-xsiz-10918.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-xsiz-10928.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-xsiz-10937.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-xsiz-10946.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-xsiz-10955.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-ysiz-11208.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-ysiz-11218.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-ysiz-11227.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-ysiz-11238.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-codestreamheader-corrupted-ysiz-11252.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-headerbox-corrupted-boxlength-22181.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-1911.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-1920.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-1937.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-1951.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-1961.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-1971.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-1984.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-1999.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-2011.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-icc-corrupted-tagcount-2021.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-resolutionbox-corrupted-boxlength-8127.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-resolutionbox-corrupted-boxlength-8154.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'bitwiser-resolutionbox-corrupted-boxlength-8730.jp2': [[{ height: 16, width: 16 }, 'jp2']],
  'data_missing_in_last_tilepart.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'empty.jp2': [],
  'erdas-nullinput-uint8-rgb-null-2tileparts.jp2': [[{ height: 512, width: 512 }, 'jp2']],
  'erdas-sandiego1m_null.jp2': [[{ height: 2044, width: 2058 }, 'jp2']],
  'erdas-sandiego3i_5.2.jp2': [[{ height: 2996, width: 2980 }, 'jp2']],
  'erdas-sandiego3i_5.5.jp2': [[{ height: 2996, width: 2980 }, 'jp2']],
  'graphicsMagick.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'grok-ht.j2c': [[{ width: 500, height: 681 }, 'j2c']],
  'grok-ht.jhc': [[{ width: 500, height: 681 }, 'j2c']],
  'height_image_header_damaged.jp2': [[{ height: 3702, width: 2717 }, 'jp2']],
  'htj2k_cpf_broadcast.jhc': [[{ width: 1280, height: 720 }, 'j2c']],
  'invalid_character_in_codestream_comment.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'invalid_character_in_xml.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'is_codestream.jp2': [[{ width: 2717, height: 3701 }, 'j2c']],
  'is_jpeg.jp2': [[{ height: 3701, width: 2717, orientation: null }, 'jpg']],
  'is_jpm.jp2': [],
  'is_jpx.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'jpx_disguised_as_jp2.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'kakadu61.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'kakadu71.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'last_byte_missing.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'meth_is_2_no_icc.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'missing_null_terminator_in_urlbox.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'modified_date_out_of_range.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'null_character_in_codestream_comment.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'null_terminated_content_in_xml_box.jp2': [[{ height: 4096, width: 4096 }, 'jp2']],
  'oht-ht.j2c': [[{ width: 2717, height: 3701 }, 'j2c']],
  'oht-ht.jhc': [[{ width: 2717, height: 3701 }, 'j2c']],
  'oht-ht.jph': [[{ height: 3701, width: 2717 }, 'jp2']],
  'oj-ht-byte.jph': [[{ height: 20, width: 20 }, 'jp2']],
  'oj-ht-byte_causal.jhc': [[{ width: 20, height: 20 }, 'j2c']],
  'oj-illegal-rcom-value.jp2': [[{ height: 480, width: 640 }, 'jp2']],
  'oj-issue363-4740.jp2': [[{ height: 14, width: 4311 }, 'jp2']],
  'oj-plm-main-header.jp2': [[{ height: 4860, width: 3689 }, 'jp2']],
  'oj-poc-main-header.jp2': [[{ height: 576, width: 766 }, 'jp2']],
  'oj-ppm-main-header-1.jp2': [[{ height: 480, width: 640 }, 'jp2']],
  'oj-ppm-main-header-2.jp2': [[{ height: 11, width: 38 }, 'jp2']],
  'oj-ppm-main-header-3.jp2': [[{ height: 48, width: 48 }, 'jp2']],
  'oj-ppt-tilepart-header.jp2': [[{ height: 48, width: 48 }, 'jp2']],
  'oj-rgn-main-header-1.jp2': [[{ height: 1, width: 1 }, 'jp2']],
  'oj-rgn-tilepart-header-1.jp2': [[{ height: 256, width: 256 }, 'jp2']],
  'oj-tileindex-error-1.jp2': [[{ height: 505, width: 746 }, 'jp2']],
  'oj-tileindex-error-2.jp2': [[{ height: 20, width: 20 }, 'jp2']],
  'oj-tileindex-error-3.jp2': [[{ height: 134234592, width: 640 }, 'jp2']],
  'oj-tileindex-error-4.jp2': [[{ height: 4074, width: 2596 }, 'jp2']],
  'oj-tileindex-error-5.jp2': [[{ height: 4, width: 4 }, 'jp2']],
  'oj-tnsot-0.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'oj-xtsiz-not-valid-1.jp2': [[{ height: 256, width: 256 }, 'jp2']],
  'oj-ytsiz-not-valid-1.jp2': [[{ height: 512, width: 372 }, 'jp2']],
  'oj-ytsiz-not-valid-2.jp2': [[{ height: 1754, width: 1240 }, 'jp2']],
  'ojph-ht.j2c': [[{ width: 2717, height: 3701 }, 'j2c']],
  'ojph-ht.jhc': [[{ width: 2717, height: 3701 }, 'j2c']],
  'openJPEG15.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'palettedImage.jp2': [[{ height: 1024, width: 1024 }, 'jp2']],
  'profile-0.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-1.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-2.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-broadcast.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-cinema2k.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-cinema2s.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-cinema4k.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-cinema4s.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-cinemass.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-imf.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'profile-part2.j2c': [[{ width: 793, height: 1080 }, 'j2c']],
  'reference.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'sentinel.jp2': [[{ height: 1830, width: 1830 }, 'jp2']],
  'signature_corrupted.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'tika-crg-main-header.jp2': [[{ height: 1200, width: 1920 }, 'jp2']],
  'tika-tlm-main-header.jp2': [[{ height: 2720, width: 2377 }, 'jp2']],
  'triggerUnboundLocalError.jp2': [[{ height: 8168, width: 4520 }, 'jp2']],
  'truncated_at_byte_5000.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  'wrongbpc-ht.jph': [[{ height: 3701, width: 2717 }, 'jp2']],
  'ランダム日本語テキスト.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  '隨機中國文字.jp2': [[{ height: 3701, width: 2717 }, 'jp2']],
  // '���񠊾𜰸􉵢󦲀.jp2': null,
  // '󒀛򶽇򦠡���򔽠.jp2': null,
  // '󞩚񠤨񐤞���𵌹.jp2': null,
};

func();
