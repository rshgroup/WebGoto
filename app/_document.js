import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Add Google Site Verification Meta Tag here */}
          <meta name="google-site-verification" content="kJr6PLN6mLzxqBCdx4t6AhJba_GRj47yPo2IcwVtgpo" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
