import {Viewer, Worker} from '@react-pdf-viewer/core';
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type Prop = {
  url: string,
}

export default function PDFViewer({url}: Prop) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div className="w-full overflow-auto rounded-xl">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
          withCredentials={false}
          defaultScale={1.5}
          transformGetDocumentParams={(params) => ({
            ...params,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
            cMapPacked: true,
          })}
        />
      </Worker>
    </div>
  )
}