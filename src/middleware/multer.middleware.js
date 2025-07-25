import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("destination-file",file);
    
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
     console.log("destination-filename",file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage });
