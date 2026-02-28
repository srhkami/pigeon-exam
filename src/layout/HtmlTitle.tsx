import {Helmet, HelmetProvider} from "react-helmet-async";

type Props = {
  readonly title?: string;
}
export default function HtmlTitle({title}:Props) {

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title ? `${title} - 鴿手` : '鴿手'}</title>
      </Helmet>
    </HelmetProvider>
  )
}