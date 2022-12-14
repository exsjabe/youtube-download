import ffmpeg from '../fluent-ffmpeg';
import {DownloadConfig} from '../constants';
import ytdl from 'ytdl-core';
import concat from 'concat-stream';
import {Base64Encode} from 'base64-stream';
import os from 'os';
import {join} from 'path';

const getFFMPEGPath = () => {
  const platform = process.env['npm_config_platform'] || os.platform();

  return join(
    process.cwd(),
    'node_modules',
    'ffmpeg-static',
    platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
  );
};

type GetStreamProps = {
  videoId: string;
  format: 'video' | 'audio';
};
export const getStream = ({videoId, format}: GetStreamProps) => {
  if (!ytdl.validateID(videoId)) {
    throw new Error('Video ID is required');
  }

  const {FileExtension, ...config} = DownloadConfig[format];

  ffmpeg.setFfmpegPath(getFFMPEGPath());

  return ffmpeg(ytdl(videoId, {...config})).format(FileExtension);
};

export const DATA_URI_PREFIX = 'data:application/octet-stream;base64,' as const;
export const getStreamAsDataURI = (props: GetStreamProps) => {
  return new Promise<string>((resolve, reject) => {
    const base64Stream = new Base64Encode({
      prefix: DATA_URI_PREFIX,
    });

    const concatCallback = (data: unknown) => resolve(data as string);

    getStream(props)
      .pipe(base64Stream)
      .pipe(concat(concatCallback))
      .on('error', reject);
  });
};
