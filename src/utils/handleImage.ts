import imageCompression from 'browser-image-compression';

export const handleImageCompression = async (file: File, name: string) => {
  // 壓縮設定
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 2000,
    useWebWorker: true,
    fileType: 'image/jpeg' // 強制轉檔為 jpeg
  };

  // 壓縮並轉檔
  const compressedFile = await imageCompression(file, options);
  const time = Date.now();
  return new File([compressedFile], `${name}-${time}.jpg`, {
    type: compressedFile.type,
    lastModified: time,
  });
}