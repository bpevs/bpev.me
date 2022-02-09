import React from "react";

const audioFile = /\.(mp3|wav)$/;

export type AudioProps = React.AudioHTMLAttributes<any> & {
  context: any;
};

export function Audio({ src = "", ...props }: AudioProps) {
  const audioType = getAudioType(src);

  switch (audioType) {
    case "FILE":
    default: {
      const fileType = (src.match(audioFile) || [])[1];
      const additionalProps: any = {};
      if (fileType) additionalProps.type = `audio/${fileType}`;

      return (
        <audio
          className="center col-12"
          controls
          src={src}
          {...additionalProps}
          {...props}
        >
          <source src={src} />
          Your browser does not support this audio.
        </audio>
      );
    }
  }
}

export function getAudioType(src: string): string | null {
  if (audioFile.test(src)) return "FILE";
  return null;
}

export function isAudio(src: string): boolean {
  return Boolean(getAudioType(src));
}
