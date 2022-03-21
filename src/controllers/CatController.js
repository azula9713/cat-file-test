import fs from "fs";
import path from "path";
import axios from "axios";
import jimp from "jimp";

const __dirname = path.resolve();

const catObject = {
  greeting: "Hello",
  who: "You",
  width: 400,
  height: 500,
  color: "Pink",
  size: 100,
  url: "https://cataas.com/cat/says/",
};
const encoding = "binary";

const firstReq = async () => {
  const urlFirst =
    catObject.url +
    catObject.greeting +
    "?width=" +
    catObject.width +
    "&height=" +
    catObject.height +
    "&color=" +
    catObject.color +
    "&s=" +
    catObject.size;

  try {
    await axios
      .get(urlFirst, { responseType: "arraybuffer" })
      .then((response) => {
        //if there is file, delete it
        fs.writeFile(
          __dirname + "/output/cat1.png",
          response.data,
          encoding,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("File1 saved!");
            }
          }
        );
        return response.data;
      });
  } catch (err) {
    console.log(err);
  }
};

const secondReq = async () => {
  const urlSecond =
    catObject.url +
    catObject.who +
    "?width=" +
    catObject.width +
    "&height=" +
    catObject.height +
    "&color=" +
    catObject.color +
    "&s=" +
    catObject.size;

  try {
    await axios
      .get(urlSecond, { responseType: "arraybuffer" })
      .then((response) => {
        fs.writeFile(
          __dirname + "/output/cat2.png",
          response.data,
          encoding,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("File2 saved!");
              combineImage();
            }
          }
        );
        return response.data;
      });
  } catch (err) {
    console.log(err);
  }
};

const combineImage = async () => {
  const cat1 = fs.readFileSync(__dirname + "/output/cat1.png");
  const cat2 = fs.readFileSync(__dirname + "/output/cat2.png");

  const cats = [cat1, cat2];
  const jimps = [];

  for (const cat of cats) {
    jimps.push(jimp.read(cat));
  }

  await Promise.all(jimps).then((images) => {
    let newImage = new jimp(
        images[0].bitmap.width * 2,
        images[0].bitmap.height,
        0xffffffff
      ),
      x = 0,
      y = 0;

    for (const image of images) {
      newImage.blit(image, x, y);
      x += image.bitmap.width;
    }

    newImage.write(__dirname + "/output/cat.png");
  });
};

const getMyImage = async (req, res) => {
  try {
    //wait until both files are downloaded
    await Promise.all([secondReq(), firstReq()]);

    if (fs.existsSync(__dirname + "/output/cat.png")) {
      res.send("File saved in output folder!");
    } else {
      res.send("Error!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export { getMyImage };
