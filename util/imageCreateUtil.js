const puppeteer = require('puppeteer');
const sharp = require('sharp');

async function createFooterImage(footerInfo, width, bgColor, height, imgLink) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <style>
      * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
      }
      img {
        width: 100vw;
        margin: 0px;
        object-fit: cover;
      }
      .footer {
        margin: -5px;
        width: 100%;
        height: 200px;
        background-color: ${bgColor || "#000"};
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
        .logo_container {
            width: 15%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            ${footerInfo.isLogo ? '' : 'display:none;'}
        }
        .logo_container img {
            width: 90%;
            object-fit: cover;
            border-radius: 100%;
            background-color: #fff;
        }
        .info_container {
            min-width: 50%;
            max-width: 80%;
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            gap: 20px 40px;
            color: #fff;
            font-size: 28px;
            align-items: center;  
            font-family: system-ui, sans-serif;

        }
        .info {
            display: flex;
            ${footerInfo.isLogo ? 'justify-content: start;' : 'justify-content: center;'}
            align-items: center;
        }
        i {
            margin-right: 10px;
        }
    </style>
  </head>
  <body>
    <img src="https://utility.caclouddesk.com/uploads/${imgLink}"/>
    <div class="footer">
        <div class="logo_container">
            <img src="${footerInfo.logoBase64 || "https://as2.ftcdn.net/v2/jpg/04/78/56/33/1000_F_478563312_HuepEVbPHRGC0dsbXOXL1YSuFIkWEm2m.jpg"}"/>
        </div>
        <div class="info_container">
            <div class="info">
                <i class="fa fa-user"></i>
                <p>
                    <span>${footerInfo.name}</span>
                </p>
            </div>
            <div class="info">
                <i class="fa fa-phone"></i>
                <p>
                    <span>${footerInfo.phone}</span>
                </p>
            </div>
            ${footerInfo.email ? `
            <div class="info">
                <i class="fa fa-envelope"></i>
                <p>
                    <span>${footerInfo.email}</span>
                </p>
            </div>`: ''}
        </div>
    </div>
    
  </body>
</html>
`
  // console.log(htmlContent)
  await page.setContent(htmlContent);
  await page.setViewport({ width: width, height: height });
  const footerBuffer = await page.screenshot({ omitBackground: true });

  await browser.close();
  return footerBuffer;
}
async function addFooterToImage(imageBuffer, footerInfo, bgColor, imgLink) {
  try {
    // Load the original image
    const image = sharp(imageBuffer);

    // Get the metadata of the image
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;

    // Create the footer image using HTML and CSS
    const footerBuffer = await createFooterImage(footerInfo, width, bgColor, height + 200, imgLink);
    // Composite the footer with the original image
    return footerBuffer

  } catch (err) {
    console.log(err)
    throw Error('Error processing image');
  }
}

exports.addFooterToImage = addFooterToImage;
