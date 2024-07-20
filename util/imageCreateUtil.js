const puppeteer = require('puppeteer');
const sharp = require('sharp');

async function createFooterImage(footerInfo, width, bgColor, height) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = `
      <html>
    <head>
      <style>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          }
        .footer {
          background:${bgColor || '#000'};
          padding-top: 5px;
          padding-bottom: 5px;
          }
        .wrapper {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .info {
          margin-left: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .info-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px;
          margin-right: 20px;
          color: #fff;
          font-size: 2rem;
          font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        }

 .logo-wrapper{
            border-radius: 999px;
            background: #fff;
        }

      </style>
    </head>
    <body>
      <div class="footer">
        <div class="wrapper">
            <div class="logo-wrapper">
                <img src="${footerInfo.logoBase64 || "data:image/jpeg;base64,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"}"
                alt="" style="height:90vh; margin:5px; "/>
            </div>
            <div class="info">
            <div class="info-wrap">
              <svg
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="9" r="3" stroke="#fff" stroke-width="1.5" />
                <circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="1.5" />
                <path
                  d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <p>${footerInfo.name}</p>
            </div>
            <div class="info-wrap">
              <svg
                width="40px"
                height="40px"
                viewBox="0 -0.5 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.24033 8.16795C6.99433 7.37295 7.26133 7.14995 7.58233 7.04695C7.80482 6.98843 8.03822 6.98499 8.26233 7.03695C8.55733 7.12295 8.63433 7.18795 9.60233 8.15095C10.4523 8.99695 10.5363 9.08895 10.6183 9.25095C10.7769 9.54253 10.8024 9.88825 10.6883 10.1999C10.6043 10.4349 10.4803 10.5909 9.96533 11.1089L9.62933 11.4459C9.54093 11.5356 9.51997 11.6719 9.57733 11.7839C10.3232 13.0565 11.3812 14.1179 12.6513 14.8679C12.7978 14.9465 12.9783 14.921 13.0973 14.8049L13.4203 14.4869C13.6199 14.2821 13.8313 14.0891 14.0533 13.9089C14.4015 13.6935 14.8362 13.6727 15.2033 13.8539C15.3823 13.9379 15.4423 13.9929 16.3193 14.8669C17.2193 15.7669 17.2483 15.7959 17.3493 16.0029C17.5379 16.3458 17.536 16.7618 17.3443 17.1029C17.2443 17.2949 17.1883 17.3649 16.6803 17.8839C16.3733 18.1979 16.0803 18.4839 16.0383 18.5259C15.6188 18.8727 15.081 19.043 14.5383 19.0009C13.5455 18.9101 12.5847 18.6029 11.7233 18.1009C9.81416 17.0894 8.18898 15.6155 6.99633 13.8139C6.73552 13.4373 6.50353 13.0415 6.30233 12.6299C5.76624 11.7109 5.48909 10.6638 5.50033 9.59995C5.54065 9.04147 5.8081 8.52391 6.24033 8.16795Z"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.8417 4.29409C14.4518 4.15416 14.0224 4.35677 13.8824 4.74664C13.7425 5.1365 13.9451 5.56598 14.335 5.70591L14.8417 4.29409ZM18.7868 10.0832C18.9333 10.4707 19.3661 10.666 19.7536 10.5195C20.141 10.373 20.3364 9.94021 20.1899 9.55276L18.7868 10.0832ZM13.6536 6.52142C13.2495 6.43018 12.848 6.68374 12.7568 7.08778C12.6655 7.49182 12.9191 7.89333 13.3231 7.98458L13.6536 6.52142ZM16.5696 11.1774C16.6676 11.5799 17.0733 11.8267 17.4757 11.7287C17.8782 11.6307 18.125 11.2251 18.0271 10.8226L16.5696 11.1774ZM14.335 5.70591C16.3882 6.44286 18.0153 8.04271 18.7868 10.0832L20.1899 9.55276C19.2631 7.10139 17.3084 5.17942 14.8417 4.29409L14.335 5.70591ZM13.3231 7.98458C14.9238 8.34607 16.1815 9.58301 16.5696 11.1774L18.0271 10.8226C17.5042 8.67475 15.8098 7.0084 13.6536 6.52142L13.3231 7.98458Z"
                  fill="#fff"
                />
              </svg>
              <p>${footerInfo.phone}</p>
            </div>
            <div class="info-wrap">
              <svg
                fill="#fff"
                width="30px"
                height="30px"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7.38A7.82 7.82 0 0 0 8 .5a7.82 7.82 0 0 0-8 6.88v1.24a7.82 7.82 0 0 0 8 6.88 7.82 7.82 0 0 0 8-6.88V7.38zm-1.25 0h-3a11.34 11.34 0 0 0-.43-2.54 7.6 7.6 0 0 0 1.75-1 6 6 0 0 1 1.65 3.54zm-9.18 0a9.69 9.69 0 0 1 .37-2.14A8.43 8.43 0 0 0 8 5.5a8.49 8.49 0 0 0 2.09-.26 10.2 10.2 0 0 1 .37 2.14zm4.92 1.24a9.59 9.59 0 0 1-.37 2.14 8.53 8.53 0 0 0-4.18 0 9.69 9.69 0 0 1-.37-2.14zm.4-5A11.82 11.82 0 0 0 10 2a6.89 6.89 0 0 1 2 1 6.57 6.57 0 0 1-1.14.66zm-2.6-1.86a10 10 0 0 1 1.38 2.3A7.63 7.63 0 0 1 8 4.25a7.56 7.56 0 0 1-1.67-.19 9.82 9.82 0 0 1 1.38-2.3h.58zm-3.15 1.9A6.57 6.57 0 0 1 4 3a6.89 6.89 0 0 1 2-1 10.38 10.38 0 0 0-.86 1.66zM3 3.83a7.6 7.6 0 0 0 1.75 1 11 11 0 0 0-.43 2.54h-3A6 6 0 0 1 3 3.83zM1.28 8.62h3a11 11 0 0 0 .43 2.54 7.6 7.6 0 0 0-1.75 1 6 6 0 0 1-1.68-3.54zm3.86 3.72A10.38 10.38 0 0 0 6 14a6.89 6.89 0 0 1-2-1 6.57 6.57 0 0 1 1.14-.66zm2.57 1.9a9.82 9.82 0 0 1-1.38-2.3 7.43 7.43 0 0 1 3.34 0 9.76 9.76 0 0 1-1.38 2.3h-.58zm3.15-1.9a6.57 6.57 0 0 1 1.19.66 7.24 7.24 0 0 1-2 1 11.48 11.48 0 0 0 .81-1.66zm2.14-.17a7.6 7.6 0 0 0-1.75-1 10.8 10.8 0 0 0 .43-2.54h3A6 6 0 0 1 13 12.17z"
                />
              </svg>
              <p>${footerInfo.email}</p>
            </div>
            <div class="info-wrap">
              <svg
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.02832 10L10.2246 14.8166C10.8661 15.2443 11.1869 15.4581 11.5336 15.5412C11.8399 15.6146 12.1593 15.6146 12.4657 15.5412C12.8124 15.4581 13.1332 15.2443 13.7747 14.8166L20.971 10M10.2981 4.06879L4.49814 7.71127C3.95121 8.05474 3.67775 8.22648 3.4794 8.45864C3.30385 8.66412 3.17176 8.90305 3.09111 9.161C3 9.45244 3 9.77535 3 10.4212V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V10.4212C21 9.77535 21 9.45244 20.9089 9.161C20.8282 8.90305 20.6962 8.66412 20.5206 8.45864C20.3223 8.22648 20.0488 8.05474 19.5019 7.71127L13.7019 4.06879C13.0846 3.68116 12.776 3.48735 12.4449 3.4118C12.152 3.34499 11.848 3.34499 11.5551 3.4118C11.224 3.48735 10.9154 3.68116 10.2981 4.06879Z"
                  stroke="#fff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p>${footerInfo.website}</p>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  await page.setContent(htmlContent);
  await page.setViewport({ width: width, height: parseInt(height) });
  const footerBuffer = await page.screenshot({ omitBackground: true });

  await browser.close();
  return footerBuffer;
}
async function addFooterToImage(imageBuffer, footerInfo, bgColor) {
  try {
    // Load the original image
    const image = sharp(imageBuffer);

    // Get the metadata of the image
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;

    // Create the footer image using HTML and CSS
    const footerBuffer = await createFooterImage(footerInfo, width, bgColor, height / 7);

    // Composite the footer with the original image
    return await sharp(imageBuffer)
      .extend({
        bottom: height/7,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .composite([{ input: footerBuffer, top: height, left: 0 }]).toBuffer();

  } catch (err) {
    console.log(err)
    throw Error('Error processing image');
  }
}

exports.addFooterToImage = addFooterToImage;